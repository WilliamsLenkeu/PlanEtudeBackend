import { Request, Response, NextFunction } from 'express';
import { SubjectService } from '../application/SubjectService';
import { SubjectResponseDto } from './Dtos';
import { Logger } from '../../../core/logging/Logger';

export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  createSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const { name, color } = req.body;

      const subject = await this.subjectService.createSubject(userId, { name, color });
      const response = SubjectResponseDto.fromDomain(subject);

      res.status(201).json({
        success: true,
        message: 'Matière créée avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  getSubjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const subjects = await this.subjectService.getSubjects(userId);
      const response = subjects.map(s => SubjectResponseDto.fromDomain(s));

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  getSubjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const subjectId = req.params.id;

      const subject = await this.subjectService.getSubjectById(subjectId, userId);
      const response = SubjectResponseDto.fromDomain(subject);

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  updateSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const subjectId = req.params.id;
      const updates = req.body;

      const subject = await this.subjectService.updateSubject(subjectId, userId, updates);
      const response = SubjectResponseDto.fromDomain(subject);

      res.json({
        success: true,
        message: 'Matière mise à jour avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  deleteSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const subjectId = req.params.id;

      await this.subjectService.deleteSubject(subjectId, userId);

      res.json({
        success: true,
        message: 'Matière supprimée avec succès'
      });
    } catch (error) {
      next(error);
    }
  };
}