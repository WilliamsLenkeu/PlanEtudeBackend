import { ObjectId } from '../../../shared/types';

// Entité métier Planning (Domain Entity)
export class Planning {
  public readonly id: ObjectId;
  public readonly userId: ObjectId;
  public readonly createdAt: Date;
  public updatedAt: Date;

  // Propriétés métier
  private _titre: string;
  private _periode: 'jour' | 'semaine' | 'mois' | 'semestre';
  private _nombre: number;
  private _dateDebut: Date;
  private _generatedBy: 'AI' | 'LOCAL';
  private _sessions: PlanningSession[];
  private _sessionsCount: number;

  constructor(
    id: ObjectId,
    userId: ObjectId,
    titre: string,
    periode: 'jour' | 'semaine' | 'mois' | 'semestre',
    nombre: number,
    dateDebut: Date,
    sessions: PlanningSession[] = [],
    options?: {
      generatedBy?: 'AI' | 'LOCAL';
      createdAt?: Date;
      updatedAt?: Date;
    }
  ) {
    this.id = id;
    this.userId = userId;
    this._titre = titre;
    this._periode = periode;
    this._nombre = nombre;
    this._dateDebut = dateDebut;
    this._sessions = sessions;
    this._sessionsCount = sessions.length;
    this._generatedBy = options?.generatedBy || 'LOCAL';
    this.createdAt = options?.createdAt || new Date();
    this.updatedAt = options?.updatedAt || new Date();
  }

  // Getters
  get titre(): string { return this._titre; }
  get periode(): 'jour' | 'semaine' | 'mois' | 'semestre' { return this._periode; }
  get nombre(): number { return this._nombre; }
  get dateDebut(): Date { return this._dateDebut; }
  get generatedBy(): 'AI' | 'LOCAL' { return this._generatedBy; }
  get sessions(): PlanningSession[] { return [...this._sessions]; }
  get sessionsCount(): number { return this._sessionsCount; }

  // Méthodes métier
  updateTitre(titre: string): void {
    this._titre = titre;
    this.updatedAt = new Date();
  }

  updatePeriode(periode: 'jour' | 'semaine' | 'mois' | 'semestre'): void {
    this._periode = periode;
    this.updatedAt = new Date();
  }

  addSession(session: PlanningSession): void {
    this._sessions.push(session);
    this._sessionsCount = this._sessions.length;
    this.updatedAt = new Date();
  }

  updateSession(sessionId: string, updates: Partial<PlanningSession>): void {
    const index = this._sessions.findIndex(s => s.id === sessionId);
    if (index >= 0) {
      this._sessions[index] = { ...this._sessions[index], ...updates };
      this.updatedAt = new Date();
    }
  }

  removeSession(sessionId: string): void {
    this._sessions = this._sessions.filter(s => s.id !== sessionId);
    this._sessionsCount = this._sessions.length;
    this.updatedAt = new Date();
  }

  getSessionsBySubject(subject: string): PlanningSession[] {
    return this._sessions.filter(s => s.matiere === subject);
  }

  getCompletedSessions(): PlanningSession[] {
    return this._sessions.filter(s => s.statut === 'termine');
  }

  getPlannedSessions(): PlanningSession[] {
    return this._sessions.filter(s => s.statut === 'planifie');
  }

  calculateTotalDuration(): number {
    return this._sessions.reduce((total, session) => {
      const start = new Date(session.debut).getTime();
      const end = new Date(session.fin).getTime();
      return total + (end - start) / (1000 * 60); // en minutes
    }, 0);
  }

  calculateCompletionRate(): number {
    if (this._sessionsCount === 0) return 0;
    const completed = this._sessions.filter(s => s.statut === 'termine').length;
    return Math.round((completed / this._sessionsCount) * 100);
  }

  // Conversion pour la persistance
  toPersistence(): any {
    return {
      _id: this.id,
      userId: this.userId,
      titre: this._titre,
      periode: this._periode,
      nombre: this._nombre,
      dateDebut: this._dateDebut,
      generatedBy: this._generatedBy,
      sessions: this._sessions,
      sessionsCount: this._sessionsCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Factory method
  static fromPersistence(data: any): Planning {
    return new Planning(
      data._id || data.id,
      data.userId,
      data.titre,
      data.periode,
      data.nombre,
      new Date(data.dateDebut),
      data.sessions || [],
      {
        generatedBy: data.generatedBy,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }
    );
  }
}

// Value Object pour les sessions
export class PlanningSession {
  public readonly id: string;
  public readonly matiere: string;
  public readonly debut: Date;
  public readonly fin: Date;
  public type?: string;
  public method?: string;
  public priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  public statut: 'planifie' | 'en_cours' | 'termine' | 'rate';
  public notes?: string;

  constructor(
    matiere: string,
    debut: Date,
    fin: Date,
    options?: {
      id?: string;
      type?: string;
      method?: string;
      priority?: 'HIGH' | 'MEDIUM' | 'LOW';
      statut?: 'planifie' | 'en_cours' | 'termine' | 'rate';
      notes?: string;
    }
  ) {
    this.id = options?.id || crypto.randomUUID();
    this.matiere = matiere;
    this.debut = debut;
    this.fin = fin;
    this.type = options?.type;
    this.method = options?.method;
    this.priority = options?.priority;
    this.statut = options?.statut || 'planifie';
    this.notes = options?.notes;
  }

  static fromPersistence(data: any): PlanningSession {
    return new PlanningSession(data.matiere, new Date(data.debut), new Date(data.fin), {
      id: data.id,
      type: data.type,
      method: data.method,
      priority: data.priority,
      statut: data.statut,
      notes: data.notes
    });
  }
}

import crypto from 'crypto';