import { ObjectId } from '../../../shared/types';

export interface AdminStats {
  totalUsers: number;
  totalPlannings: number;
  totalProgressRecords: number;
  activeUsersToday: number;
  totalStudyTime: number;
  averageSessionDuration: number;
}

export interface IAdminRepository {
  getUserCount(): Promise<number>;
  getPlanningCount(): Promise<number>;
  getProgressCount(): Promise<number>;
  getActiveUsersToday(): Promise<number>;
  getTotalStudyTime(): Promise<number>;
  getUsers(options: { limit: number; offset: number }): Promise<any[]>;
  getUserById(userId: ObjectId): Promise<any>;
  updateUserStatus(userId: ObjectId, status: { isBlocked?: boolean; role?: string }): Promise<any>;
  deleteUser(userId: ObjectId): Promise<boolean>;
}

export interface IAdminService {
  getStats(): Promise<AdminStats>;
  getUsers(options: { limit?: number; offset?: number }): Promise<{ users: any[]; total: number }>;
  getUserById(userId: ObjectId): Promise<any>;
  blockUser(userId: ObjectId): Promise<any>;
  unblockUser(userId: ObjectId): Promise<any>;
  updateUserRole(userId: ObjectId, role: string): Promise<any>;
  deleteUser(userId: ObjectId): Promise<boolean>;
  getUserActivity(userId: ObjectId): Promise<any>;
}