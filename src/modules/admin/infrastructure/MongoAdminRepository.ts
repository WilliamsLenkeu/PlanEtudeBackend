import mongoose from 'mongoose';
import { ObjectId } from '../../../shared/types';
import { IAdminRepository } from '../domain/Admin';
import { Logger } from '../../../core/logging/Logger';

export class MongoAdminRepository implements IAdminRepository {
  constructor(
    private userModel: Model<any>,
    private planningModel: Model<any>,
    private progressModel: Model<any>
  ) {}

  async getUserCount(): Promise<number> {
    try {
      const startTime = Date.now();
      const count = await this.userModel.countDocuments();
      Logger.database('getUserCount', 'admin', Date.now() - startTime);
      return count;
    } catch (error) {
      Logger.database('getUserCount', 'admin', 0, error);
      throw error;
    }
  }

  async getPlanningCount(): Promise<number> {
    try {
      const startTime = Date.now();
      const count = await this.planningModel.countDocuments();
      Logger.database('getPlanningCount', 'admin', Date.now() - startTime);
      return count;
    } catch (error) {
      Logger.database('getPlanningCount', 'admin', 0, error);
      throw error;
    }
  }

  async getProgressCount(): Promise<number> {
    try {
      const startTime = Date.now();
      const count = await this.progressModel.countDocuments();
      Logger.database('getProgressCount', 'admin', Date.now() - startTime);
      return count;
    } catch (error) {
      Logger.database('getProgressCount', 'admin', 0, error);
      throw error;
    }
  }

  async getActiveUsersToday(): Promise<number> {
    try {
      const startTime = Date.now();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const count = await this.progressModel.distinct('userId', {
        date: { $gte: today }
      });
      Logger.database('getActiveUsersToday', 'admin', Date.now() - startTime);
      return count.length;
    } catch (error) {
      Logger.database('getActiveUsersToday', 'admin', 0, error);
      throw error;
    }
  }

  async getTotalStudyTime(): Promise<number> {
    try {
      const startTime = Date.now();
      const result = await this.progressModel.aggregate([
        { $group: { _id: null, total: { $sum: '$tempsEtudie' } } }
      ]);
      Logger.database('getTotalStudyTime', 'admin', Date.now() - startTime);
      return result[0]?.total || 0;
    } catch (error) {
      Logger.database('getTotalStudyTime', 'admin', 0, error);
      throw error;
    }
  }

  async getUsers(options: { limit: number; offset: number }): Promise<any[]> {
    try {
      const startTime = Date.now();
      const users = await this.userModel
        .find({}, '-password')
        .skip(options.offset)
        .limit(options.limit)
        .sort({ createdAt: -1 })
        .lean();
      Logger.database('getUsers', 'admin', Date.now() - startTime);
      return users;
    } catch (error) {
      Logger.database('getUsers', 'admin', 0, error);
      throw error;
    }
  }

  async getUserById(userId: ObjectId): Promise<any> {
    try {
      const startTime = Date.now();
      const user = await this.userModel
        .findById(userId, '-password')
        .lean();
      Logger.database('getUserById', 'admin', Date.now() - startTime);
      return user;
    } catch (error) {
      Logger.database('getUserById', 'admin', 0, error);
      throw error;
    }
  }

  async updateUserStatus(userId: ObjectId, status: { isBlocked?: boolean; role?: string }): Promise<any> {
    try {
      const startTime = Date.now();
      const update: any = {};
      if (status.isBlocked !== undefined) update.isBlocked = status.isBlocked;
      if (status.role) update.role = status.role;
      
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        { $set: update },
        { new: true, select: '-password' }
      ).lean();
      Logger.database('updateUserStatus', 'admin', Date.now() - startTime);
      return user;
    } catch (error) {
      Logger.database('updateUserStatus', 'admin', 0, error);
      throw error;
    }
  }

  async deleteUser(userId: ObjectId): Promise<boolean> {
    try {
      const startTime = Date.now();
      const result = await this.userModel.findByIdAndDelete(userId);
      Logger.database('deleteUser', 'admin', Date.now() - startTime);
      return !!result;
    } catch (error) {
      Logger.database('deleteUser', 'admin', 0, error);
      throw error;
    }
  }
}

import { Model } from 'mongoose';