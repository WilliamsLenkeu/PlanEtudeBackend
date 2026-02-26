import { Model } from 'mongoose';
import { User, RefreshToken } from '../domain/User';
import { IUserRepository, IRefreshTokenRepository } from '../domain/Repositories';
import { ObjectId } from '../../../shared/types';
import { Logger } from '../../../core/logging/Logger';

export class MongoUserRepository implements IUserRepository {
  constructor(private userModel: Model<any>) {}

  async findById(id: ObjectId): Promise<User | null> {
    try {
      const startTime = Date.now();
      const data = await this.userModel.findById(id).lean();
      Logger.database('findById', 'users', Date.now() - startTime);

      return data ? User.fromPersistence(data) : null;
    } catch (error) {
      Logger.database('findById', 'users', 0, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const startTime = Date.now();
      const data = await this.userModel.findOne({ email }).lean();
      Logger.database('findByEmail', 'users', Date.now() - startTime);

      return data ? User.fromPersistence(data) : null;
    } catch (error) {
      Logger.database('findByEmail', 'users', 0, error);
      throw error;
    }
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    try {
      const startTime = Date.now();
      const data = await this.userModel.findOne({ googleId }).lean();
      Logger.database('findByGoogleId', 'users', Date.now() - startTime);

      return data ? User.fromPersistence(data) : null;
    } catch (error) {
      Logger.database('findByGoogleId', 'users', 0, error);
      throw error;
    }
  }

  async create(user: User): Promise<User> {
    try {
      const startTime = Date.now();
      const data = user.toPersistence();
      if (!data._id || data._id === '') {
        delete data._id;
      }
      const created = await this.userModel.create(data);
      Logger.database('create', 'users', Date.now() - startTime);

      return User.fromPersistence(created);
    } catch (error) {
      Logger.database('create', 'users', 0, error);
      throw error;
    }
  }

  async update(user: User): Promise<User> {
    try {
      const startTime = Date.now();
      const data = user.toPersistence();
      const updated = await this.userModel.findByIdAndUpdate(
        user.id,
        data,
        { new: true, runValidators: true }
      ).lean();
      Logger.database('update', 'users', Date.now() - startTime);

      if (!updated) throw new Error('User not found for update');
      return User.fromPersistence(updated);
    } catch (error) {
      Logger.database('update', 'users', 0, error);
      throw error;
    }
  }

  async delete(id: ObjectId): Promise<boolean> {
    try {
      const startTime = Date.now();
      const result = await this.userModel.findByIdAndDelete(id);
      Logger.database('delete', 'users', Date.now() - startTime);

      return !!result;
    } catch (error) {
      Logger.database('delete', 'users', 0, error);
      throw error;
    }
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<User[]> {
    try {
      const startTime = Date.now();
      const query = this.userModel.find();

      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === 'desc' ? -1 : 1;
        query.sort({ [options.sortBy]: sortOrder });
      }

      const data = await query.lean();
      Logger.database('findAll', 'users', Date.now() - startTime);

      return data.map(item => User.fromPersistence(item));
    } catch (error) {
      Logger.database('findAll', 'users', 0, error);
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      const startTime = Date.now();
      const count = await this.userModel.countDocuments();
      Logger.database('count', 'users', Date.now() - startTime);

      return count;
    } catch (error) {
      Logger.database('count', 'users', 0, error);
      throw error;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const startTime = Date.now();
      const count = await this.userModel.countDocuments({ email });
      Logger.database('existsByEmail', 'users', Date.now() - startTime);

      return count > 0;
    } catch (error) {
      Logger.database('existsByEmail', 'users', 0, error);
      throw error;
    }
  }

  async updateStudyStats(userId: ObjectId, stats: Partial<User['studyStats']>): Promise<User> {
    try {
      const startTime = Date.now();
      const updated = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            'studyStats': stats,
            updatedAt: new Date()
          }
        },
        { new: true, runValidators: true }
      ).lean();
      Logger.database('updateStudyStats', 'users', Date.now() - startTime);

