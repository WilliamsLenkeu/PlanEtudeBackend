import { Request, Response, NextFunction } from 'express';
import { IProgressService } from '../application/Services';
import { ProgressResponseDto, ProgressSummaryDto, ProgressHistoryDto, ProgressStatsDto } from './Dtos';
import { Logger } from '../../../core/logging/Logger';

export class ProgressController {
  constructor(private progressService: IProgressService) {}

  recordProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const data = req.body;

      const progress = await this.progressService.recordProgress({
        userId,
        date: data.date,
        sessionsCompletees: data.sessionsCompletees,
        tempsEtudie: data.tempsEtudie,
        notes: data.notes
      });

      const response = ProgressResponseDto.fromDomain(progress);

      res.status(201).json({
        success: true,
        message: 'Progression enregistrée avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  getProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const progressId = req.params.id;

      const progress = await this.progressService.getProgress(progressId, userId);
      const response = ProgressResponseDto.fromDomain(progress);

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  getUserProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const options = {
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };

      const result = await this.progressService.getUserProgress(userId, options);

      const progressResponse = result.progressList.map(p => ProgressResponseDto.fromDomain(p));

      res.json({
        success: true,
        data: progressResponse,
        pagination: {
          total: result.total,
          limit: options.limit || 10,
          offset: options.offset || 0
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getProgressSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const summary = await this.progressService.getProgressSummary(userId);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  };

  getProgressHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const days = req.query.days ? parseInt(req.query.days as string) : 7;

      const history = await this.progressService.getProgressHistory(userId, days);

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const { startDate, endDate } = req.query;

      const stats = await this.progressService.getStats(
        userId,
        startDate as string,
        endDate as string
      );

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const progressId = req.params.id;

      await this.progressService.deleteProgress(progressId, userId);

      res.json({
        success: true,
        message: 'Progression supprimée avec succès'
      });
    } catch (error) {
      next(error);
    }
  };
}