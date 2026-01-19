import { ObjectId } from '../../../shared/types';
import { Progress } from '../domain/Progress';

export class ProgressResponseDto {
  constructor(
    public id: ObjectId,
    public userId: ObjectId,
    public date: Date,
    public sessionsCompletees: number,
    public tempsEtudie: number,
    public notes: string | undefined,
    public xpGained: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static fromDomain(progress: Progress): ProgressResponseDto {
    return new ProgressResponseDto(
      progress.id,
      progress.userId,
      progress.date,
      progress.sessionsCompletees,
      progress.tempsEtudie,
      progress.notes,
      progress.xpGained,
      progress.createdAt,
      progress.updatedAt
    );
  }
}

export class ProgressSummaryDto {
  constructor(
    public totalXP: number,
    public level: number,
    public xpToNextLevel: number,
    public rank: string,
    public streak: number,
    public totalStudyTime: number,
    public averageSessionDuration: number,
    public completionRate: number
  ) {}
}

export class ProgressHistoryDto {
  constructor(
    public date: string,
    public sessionsCompletees: number,
    public tempsEtudie: number,
    public xpGained: number
  ) {}
}

export class ProgressStatsDto {
  constructor(
    public totalSessions: number,
    public totalTime: number,
    public totalXp: number,
    public averagePerDay: number,
    public sessionsByDay: { [key: string]: number }
  ) {}
}

export class RecordProgressRequestDto {
  constructor(
    public date: string,
    public sessionsCompletees: number,
    public tempsEtudie: number,
    public notes?: string
  ) {}
}

export class ProgressQueryDto {
  constructor(
    public limit?: number,
    public offset?: number,
    public startDate?: string,
    public endDate?: string
  ) {}
}