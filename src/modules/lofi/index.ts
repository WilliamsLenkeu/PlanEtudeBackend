import { Router } from 'express';
import { container, TOKENS } from '../../core/container/Container';
import { LoFiController } from './presentation/LoFiController';
import { createLoFiRoutes } from './presentation/routes';
import { LoFiService } from './application/LoFiService';
import { MongoLoFiRepository } from './infrastructure/MongoLoFiRepository';

export function createLoFiModule(): Router {
  if (!container.has('LoFiRepository')) {
    const LofiTrackModule = require('../../models/LofiTrack.model');
    const LofiTrackModel = LofiTrackModule.default ?? LofiTrackModule;
    container.register('LoFiRepository', () => new MongoLoFiRepository(LofiTrackModel));
  }

  if (!container.has(TOKENS.LOFI_SERVICE)) {
    container.register(TOKENS.LOFI_SERVICE, () => new LoFiService(
      container.resolve('LoFiRepository')
    ));
  }

  const lofiService = container.resolve(TOKENS.LOFI_SERVICE) as LoFiService;
  const lofiController = new LoFiController(lofiService);
  return createLoFiRoutes(lofiController);
}

export * from './domain/LoFi';
export * from './domain/Repositories';
export * from './application/LoFiService';
export * from './presentation/Dtos';