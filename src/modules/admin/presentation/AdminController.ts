import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../application/AdminService';
import { AdminStatsDto, AdminUserDto, UsersListDto } from './Dtos';
import { Logger } from '../../../core/logging/Logger';

export class AdminController {
  constructor(private adminService: AdminService) {}

  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const stats = await this.adminService.getStats();
      const response = new AdminStatsDto(
        stats.totalUsers,
        stats.totalPlannings,
        stats.totalProgressRecords,
        stats.activeUsersToday,
        stats.totalStudyTime,
        stats.averageSessionDuration
      );

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const options = {
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0
      };

      const result = await this.adminService.getUsers(options);

      const usersResponse = result.users.map(u => new AdminUserDto(
        u._id || u.id,
        u.email,
        u.name,
        u.role,
        u.isBlocked || false,
        u.createdAt,
        u.studyStats || { totalStudyTime: 0 }
      ));

      const totalPages = Math.ceil(result.total / options.limit);

      res.json({
        success: true,
        data: new UsersListDto(usersResponse, result.total, {
          page: Math.floor(options.offset / options.limit) + 1,
          limit: options.limit,
          totalPages
        })
      });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const { id } = req.params;
      const user = await this.adminService.getUserById(id);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  getUserActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const { id } = req.params;
      const activity = await this.adminService.getUserActivity(id);

      res.json({
        success: true,
        data: activity
      });
    } catch (error) {
      next(error);
    }
  };

  blockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const { id } = req.params;
      const user = await this.adminService.blockUser(id);

      res.json({
        success: true,
        message: 'Utilisateur bloqué avec succès',
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  unblockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const { id } = req.params;
      const user = await this.adminService.unblockUser(id);

      res.json({
        success: true,
        message: 'Utilisateur débloqué avec succès',
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const { id } = req.params;
      const { role } = req.body;

      const user = await this.adminService.updateUserRole(id, role);

      res.json({
        success: true,
        message: 'Rôle mis à jour avec succès',
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const { id } = req.params;
      await this.adminService.deleteUser(id);

      res.json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
      next(error);
    }
  };
}