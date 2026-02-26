import { Request, Response, NextFunction } from 'express';
import { LoFiService } from '../application/LoFiService';
import { LoFiTrackResponseDto } from './Dtos';
import { Logger } from '../../../core/logging/Logger';

export class LoFiController {
  constructor(private lofiService: LoFiService) {}

  getTracks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const { category } = req.query;
      const tracks = await this.lofiService.getTracks(category as string);
      const response = tracks.map(t => {
        const dto = LoFiTrackResponseDto.fromDomain(t);
        return {
          id: dto.id,
          _id: dto.id,
          title: dto.title,
          artist: dto.artist,
          url: dto.url,
          audioUrl: dto.url,
          thumbnail: dto.thumbnail,
          category: dto.category,
          createdAt: dto.createdAt,
        };
      });

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const categories = await this.lofiService.getCategories();

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  };

  getTrackById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const { id } = req.params;
      const track = await this.lofiService.getTrackById(id);
      const response = LoFiTrackResponseDto.fromDomain(track);

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  createTrack = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const track = await this.lofiService.createTrack(req.body);
      const response = LoFiTrackResponseDto.fromDomain(track);

      res.status(201).json({
        success: true,
        message: 'Track créé avec succès',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  deleteTrack = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.api(req.method, req.originalUrl, 0, (req as any).user?.id);

      const { id } = req.params;
      await this.lofiService.deleteTrack(id);

      res.json({
        success: true,
        message: 'Track supprimé avec succès'
      });
    } catch (error) {
      next(error);
    }
  };
}