import { Model } from 'mongoose';
import { Progress } from '../domain/Progress';
import { IProgressRepository } from '../domain/Repositories';
import { ObjectId } from '../../../shared/types';
import { Logger } from '../../../core/logging/Logger';

export class MongoProgressRepository implements IProgressRepository {
  constructor(private progressModel: Model<any>) {}

  async findById(id: ObjectId): Promise<Progress | null> {
    try {
      const startTime = Date.now();
      const data = await this.progressModel.findById(id).lean();
      Logger.database('findById', 'progress', Date.now() - startTime);
      return data ? Progress.fromPersistence(data) : null;
    } catch (error) {
      Logger.database('findById', 'progress', 0, error);
      throw error;
    }
  }

  async findByUserId(userId: ObjectId, options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Progress[]> {
    try {
      const startTime = Date.now();
      const query = this.progressModel.find({ userId });

      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === 'desc' ? -1 : 1;
        query.sort({ [options.sortBy]: sortOrder });
      } else {
        query.sort({ date: -1 }); // Par défaut, trier par date décroissante
      }

      const data = await query.lean();
      Logger.database('findByUserId', 'progress', Date.now() - startTime);
      return data.map(item => Progress.fromPersistence(item));
    } catch (error) {
      Logger.database('findByUserId', 'progress', 0, error);
      throw error;
    }
  }

  async findByDateRange(userId: ObjectId, startDate: Date, endDate: Date): Promise<Progress[]> {
    try {
      const startTime = Date.now();
      const data = await this.progressModel.find({
        userId,
        date: { $gte: startDate, $lte: endDate }
      }).lean();
      Logger.database('findByDateRange', 'progress', Date.now() - startTime);
      return data.map(item => Progress.fromPersistence(item));
    } catch (error) {
      Logger.database('findByDateRange', 'progress', 0, error);
      throw error;
    }
  }

  async findLatest(userId: ObjectId, limit?: number): Promise<Progress[]> {
    try {
      const startTime = Date.now();
      const data = await this.progressModel
        .find({ userId })
        .sort({ date: -1 })
        .limit(limit || 10)
        .lean();
      Logger.database('findLatest', 'progress', Date.now() - startTime);
      return data.map(item => Progress.fromPersistence(item));
    } catch (error) {
      Logger.database('findLatest', 'progress', 0, error);
      throw error;
    }
  }

  async create(progress: Progress): Promise<Progress> {
    try {
      const startTime = Date.now();
      const data = progress.toPersistence();
      const created = await this.progressModel.create(data);
      Logger.database('create', 'progress', Date.now() - startTime);
      return Progress.fromPersistence(created);
    } catch (error) {
      Logger.database('create', 'progress', 0, error);
      throw error;
    }
  }

  async update(progress: Progress): Promise<Progress> {
    try {
      const startTime = Date.now();
      const data = progress.toPersistence();
      const updated = await this.progressModel.findByIdAndUpdate(
        progress.id,
        data,
        { new: true, runValidators: true }
      ).lean();
      Logger.database('update', 'progress', Date.now() - startTime);
      if (!updated) throw new Error('Progress not found for update');
      return Progress.fromPersistence(updated);
    } catch (error) {
      Logger.database('update', 'progress', 0, error);
      throw error;
    }
  }

  async delete(id: ObjectId): Promise<boolean> {
    try {
      const startTime = Date.now();
      const result = await this.progressModel.findByIdAndDelete(id);
      Logger.database('delete', 'progress', Date.now() - startTime);
      return !!result;
    } catch (error) {
      Logger.database('delete', 'progress', 0, error);
      throw error;
    }
  }

  async countByUserId(userId: ObjectId): Promise<number> {
    try {
      const startTime = Date.now();
      const count = await this.progressModel.countDocuments({ userId });
      Logger.database('countByUserId', 'progress', Date.now() - startTime);
      return count;
    } catch (error) {
      Logger.database('countByUserId', 'progress', 0, error);
      throw error;
    }
  }
}