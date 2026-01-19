import { Model } from 'mongoose';
import { Planning } from '../domain/Planning';
import { IPlanningRepository } from '../domain/Repositories';
import { ObjectId } from '../../../shared/types';
import { Logger } from '../../../core/logging/Logger';

export class MongoPlanningRepository implements IPlanningRepository {
  constructor(private planningModel: Model<any>) {}

  async findById(id: ObjectId): Promise<Planning | null> {
    try {
      const startTime = Date.now();
      const data = await this.planningModel.findById(id).lean();
      Logger.database('findById', 'plannings', Date.now() - startTime);

      return data ? Planning.fromPersistence(data) : null;
    } catch (error) {
      Logger.database('findById', 'plannings', 0, error);
      throw error;
    }
  }

  async findByUserId(userId: ObjectId, options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Planning[]> {
    try {
      const startTime = Date.now();
      const query = this.planningModel.find({ userId });

      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === 'desc' ? -1 : 1;
        query.sort({ [options.sortBy]: sortOrder });
      }

      const data = await query.lean();
      Logger.database('findByUserId', 'plannings', Date.now() - startTime);

      return data.map(item => Planning.fromPersistence(item));
    } catch (error) {
      Logger.database('findByUserId', 'plannings', 0, error);
      throw error;
    }
  }

  async findByDateRange(userId: ObjectId, startDate: Date, endDate: Date): Promise<Planning[]> {
    try {
      const startTime = Date.now();
      const data = await this.planningModel.find({
        userId,
        dateDebut: { $gte: startDate, $lte: endDate }
      }).lean();
      Logger.database('findByDateRange', 'plannings', Date.now() - startTime);

      return data.map(item => Planning.fromPersistence(item));
    } catch (error) {
      Logger.database('findByDateRange', 'plannings', 0, error);
      throw error;
    }
  }

  async create(planning: Planning): Promise<Planning> {
    try {
      const startTime = Date.now();
      const data = planning.toPersistence();
      const created = await this.planningModel.create(data);
      Logger.database('create', 'plannings', Date.now() - startTime);

      return Planning.fromPersistence(created);
    } catch (error) {
      Logger.database('create', 'plannings', 0, error);
      throw error;
    }
  }

  async update(planning: Planning): Promise<Planning> {
    try {
      const startTime = Date.now();
      const data = planning.toPersistence();
      const updated = await this.planningModel.findByIdAndUpdate(
        planning.id,
        data,
        { new: true, runValidators: true }
      ).lean();
      Logger.database('update', 'plannings', Date.now() - startTime);

      if (!updated) throw new Error('Planning not found for update');
      return Planning.fromPersistence(updated);
    } catch (error) {
      Logger.database('update', 'plannings', 0, error);
      throw error;
    }
  }

  async delete(id: ObjectId): Promise<boolean> {
    try {
      const startTime = Date.now();
      const result = await this.planningModel.findByIdAndDelete(id);
      Logger.database('delete', 'plannings', Date.now() - startTime);

      return !!result;
    } catch (error) {
      Logger.database('delete', 'plannings', 0, error);
      throw error;
    }
  }

  async countByUserId(userId: ObjectId): Promise<number> {
    try {
      const startTime = Date.now();
      const count = await this.planningModel.countDocuments({ userId });
      Logger.database('countByUserId', 'plannings', Date.now() - startTime);

      return count;
    } catch (error) {
      Logger.database('countByUserId', 'plannings', 0, error);
      throw error;
    }
  }
}