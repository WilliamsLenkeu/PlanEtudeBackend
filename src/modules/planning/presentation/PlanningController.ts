import { Request, Response, NextFunction } from 'express';
import { IPlanningService } from '../application/Services';
import { PlanningResponseDto, PlanningsListDto, ICalExportDto } from './Dtos';
import { Logger } from '../../../core/logging/Logger';

export class PlanningController {
  constructor(private planningService: IPlanningService) {}

  createPlanning = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const data = req.body;

      const planning = await this.planningService.createPlanning({
        userId,
        titre: data.titre,
        periode: data.periode,
        nombre: data.nombre,
        dateDebut: data.dateDebut,
        sessions: data.sessions,
        generatedBy: data.generatedBy
      });

      const response = PlanningResponseDto.fromDomain(planning);

      res.status(201).json({
        success: true,
        message: 'Planning créé avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  getPlanning = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const planningId = req.params.id;

      const planning = await this.planningService.getPlanning(planningId, userId);
      const response = PlanningResponseDto.fromDomain(planning);

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  getUserPlannings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const options = {
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      const result = await this.planningService.getUserPlannings(userId, options);

      const planningsResponse = result.plannings.map(p => PlanningResponseDto.fromDomain(p));
      const totalPages = Math.ceil(result.total / (options.limit || 10));

      res.json({
        success: true,
        data: planningsResponse,
        pagination: {
          total: result.total,
          page: (options.offset || 0) / (options.limit || 10) + 1,
          limit: options.limit || 10,
          totalPages
        }
      });
    } catch (error) {
      next(error);
    }
  };

  updatePlanning = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const planningId = req.params.id;
      const updates = req.body;

      const planning = await this.planningService.updatePlanning(planningId, userId, updates);
      const response = PlanningResponseDto.fromDomain(planning);

      res.json({
        success: true,
        message: 'Planning mis à jour avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  deletePlanning = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const planningId = req.params.id;

      await this.planningService.deletePlanning(planningId, userId);

      res.json({
        success: true,
        message: 'Planning supprimé avec succès'
      });
    } catch (error) {
      next(error);
    }
  };

  addSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const planningId = req.params.id;
      const session = req.body;

      const planning = await this.planningService.addSession(planningId, userId, session);
      const response = PlanningResponseDto.fromDomain(planning);

      res.json({
        success: true,
        message: 'Session ajoutée avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  updateSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const planningId = req.params.id;
      const sessionId = req.params.sessionId;
      const updates = req.body;

      const planning = await this.planningService.updateSession(planningId, userId, sessionId, updates);
      const response = PlanningResponseDto.fromDomain(planning);

      res.json({
        success: true,
        message: 'Session mise à jour avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  deleteSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const planningId = req.params.id;
      const sessionId = req.params.sessionId;

      const planning = await this.planningService.deleteSession(planningId, userId, sessionId);
      const response = PlanningResponseDto.fromDomain(planning);

      res.json({
        success: true,
        message: 'Session supprimée avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  exportICal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const planningId = req.params.id;

      const planning = await this.planningService.getPlanning(planningId, userId);

      // Utiliser le service d'export directement
      const { ICalExportService } = await import('../application/PlanningService');
      const exportService = new ICalExportService();
      const ical = await exportService.generateICal(planning);

      const filename = `planning-${planning.titre.replace(/\s+/g, '-')}.ics`;

      res.setHeader('Content-Type', 'text/calendar');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(ical);
    } catch (error) {
      next(error);
    }
  };
}