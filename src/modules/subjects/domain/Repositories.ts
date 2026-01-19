import { ObjectId } from '../../../shared/types';
import { Subject } from './Subject';

export interface ISubjectRepository {
  findById(id: ObjectId): Promise<Subject | null>;
  findByUserId(userId: ObjectId): Promise<Subject[]>;
  create(subject: Subject): Promise<Subject>;
  update(subject: Subject): Promise<Subject>;
  delete(id: ObjectId): Promise<boolean>;
  countByUserId(userId: ObjectId): Promise<number>;
}