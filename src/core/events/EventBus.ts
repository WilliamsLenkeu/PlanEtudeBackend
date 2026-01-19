import { EventEmitter } from 'node:events';

// Types d'événements
export enum EventTypes {
  // Auth events
  USER_REGISTERED = 'user.registered',
  USER_LOGGED_IN = 'user.logged_in',
  USER_PROFILE_UPDATED = 'user.profile_updated',

  // Planning events
  PLANNING_CREATED = 'planning.created',
  PLANNING_UPDATED = 'planning.updated',
  PLANNING_DELETED = 'planning.deleted',
  SESSION_COMPLETED = 'session.completed',

  // Progress events
  PROGRESS_RECORDED = 'progress.recorded',
  STUDY_STREAK_UPDATED = 'study_streak.updated',
  LEVEL_UP = 'level_up',

  // Achievement events
  BADGE_UNLOCKED = 'badge.unlocked',
  ACHIEVEMENT_EARNED = 'achievement.earned',

  // Admin events
  USER_BLOCKED = 'user.blocked',
  SYSTEM_MAINTENANCE = 'system.maintenance'
}

// Interfaces des événements
export interface UserRegisteredEvent {
  userId: string;
  email: string;
  name: string;
  timestamp: Date;
}

export interface UserLoggedInEvent {
  userId: string;
  timestamp: Date;
}

export interface PlanningCreatedEvent {
  planningId: string;
  userId: string;
  title: string;
  sessionCount: number;
  timestamp: Date;
}

export interface ProgressRecordedEvent {
  userId: string;
  date: string;
  sessionsCompleted: number;
  studyTime: number;
  timestamp: Date;
}

export interface LevelUpEvent {
  userId: string;
  newLevel: number;
  xpGained: number;
  timestamp: Date;
}

// Event bus singleton
class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    this.setMaxListeners(50); // Augmenter la limite par défaut
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  // Méthodes helper pour émettre des événements typés
  emitUserRegistered(event: UserRegisteredEvent): void {
    this.emit(EventTypes.USER_REGISTERED, event);
  }

  emitUserLoggedIn(event: UserLoggedInEvent): void {
    this.emit(EventTypes.USER_LOGGED_IN, event);
  }

  emitPlanningCreated(event: PlanningCreatedEvent): void {
    this.emit(EventTypes.PLANNING_CREATED, event);
  }

  emitProgressRecorded(event: ProgressRecordedEvent): void {
    this.emit(EventTypes.PROGRESS_RECORDED, event);
  }

  emitLevelUp(event: LevelUpEvent): void {
    this.emit(EventTypes.LEVEL_UP, event);
  }
}

// Export de l'instance singleton
export const eventBus = EventBus.getInstance();

// Helper pour créer des événements avec timestamp
export const createEvent = <T>(data: Omit<T, 'timestamp'>): T => ({
  ...data,
  timestamp: new Date()
} as T);