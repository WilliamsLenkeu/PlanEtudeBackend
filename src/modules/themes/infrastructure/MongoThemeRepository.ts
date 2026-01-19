import { Model } from 'mongoose';
import { Theme } from '../domain/Theme';
import { IThemeRepository } from '../domain/Repositories';
import { ObjectId } from '../../../shared/types';
import { Logger } from '../../../core/logging/Logger';

export class MongoThemeRepository implements IThemeRepository {
  constructor(private themeModel: Model<any>) {}

  async findById(id: ObjectId): Promise<Theme | null> {
    try {
      const startTime = Date.now();
      const data = await this.themeModel.findById(id).lean();
      Logger.database('findById', 'themes', Date.now() - startTime);
      return data ? Theme.fromPersistence(data) : null;
    } catch (error) {
      Logger.database('findById', 'themes', 0, error);
      throw error;
    }
  }

  async findByKey(key: string): Promise<Theme | null> {
    try {
      const startTime = Date.now();
      const data = await this.themeModel.findOne({ key }).lean();
      Logger.database('findByKey', 'themes', Date.now() - startTime);
      return data ? Theme.fromPersistence(data) : null;
    } catch (error) {
      Logger.database('findByKey', 'themes', 0, error);
      throw error;
    }
  }

  async findAll(): Promise<Theme[]> {
    try {
      const startTime = Date.now();
      const data = await this.themeModel.find().lean();
      Logger.database('findAll', 'themes', Date.now() - startTime);
      return data.map(item => Theme.fromPersistence(item));
    } catch (error) {
      Logger.database('findAll', 'themes', 0, error);
      throw error;
    }
  }

  async create(theme: Theme): Promise<Theme> {
    try {
      const startTime = Date.now();
      const data = theme.toPersistence();
      const created = await this.themeModel.create(data);
      Logger.database('create', 'themes', Date.now() - startTime);
      return Theme.fromPersistence(created);
    } catch (error) {
      Logger.database('create', 'themes', 0, error);
      throw error;
    }
  }

  async update(theme: Theme): Promise<Theme> {
    try {
      const startTime = Date.now();
      const data = theme.toPersistence();
      const updated = await this.themeModel.findByIdAndUpdate(
        theme.id,
        data,
        { new: true, runValidators: true }
      ).lean();
      Logger.database('update', 'themes', Date.now() - startTime);
      if (!updated) throw new Error('Theme not found for update');
      return Theme.fromPersistence(updated);
    } catch (error) {
      Logger.database('update', 'themes', 0, error);
      throw error;
    }
  }

  async delete(id: ObjectId): Promise<boolean> {
    try {
      const startTime = Date.now();
      const result = await this.themeModel.findByIdAndDelete(id);
      Logger.database('delete', 'themes', Date.now() - startTime);
      return !!result;
    } catch (error) {
      Logger.database('delete', 'themes', 0, error);
      throw error;
    }
  }
}