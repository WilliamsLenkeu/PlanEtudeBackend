import { ObjectId } from '../../../shared/types';
import { Progress } from './Progress';

export interface IProgressRepository {
  findById(id: ObjectId): Promise<Progress | null>;
  findByUserId(userId: ObjectId, options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Progress[]>;
  findByDateRange(userId: ObjectId, startDate: Date, endDate: Date): Promise<Progress[]>;
  findLatest(userId: ObjectId, limit?: number): Promise<Progress[]>;
  create(progress: Progress): Promise<Progress>;
  update(progress: Progress): Promise<Progress>;
  delete(id: ObjectId): Promise<boolean>;
  countByUserId(userId: ObjectId): Promise<number>;
}