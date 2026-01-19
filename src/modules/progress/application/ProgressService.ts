import { Progress } from '../domain/Progress';
import { IProgressRepository } from '../domain/Repositories';
import { IProgressService } from './Services';
import { ObjectId } from '../../../shared/types';
import { Logger } from '../../../core/logging/Logger';
import { eventBus, createEvent } from '../../../core/events/EventBus';
import { NotFoundError, AuthorizationError } from '../../../shared/errors/CustomErrors';
import { GamificationUtils } from '../../../shared/utils';

export class ProgressService implements IProgressService {
  constructor(
    private progressRepository: IProgressRepository
  ) {}

  async recordProgress(data: {
    userId: ObjectId;
    date: string;
    sessionsCompletees: number;
    tempsEtudie: number;
    notes?: string;
  }): Promise<Progress> {
    Logger.business('progress', 'record', { userId: data.userId });

    // Calculer l'XP gained
    const xpGained = GamificationUtils.calculateSessionXp(data.tempsEtudie);

    const progress = new Progress(
      '' as ObjectId,
      data.userId,
      new Date(data.date),
      data.sessionsCompletees,
      data.tempsEtudie,
      {
        notes: data.notes,
        xpGained
      }
    );

    const savedProgress = await this.progressRepository.create(progress);

    // Émettre l'événement
    eventBus.emitProgressRecorded({
      userId: savedProgress.userId,
      date: savedProgress.date.toISOString().split('T')[0],
      sessionsCompleted: savedProgress.sessionsCompletees,
      studyTime: savedProgress.tempsEtudie,
      timestamp: new Date()
    });

    Logger.business('progress', 'recorded', { progressId: savedProgress.id, xpGained });
    return savedProgress;
  }

  async getProgress(progressId: ObjectId, userId: ObjectId): Promise<Progress> {
    const progress = await this.progressRepository.findById(progressId);
    if (!progress) {
      throw new NotFoundError('Progress');
    }
    if (progress.userId !== userId) {
      throw new AuthorizationError('Vous n\'avez pas accès à ces données');
    }
    return progress;
  }

  async getUserProgress(userId: ObjectId, options?: {
    limit?: number;
    offset?: number;
  }): Promise<{ progressList: Progress[]; total: number }> {
    Logger.business('progress', 'get_user_progress', { userId, options });

    const [progressList, total] = await Promise.all([
      this.progressRepository.findByUserId(userId, options),
      this.progressRepository.countByUserId(userId)
    ]);

    return { progressList, total };
  }

  async getProgressSummary(userId: ObjectId): Promise<any> {
    Logger.business('progress', 'get_summary', { userId });

    const recentProgress = await this.progressRepository.findLatest(userId, 30);

    // Calculer les statistiques
    const totalSessions = recentProgress.reduce((sum: number, p: Progress) => sum + p.sessionsCompletees, 0);
    const totalTime = recentProgress.reduce((sum: number, p: Progress) => sum + p.tempsEtudie, 0);
    const totalXp = recentProgress.reduce((sum: number, p: Progress) => sum + p.xpGained, 0);

    const level = GamificationUtils.calculateLevel(totalXp);
    const xpToNextLevel = GamificationUtils.calculateXpToNextLevel(totalXp);

    // Calculer le streak
    const streak = await this.calculateStreak(userId);

    // Calculer le taux de complétion moyen
    const completionRate = recentProgress.length > 0
      ? Math.round((totalSessions / (recentProgress.length * 3)) * 100) //假设每天3个session
      : 0;

    return {
      totalXP: totalXp,
      level,
      xpToNextLevel,
      rank: this.calculateRank(totalXp),
      streak,
      totalStudyTime: totalTime,
      averageSessionDuration: totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0,
      completionRate: Math.min(completionRate, 100)
    };
  }

  async getProgressHistory(userId: ObjectId, days: number = 7): Promise<any[]> {
    Logger.business('progress', 'get_history', { userId, days });

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const progress = await this.progressRepository.findByDateRange(userId, startDate, endDate);

    return progress.map(p => ({
      date: p.date.toISOString().split('T')[0],
      sessionsCompletees: p.sessionsCompletees,
      tempsEtudie: p.tempsEtudie,
      xpGained: p.xpGained
    }));
  }

  async getStats(userId: ObjectId, startDate?: string, endDate?: string): Promise<any> {
    Logger.business('progress', 'get_stats', { userId, startDate, endDate });

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const progress = await this.progressRepository.findByDateRange(userId, start, end);

    const totalSessions = progress.reduce((sum: number, p: Progress) => sum + p.sessionsCompletees, 0);
    const totalTime = progress.reduce((sum: number, p: Progress) => sum + p.tempsEtudie, 0);
    const totalXp = progress.reduce((sum: number, p: Progress) => sum + p.xpGained, 0);

    return {
      totalSessions,
      totalTime,
      totalXp,
      averagePerDay: totalTime / Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))),
      sessionsByDay: this.groupByDate(progress)
    };
  }

  async deleteProgress(progressId: ObjectId, userId: ObjectId): Promise<boolean> {
    await this.getProgress(progressId, userId);
    return this.progressRepository.delete(progressId);
  }

  async calculateStreak(userId: ObjectId): Promise<number> {
    const recentProgress = await this.progressRepository.findLatest(userId, 30);
    
    if (recentProgress.length === 0) return 0;

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date();

    // Trier par date
    const sortedProgress = recentProgress.sort((a: Progress, b: Progress) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (let i = 0; i < sortedProgress.length; i++) {
      const progressDate = new Date(sortedProgress[i].date).toISOString().split('T')[0];
      
      // Vérifier si c'est aujourd'hui ou hier
      const diffDays = Math.floor((currentDate.getTime() - new Date(progressDate).getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1 && sortedProgress[i].tempsEtudie > 0) {
        streak++;
        currentDate = new Date(progressDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (diffDays > 1) {
        break;
      }
    }

    return streak;
  }

  private calculateRank(xp: number): string {
    if (xp < 100) return 'Novice';
    if (xp < 500) return 'Apprenti';
    if (xp < 1000) return 'Étudiant';
    if (xp < 2500) return 'Scholar';
    if (xp < 5000) return 'Expert';
    if (xp < 10000) return 'Maître';
    return 'Legend';
  }

  private groupByDate(progress: Progress[]): { [key: string]: number } {
    const grouped: { [key: string]: number } = {};
    progress.forEach((p: Progress) => {
      const date = p.date.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + p.tempsEtudie;
    });
    return grouped;
  }
}