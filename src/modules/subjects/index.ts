import { Router } from 'express';
import { container, TOKENS } from '../../core/container/Container';
import { SubjectController } from './presentation/SubjectController';
import { createSubjectRoutes } from './presentation/routes';
import { SubjectService } from './application/SubjectService';

export function createSubjectModule(): Router {
  const subjectService = container.resolve(TOKENS.SUBJECT_SERVICE) as SubjectService;
  const subjectController = new SubjectController(subjectService);
  return createSubjectRoutes(subjectController);
}

export * from './domain/Subject';
export * from './domain/Repositories';
export * from './application/Services';
export * from './application/SubjectService';
export * from './presentation/Dtos';