import { Request, Response, NextFunction } from 'express';
import { ThemeService } from '../application/ThemeService';
import { ThemeResponseDto } from './Dtos';
import { Logger } from '../../../core/logging/Logger';

export class ThemeController {
  constructor(private themeService: ThemeService) {}

  getThemes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const themes = await this.themeService.getThemes();
      const response = themes.map(t => ThemeResponseDto.fromDomain(t));

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  getThemeByKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const { key } = req.params;
      const theme = await this.themeService.getThemeByKey(key);
      if (!theme) {
        res.status(404).json({
          success: false,
          message: 'Thème non trouvé'
        });
        return;
      }
      const response = ThemeResponseDto.fromDomain(theme);

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  getThemeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const { id } = req.params;
      const theme = await this.themeService.getThemeById(id);
      const response = ThemeResponseDto.fromDomain(theme);

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  createTheme = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const theme = await this.themeService.createTheme(req.body);
      const response = ThemeResponseDto.fromDomain(theme);

      res.status(201).json({
        success: true,
        message: 'Thème créé avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  updateTheme = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const { id } = req.params;
      const theme = await this.themeService.updateTheme(id, req.body);
      const response = ThemeResponseDto.fromDomain(theme);

      res.json({
        success: true,
        message: 'Thème mis à jour avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  deleteTheme = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const { id } = req.params;
      await this.themeService.deleteTheme(id);

      res.json({
        success: true,
        message: 'Thème supprimé avec succès'
      });
    } catch (error) {
      next(error);
    }
  };
}