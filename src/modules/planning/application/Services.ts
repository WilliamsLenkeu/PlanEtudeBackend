import { ObjectId } from '../../../shared/types';
import { Planning, PlanningSession } from '../domain/Planning';

// Interfaces des services
export interface IPlanningService {
  createPlanning(data: {
    userId: ObjectId;
    titre: string;
    periode: 'jour' | 'semaine' | 'mois' | 'semestre';
    nombre: number;
    dateDebut: string;
    sessions: Array<{
      matiere: string;
      debut: string;
      fin: string;
      type?: string;
      method?: string;
      priority?: 'HIGH' | 'MEDIUM' | 'LOW';
      statut?: 'planifie' | 'en_cours' | 'termine' | 'rate';
      notes?: string;
    }>;
    generatedBy?: 'AI' | 'LOCAL';
  }): Promise<Planning>;

  getPlanning(planningId: ObjectId, userId: ObjectId): Promise<Planning>;

  getUserPlannings(userId: ObjectId, options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ plannings: Planning[]; total: number }>;

  updatePlanning(planningId: ObjectId, userId: ObjectId, updates: Partial<{
    titre: string;
    periode: 'jour' | 'semaine' | 'mois' | 'semestre';
    sessions: Array<{
      matiere: string;
      debut: string;
      fin: string;
      type?: string;
      method?: string;
      priority?: 'HIGH' | 'MEDIUM' | 'LOW';
      statut?: 'planifie' | 'en_cours' | 'termine' | 'rate';
      notes?: string;
    }>;
  }>): Promise<Planning>;

  deletePlanning(planningId: ObjectId, userId: ObjectId): Promise<boolean>;

  addSession(planningId: ObjectId, userId: ObjectId, session: {
    matiere: string;
    debut: string;
    fin: string;
    type?: string;
    method?: string;
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';
    notes?: string;
  }): Promise<Planning>;

  updateSession(planningId: ObjectId, userId: ObjectId, sessionId: string, updates: Partial<{
    matiere: string;
    debut: string;
    fin: string;
    type?: string;
    method?: string;
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';
    statut?: 'planifie' | 'en_cours' | 'termine' | 'rate';
    notes?: string;
  }>): Promise<Planning>;

  deleteSession(planningId: ObjectId, userId: ObjectId, sessionId: string): Promise<Planning>;
}

export interface IExportService {
  generateICal(planning: Planning): Promise<string>;
  generatePDF(planning: Planning): Promise<Buffer>;
}