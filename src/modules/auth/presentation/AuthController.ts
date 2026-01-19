import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../application/Services';
import {
  RegisterRequestDto,
  LoginRequestDto,
  GoogleLoginRequestDto,
  RefreshTokenRequestDto,
  AuthResponseDto,
  TokenResponseDto
} from './Dtos';
import { Logger } from '../../../core/logging/Logger';
import { AppError } from '../../../shared/errors/CustomErrors';

export class AuthController {
  constructor(private authService: IAuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const dto = new RegisterRequestDto(
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.gender
      );

      const result = await this.authService.register(dto);

      const response = AuthResponseDto.create(result.user, result.token, result.refreshToken);

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const dto = new LoginRequestDto(
        req.body.email,
        req.body.password
      );

      const result = await this.authService.login(dto.email, dto.password);

      const response = AuthResponseDto.create(result.user, result.token, result.refreshToken);

      res.json({
        success: true,
        message: 'Connexion réussie',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const dto = new GoogleLoginRequestDto(req.body.idToken);

      const result = await this.authService.googleLogin(dto.idToken);

      const response = AuthResponseDto.create(result.user, result.token, result.refreshToken);

      res.json({
        success: true,
        message: 'Connexion Google réussie',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const dto = new RefreshTokenRequestDto(req.body.token);

      const result = await this.authService.refreshToken(dto.token);

      const response = new TokenResponseDto(result.token, result.refreshToken);

      res.json({
        success: true,
        message: 'Token rafraîchi avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Token manquant dans l\'en-tête Authorization', 401, 'AUTHENTICATION_ERROR');
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      await this.authService.logout(token);

      res.json({
        success: true,
        message: 'Déconnexion réussie'
      });
    } catch (error) {
      next(error);
    }
  };
}