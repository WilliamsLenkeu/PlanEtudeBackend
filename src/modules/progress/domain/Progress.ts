import { ObjectId } from '../../../shared/types';

// Entité métier Progress (Domain Entity)
export class Progress {
  public readonly id: ObjectId;
  public readonly userId: ObjectId;
  public readonly createdAt: Date;
  public updatedAt: Date;

  // Propriétés métier
  private _date: Date;
  private _sessionsCompletees: number;
  private _tempsEtudie: number; // en minutes
  private _notes?: string;
  private _xpGained: number;

  constructor(
    id: ObjectId,
    userId: ObjectId,
    date: Date,
    sessionsCompletees: number,
    tempsEtudie: number,
    options?: {
      notes?: string;
      xpGained?: number;
      createdAt?: Date;
      updatedAt?: Date;
    }
  ) {
    this.id = id;
    this.userId = userId;
    this._date = date;
    this._sessionsCompletees = sessionsCompletees;
    this._tempsEtudie = tempsEtudie;
    this._notes = options?.notes;
    this._xpGained = options?.xpGained || 0;
    this.createdAt = options?.createdAt || new Date();
    this.updatedAt = options?.updatedAt || new Date();
  }

  // Getters
  get date(): Date { return this._date; }
  get sessionsCompletees(): number { return this._sessionsCompletees; }
  get tempsEtudie(): number { return this._tempsEtudie; }
  get notes(): string | undefined { return this._notes; }
  get xpGained(): number { return this._xpGained; }

  // Méthodes métier
  updateProgress(updates: {
    sessionsCompletees?: number;
    tempsEtudie?: number;
    notes?: string;
  }): void {
    if (updates.sessionsCompletees !== undefined) {
      this._sessionsCompletees = updates.sessionsCompletees;
    }
    if (updates.tempsEtudie !== undefined) {
      this._tempsEtudie = updates.tempsEtudie;
    }
    if (updates.notes !== undefined) {
      this._notes = updates.notes;
    }
    this.updatedAt = new Date();
  }

  calculateXpForSession(): number {
    // XP basé sur le temps d'étude et les sessions complétées
    const baseXp = this._tempsEtudie * 10; // 10 XP par minute
    const sessionBonus = this._sessionsCompletees * 50; // 50 XP par session
    return baseXp + sessionBonus;
  }

  // Conversion pour la persistance
  toPersistence(): any {
    return {
      _id: this.id,
      userId: this.userId,
      date: this._date,
      sessionsCompletees: this._sessionsCompletees,
      tempsEtudie: this._tempsEtudie,
      notes: this._notes,
      xpGained: this._xpGained,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Factory method
  static fromPersistence(data: any): Progress {
    return new Progress(
      data._id || data.id,
      data.userId,
      new Date(data.date),
      data.sessionsCompletees,
      data.tempsEtudie,
      {
        notes: data.notes,
        xpGained: data.xpGained,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }
    );
  }
}

// Entité pour le résumé de progression
export class ProgressSummary {
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

  static fromData(data: any): ProgressSummary {
    return new ProgressSummary(
      data.totalXP || 0,
      data.level || 1,
      data.xpToNextLevel || 100,
      data.rank || 'Novice',
      data.streak || 0,
      data.totalStudyTime || 0,
      data.averageSessionDuration || 0,
      data.completionRate || 0
    );
  }
}

// Entité pour l'historique de progression
export class ProgressHistory {
  constructor(
    public date: string,
    public sessionsCompletees: number,
    public tempsEtudie: number,
    public xpGained: number
  ) {}

  static fromData(data: any): ProgressHistory {
    return new ProgressHistory(
      data.date,
      data.sessionsCompletees,
      data.tempsEtudie,
      data.xpGained
    );
  }
}