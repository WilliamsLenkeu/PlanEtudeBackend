import { Router } from 'express';
import { SubjectController } from './SubjectController';

export function createSubjectRoutes(
  subjectController: SubjectController
): Router {
  const router = Router();

  router.post('/', subjectController.createSubject);
  router.get('/', subjectController.getSubjects);
  router.get('/:id', subjectController.getSubjectById);
  router.put('/:id', subjectController.updateSubject);
  router.delete('/:id', subjectController.deleteSubject);

  return router;
}