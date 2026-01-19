import { ObjectId } from '../../../shared/types';
import { Subject } from '../domain/Subject';

export interface ISubjectService {
  createSubject(userId: ObjectId, data: { name: string; color: string }): Promise<Subject>;
  getSubjects(userId: ObjectId): Promise<Subject[]>;
  getSubjectById(id: ObjectId, userId: ObjectId): Promise<Subject>;
  updateSubject(id: ObjectId, userId: ObjectId, updates: { name?: string; color?: string }): Promise<Subject>;
  deleteSubject(id: ObjectId, userId: ObjectId): Promise<boolean>;
}

export interface ISubjectApplicationService extends ISubjectService {}