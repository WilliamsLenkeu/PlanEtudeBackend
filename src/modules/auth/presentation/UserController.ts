import { Request, Response, NextFunction } from 'express';
import { IUserService } from '../application/Services';
import { UserResponseDto, UpdateProfileRequestDto, UsersQueryDto } from './Dtos';
import { Logger } from '../../../core/logging/Logger';
import { AuthorizationError } from '../../../shared/errors/CustomErrors';

export class UserController {
  constructor(private userService: IUserService) {}

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const user = await this.userService.getProfile(userId);

      const response = UserResponseDto.fromDomain(user);

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const dto = new UpdateProfileRequestDto(
        req.body.name,
        req.body.preferences
      );

      const user = await this.userService.updateProfile(userId, dto);

      const response = UserResponseDto.fromDomain(user);

      res.json({
        success: true,
        message: 'Profil mis à jour avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      // Vérifier que l'utilisateur est admin
      if ((req as any).user.role !== 'admin') {
        throw new AuthorizationError('Accès réservé aux administrateurs');
      }

      const dto = new UsersQueryDto(
        req.query.limit ? parseInt(req.query.limit as string) : undefined,
        req.query.offset ? parseInt(req.query.offset as string) : undefined,
        req.query.sortBy as string,
        req.query.sortOrder as 'asc' | 'desc'
      );

      const result = await this.userService.getUsers(dto);

      const usersResponse = result.users.map(user => UserResponseDto.fromDomain(user));

      res.json({
        success: true,
        data: usersResponse,
        pagination: {
          total: result.total,
          limit: dto.limit || 10,
          offset: dto.offset || 0
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getUserStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const stats = await this.userService.getUserStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };

  unlockTheme = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const { themeKey } = req.body;

      if (!themeKey) {
        throw new Error('themeKey est requis');
      }

      const user = await this.userService.unlockTheme(userId, themeKey);
      const response = UserResponseDto.fromDomain(user);

      res.json({
        success: true,
        message: 'Thème débloqué avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  addSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const { subject } = req.body;

      if (!subject) {
        throw new Error('subject est requis');
      }

      const user = await this.userService.addSubject(userId, subject);
      const response = UserResponseDto.fromDomain(user);

      res.json({
        success: true,
        message: 'Matière ajoutée avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  removeSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const userId = (req as any).user.id;
      const { subject } = req.body;

      if (!subject) {
        throw new Error('subject est requis');
      }

      const user = await this.userService.removeSubject(userId, subject);
      const response = UserResponseDto.fromDomain(user);

      res.json({
        success: true,
        message: 'Matière supprimée avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };
}