import { Router } from 'express';
import { container, TOKENS } from '../../core/container/Container';
import { AdminController } from './presentation/AdminController';
import { createAdminRoutes } from './presentation/routes';
import { AdminService } from './application/AdminService';
import { MongoAdminRepository } from './infrastructure/MongoAdminRepository';

export function createAdminModule(): Router {
  if (!container.has('AdminRepository')) {
    const UserModel = require('../../models/User.model');
    const PlanningModel = require('../../models/Planning.model');
    const ProgressModel = require('../../models/Progress.model');
    
    container.register('AdminRepository', () => new MongoAdminRepository(
      UserModel,
      PlanningModel,
      ProgressModel
    ));
  }

  if (!container.has('AdminService')) {
    container.register('AdminService', () => new AdminService(
      container.resolve('AdminRepository')
    ));
  }

  const adminService = container.resolve('AdminService') as AdminService;
  const adminController = new AdminController(adminService);
  return createAdminRoutes(adminController);
}

export * from './domain/Admin';
export * from './application/AdminService';
export * from './presentation/Dtos';