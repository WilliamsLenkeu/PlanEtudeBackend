import { Router } from 'express';
import { container, TOKENS } from '../../core/container/Container';
import { SubjectController } from './presentation/SubjectController';
import { createSubjectRoutes } from './presentation/routes';
import { SubjectService } from './application/SubjectService';
import { MongoSubjectRepository } from './infrastructure/MongoSubjectRepository';

export function createSubjectModule(): Router {
  // Enregistrer le repository
  if (!container.has('SubjectRepository')) {
    const SubjectModel = require('../../models/Subject.model');
    container.register('SubjectRepository', () => new MongoSubjectRepository(SubjectModel));
  }

  // Enregistrer le service
  if (!container.has(TOKENS.SUBJECT_SERVICE)) {
    container.register(TOKENS.SUBJECT_SERVICE, () => new SubjectService(
      container.resolve('SubjectRepository')
    ));
  }

  const subjectService = container.resolve(TOKENS.SUBJECT_SERVICE) as SubjectService;
  const subjectController = new SubjectController(subjectService);
  return createSubjectRoutes(subjectController);
}

export * from './domain/Subject';
export * from './domain/Repositories';
export * from './application/Services';
export * from './application/SubjectService';
export * from './presentation/Dtos';