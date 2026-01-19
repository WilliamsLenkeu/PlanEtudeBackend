import { Model } from 'mongoose';
import { Subject } from '../domain/Subject';
import { ISubjectRepository } from '../domain/Repositories';
import { ObjectId } from '../../../shared/types';
import { Logger } from '../../../core/logging/Logger';

export class MongoSubjectRepository implements ISubjectRepository {
  constructor(private subjectModel: Model<any>) {}

  async findById(id: ObjectId): Promise<Subject | null> {
    try {
      const startTime = Date.now();
      const data = await this.subjectModel.findById(id).lean();
      Logger.database('findById', 'subjects', Date.now() - startTime);
      return data ? Subject.fromPersistence(data) : null;
    } catch (error) {
      Logger.database('findById', 'subjects', 0, error);
      throw error;
    }
  }

  async findByUserId(userId: ObjectId): Promise<Subject[]> {
    try {
      const startTime = Date.now();
      const data = await this.subjectModel.find({ userId }).lean();
      Logger.database('findByUserId', 'subjects', Date.now() - startTime);
      return data.map(item => Subject.fromPersistence(item));
    } catch (error) {
      Logger.database('findByUserId', 'subjects', 0, error);
      throw error;
    }
  }

  async create(subject: Subject): Promise<Subject> {
    try {
      const startTime = Date.now();
      const data = subject.toPersistence();
      const created = await this.subjectModel.create(data);
      Logger.database('create', 'subjects', Date.now() - startTime);
      return Subject.fromPersistence(created);
    } catch (error) {
      Logger.database('create', 'subjects', 0, error);
      throw error;
    }
  }

  async update(subject: Subject): Promise<Subject> {
    try {
      const startTime = Date.now();
      const data = subject.toPersistence();
      const updated = await this.subjectModel.findByIdAndUpdate(
        subject.id,
        data,
        { new: true, runValidators: true }
      ).lean();
      Logger.database('update', 'subjects', Date.now() - startTime);
      if (!updated) throw new Error('Subject not found for update');
      return Subject.fromPersistence(updated);
    } catch (error) {
      Logger.database('update', 'subjects', 0, error);
      throw error;
    }
  }

  async delete(id: ObjectId): Promise<boolean> {
    try {
      const startTime = Date.now();
      const result = await this.subjectModel.findByIdAndDelete(id);
      Logger.database('delete', 'subjects', Date.now() - startTime);
      return !!result;
    } catch (error) {
      Logger.database('delete', 'subjects', 0, error);
      throw error;
    }
  }

  async countByUserId(userId: ObjectId): Promise<number> {
    try {
      const startTime = Date.now();
      const count = await this.subjectModel.countDocuments({ userId });
      Logger.database('countByUserId', 'subjects', Date.now() - startTime);
      return count;
    } catch (error) {
      Logger.database('countByUserId', 'subjects', 0, error);
      throw error;
    }
  }
}