      if (!updated) throw new Error('User not found for study stats update');
      return User.fromPersistence(updated);
    } catch (error) {
      Logger.database('updateStudyStats', 'users', 0, error);
      throw error;
    }
  }

  async unlockTheme(userId: ObjectId, themeKey: string): Promise<User> {
    try {
      const startTime = Date.now();
      const updated = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $addToSet: { 'preferences.unlockedThemes': themeKey },
          $set: { updatedAt: new Date() }
        },
        { new: true, runValidators: true }
      ).lean();
      Logger.database('unlockTheme', 'users', Date.now() - startTime);

      if (!updated) throw new Error('User not found for theme unlock');
      return User.fromPersistence(updated);
    } catch (error) {
      Logger.database('unlockTheme', 'users', 0, error);
      throw error;
    }
  }

  async addSubject(userId: ObjectId, subject: string): Promise<User> {
    try {
      const startTime = Date.now();
      const updated = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $addToSet: { 'preferences.matieres': subject },
          $set: { updatedAt: new Date() }
        },
        { new: true, runValidators: true }
      ).lean();
      Logger.database('addSubject', 'users', Date.now() - startTime);

      if (!updated) throw new Error('User not found for subject addition');
      return User.fromPersistence(updated);
    } catch (error) {
      Logger.database('addSubject', 'users', 0, error);
      throw error;
    }
  }

  async removeSubject(userId: ObjectId, subject: string): Promise<User> {
    try {
      const startTime = Date.now();
      const updated = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $pull: { 'preferences.matieres': subject },
          $set: { updatedAt: new Date() }
        },
        { new: true, runValidators: true }
      ).lean();
      Logger.database('removeSubject', 'users', Date.now() - startTime);

      if (!updated) throw new Error('User not found for subject removal');
      return User.fromPersistence(updated);
    } catch (error) {
      Logger.database('removeSubject', 'users', 0, error);
      throw error;
    }
  }
}

export class MongoRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private refreshTokenModel: Model<any>) {}

  async create(token: RefreshToken): Promise<RefreshToken> {
    try {
      const startTime = Date.now();
      const data = token.toPersistence();
      if (!data._id || data._id === '') {
        delete data._id;
      }
      const created = await this.refreshTokenModel.create(data);
      Logger.database('create', 'refresh_tokens', Date.now() - startTime);

      return RefreshToken.fromPersistence(created);
    } catch (error) {
      Logger.database('create', 'refresh_tokens', 0, error);
      throw error;
    }
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    try {
      const startTime = Date.now();
      const data = await this.refreshTokenModel.findOne({ token }).lean();
      Logger.database('findByToken', 'refresh_tokens', Date.now() - startTime);

      return data ? RefreshToken.fromPersistence(data) : null;
    } catch (error) {
      Logger.database('findByToken', 'refresh_tokens', 0, error);
      throw error;
    }
  }

  async deleteByToken(token: string): Promise<boolean> {
    try {
      const startTime = Date.now();
      const result = await this.refreshTokenModel.findOneAndDelete({ token });
      Logger.database('deleteByToken', 'refresh_tokens', Date.now() - startTime);

      return !!result;
    } catch (error) {
      Logger.database('deleteByToken', 'refresh_tokens', 0, error);
      throw error;
    }
  }

  async deleteByUserId(userId: ObjectId): Promise<boolean> {
    try {
      const startTime = Date.now();
      const result = await this.refreshTokenModel.deleteMany({ userId });
      Logger.database('deleteByUserId', 'refresh_tokens', Date.now() - startTime);

      return result.deletedCount > 0;
    } catch (error) {
      Logger.database('deleteByUserId', 'refresh_tokens', 0, error);
      throw error;
    }
  }

  async deleteExpired(): Promise<number> {
    try {
      const startTime = Date.now();
      const result = await this.refreshTokenModel.deleteMany({
        expiresAt: { $lt: new Date() }
      });
      Logger.database('deleteExpired', 'refresh_tokens', Date.now() - startTime);

      return result.deletedCount;
    } catch (error) {
      Logger.database('deleteExpired', 'refresh_tokens', 0, error);
      throw error;
    }
  }
}