import { ObjectId } from '../../../shared/types';
import { Progress } from '../domain/Progress';

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

export interface IProgressService {
  recordProgress(data: {
    userId: ObjectId;
    date: string;
    sessionsCompletees: number;
    tempsEtudie: number;
    notes?: string;
  }): Promise<Progress>;

  getProgress(progressId: ObjectId, userId: ObjectId): Promise<Progress>;

  getUserProgress(userId: ObjectId, options?: {
    limit?: number;
    offset?: number;
  }): Promise<{ progressList: Progress[]; total: number }>;

  getProgressSummary(userId: ObjectId): Promise<any>;

  getProgressHistory(userId: ObjectId, days?: number): Promise<any[]>;

  getStats(userId: ObjectId, startDate?: string, endDate?: string): Promise<any>;

  deleteProgress(progressId: ObjectId, userId: ObjectId): Promise<boolean>;
}

export interface IStatsService {
  getGlobalStats(userId: ObjectId): Promise<any>;
  getStatsBySubject(userId: ObjectId): Promise<any[]>;
  getStatsByPeriod(userId: ObjectId, period: 'day' | 'week' | 'month'): Promise<any>;
  calculateStreak(userId: ObjectId): Promise<number>;
  calculateLevel(xp: number): number;
  calculateXpForLevel(level: number): number;
  getLeaderboard(options?: { limit?: number; offset?: number }): Promise<any[]>;
}