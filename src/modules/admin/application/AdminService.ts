import { ObjectId } from '../../../shared/types';
import { IAdminRepository, AdminStats } from '../domain/Admin';
import { Logger } from '../../../core/logging/Logger';
import { NotFoundError, ValidationError } from '../../../shared/errors/CustomErrors';

export class AdminService {
  constructor(
    private adminRepository: IAdminRepository
  ) {}

  async getStats(): Promise<AdminStats> {
    Logger.business('admin', 'get_stats');

    const [
      totalUsers,
      totalPlannings,
      totalProgressRecords,
      activeUsersToday,
      totalStudyTime
    ] = await Promise.all([
      this.adminRepository.getUserCount(),
      this.adminRepository.getPlanningCount(),
      this.adminRepository.getProgressCount(),
      this.adminRepository.getActiveUsersToday(),
      this.adminRepository.getTotalStudyTime()
    ]);

    return {
      totalUsers,
      totalPlannings,
      totalProgressRecords,
      activeUsersToday,
      totalStudyTime,
      averageSessionDuration: totalProgressRecords > 0 
        ? Math.round(totalStudyTime / totalProgressRecords) 
        : 0
    };
  }

  async getUsers(options: { limit?: number; offset?: number }): Promise<{ users: any[]; total: number }> {
    Logger.business('admin', 'get_users', { options });

    const limit = options?.limit || 20;
    const offset = options?.offset || 0;

    const [users, total] = await Promise.all([
      this.adminRepository.getUsers({ limit, offset }),
      this.adminRepository.getUserCount()
    ]);

    return { users, total };
  }

  async getUserById(userId: ObjectId): Promise<any> {
    Logger.business('admin', 'get_user', { userId });

    const user = await this.adminRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError('Utilisateur');
    }
    return user;
  }

  async blockUser(userId: ObjectId): Promise<any> {
    Logger.business('admin', 'block_user', { userId });

    const user = await this.adminRepository.updateUserStatus(userId, { isBlocked: true });
    if (!user) {
      throw new NotFoundError('Utilisateur');
    }

    Logger.business('admin', 'user_blocked', { userId });
    return user;
  }

  async unblockUser(userId: ObjectId): Promise<any> {
    Logger.business('admin', 'unblock_user', { userId });

    const user = await this.adminRepository.updateUserStatus(userId, { isBlocked: false });
    if (!user) {
      throw new NotFoundError('Utilisateur');
    }

    Logger.business('admin', 'user_unblocked', { userId });
    return user;
  }

  async updateUserRole(userId: ObjectId, role: string): Promise<any> {
    Logger.business('admin', 'update_role', { userId, role });

    if (!['user', 'admin', 'moderator'].includes(role)) {
      throw new ValidationError('Rôle invalide. Les rôles valides sont: user, admin, moderator');
    }

    const user = await this.adminRepository.updateUserStatus(userId, { role });
    if (!user) {
      throw new NotFoundError('Utilisateur');
    }

    Logger.business('admin', 'role_updated', { userId, role });
    return user;
  }

  async deleteUser(userId: ObjectId): Promise<boolean> {
    Logger.business('admin', 'delete_user', { userId });

    const deleted = await this.adminRepository.deleteUser(userId);
    
    Logger.business('admin', 'user_deleted', { userId });
    return deleted;
  }

  async getUserActivity(userId: ObjectId): Promise<any> {
    Logger.business('admin', 'get_user_activity', { userId });

    const user = await this.getUserById(userId);

    // Ces importations devraient être injectées, mais pour simplifier:
    const PlanningModel = require('../../models/Planning.model');
    const ProgressModel = require('../../models/Progress.model');

    const [plannings, progressRecords] = await Promise.all([
      PlanningModel.find({ userId }).countDocuments(),
      ProgressModel.find({ userId }).countDocuments()
    ]);

    return {
      userId,
      email: user.email,
      name: user.name,
      totalPlannings: plannings,
      totalProgressRecords: progressRecords,
      memberSince: user.createdAt,
      lastActive: user.studyStats?.lastStudyDate || user.updatedAt
    };
  }

  // Implémentation du repository
  async getUserCount(): Promise<number> {
    return this.adminRepository.getUserCount();
  }

  async getPlanningCount(): Promise<number> {
    return this.adminRepository.getPlanningCount();
  }

  async getProgressCount(): Promise<number> {
    return this.adminRepository.getProgressCount();
  }

  async getActiveUsersToday(): Promise<number> {
    return this.adminRepository.getActiveUsersToday();
  }

  async getTotalStudyTime(): Promise<number> {
    return this.adminRepository.getTotalStudyTime();
  }
}