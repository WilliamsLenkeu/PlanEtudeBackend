import { ObjectId } from '../../../shared/types';
import { Planning } from './Planning';

// Interface du repository Planning
export interface IPlanningRepository {
  findById(id: ObjectId): Promise<Planning | null>;
  findByUserId(userId: ObjectId, options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Planning[]>;
  findByDateRange(userId: ObjectId, startDate: Date, endDate: Date): Promise<Planning[]>;
  create(planning: Planning): Promise<Planning>;
  update(planning: Planning): Promise<Planning>;
  delete(id: ObjectId): Promise<boolean>;
  countByUserId(userId: ObjectId): Promise<number>;
}