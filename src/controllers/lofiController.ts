import { Request, Response, NextFunction } from 'express';
import LofiTrack from '../models/LofiTrack.model';
import { fetchLofiTracksFromJamendo } from '../services/lofiService';
import NodeCache from 'node-cache';
import { AppError } from '../middleware/errorHandler';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache pour 1 heure

// @desc    Récupérer toutes les pistes Lo-Fi (DB + API Jamendo)
// @route   GET /api/lofi
// @access  Private
export const getLofiTracks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = 'lofi_tracks';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json({
        success: true,
        fromCache: true,
        ...(cachedData as any)
      });
    }

    // 1. Récupérer les pistes personnalisées en base de données
    const dbTracks = await LofiTrack.find();
    
    // 2. Récupérer les pistes fraîches de Jamendo
    const jamendoTracks = await fetchLofiTracksFromJamendo(30);
    
    // 3. Fusionner les deux listes (pistes DB en premier)
    const allTracks = [...dbTracks, ...jamendoTracks];
    
    const responseData = {
      count: allTracks.length,
      data: allTracks
    };

    cache.set(cacheKey, responseData);
    
    res.json({
      success: true,
      fromCache: false,
      ...responseData
    });
  } catch (error: any) {
    next(new AppError(`Erreur lors de la récupération de la musique Lo-Fi: ${error.message}`, 500));
  }
};

// @desc    Ajouter une piste Lo-Fi (Admin ou Initialisation)
// @route   POST /api/lofi
// @access  Private (should be admin)
export const addLofiTrack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, artist, url, thumbnail, category } = req.body;
    const track = await LofiTrack.create({ title, artist, url, thumbnail, category });
    res.status(201).json({
      success: true,
      data: track
    });
  } catch (error: any) {
    next(new AppError(`Impossible d'ajouter la piste Lo-Fi: ${error.message}`, 400));
  }
};
