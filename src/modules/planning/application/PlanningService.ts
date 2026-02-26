import { Planning, PlanningSession } from '../domain/Planning';
import { IPlanningRepository } from '../domain/Repositories';
import { IPlanningService, IExportService } from './Services';
import { ObjectId } from '../../../shared/types';
import { Logger } from '../../../core/logging/Logger';
import { eventBus, EventTypes, createEvent } from '../../../core/events/EventBus';
import { NotFoundError, AuthorizationError } from '../../../shared/errors/CustomErrors';

interface PlanningCreatedEvent {
  planningId: string;
  userId: string;
  title: string;
  sessionCount: number;
  timestamp: Date;
}

export class PlanningService implements IPlanningService {
  constructor(
    private planningRepository: IPlanningRepository
  ) {}

  async createPlanning(data: {
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
  }): Promise<Planning> {
    Logger.business('planning', 'create', { userId: data.userId, titre: data.titre });

    // Créer les sessions
    const sessions = data.sessions.map(session => new PlanningSession(
      session.matiere,
      new Date(session.debut),
      new Date(session.fin),
      {
        type: session.type,
        method: session.method,
        priority: session.priority,
        statut: session.statut || 'planifie',
        notes: session.notes
      }
    ));

    // Créer le planning
    const planning = new Planning(
      '' as ObjectId,
      data.userId,
      data.titre,
      data.periode,
      data.nombre,
      new Date(data.dateDebut),
      sessions,
      { generatedBy: data.generatedBy || 'LOCAL' }
    );

    // Sauvegarder
    const savedPlanning = await this.planningRepository.create(planning);

    // Émettre l'événement
    eventBus.emitPlanningCreated({
      planningId: savedPlanning.id,
      userId: savedPlanning.userId,
      title: savedPlanning.titre,
      sessionCount: savedPlanning.sessionsCount,
      timestamp: new Date()
    });

    Logger.business('planning', 'created', { planningId: savedPlanning.id });
    return savedPlanning;
  }

  async getPlanning(planningId: ObjectId, userId: ObjectId): Promise<Planning> {
    Logger.business('planning', 'get', { planningId, userId });

    const planning = await this.planningRepository.findById(planningId);
    if (!planning) {
      throw new NotFoundError('Planning');
    }

    // Comparer les IDs en string (MongoDB ObjectId vs string JWT)
    const planningUserId = planning.userId != null ? String(planning.userId) : null;
    const requestUserId = userId != null ? String(userId) : null;
    if (planningUserId !== requestUserId) {
      throw new AuthorizationError('Vous n\'avez pas accès à ce planning');
    }

    return planning;
  }

  async getUserPlannings(userId: ObjectId, options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ plannings: Planning[]; total: number }> {
    Logger.business('planning', 'get_user_plannings', { userId, options });

    const [plannings, total] = await Promise.all([
      this.planningRepository.findByUserId(userId, options),
      this.planningRepository.countByUserId(userId)
    ]);

    return { plannings, total };
  }

  async updatePlanning(planningId: ObjectId, userId: ObjectId, updates: Partial<{
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
  }>): Promise<Planning> {
    Logger.business('planning', 'update', { planningId, userId });

    // Récupérer le planning existant
    const planning = await this.getPlanning(planningId, userId);

    // Appliquer les mises à jour
    if (updates.titre) {
      planning.updateTitre(updates.titre);
    }

    if (updates.periode) {
      planning.updatePeriode(updates.periode);
    }

    if (updates.sessions) {
      // Remplacer toutes les sessions
      const newSessions = updates.sessions.map(session => new PlanningSession(
        session.matiere,
        new Date(session.debut),
        new Date(session.fin),
        {
          type: session.type,
          method: session.method,
          priority: session.priority,
          statut: session.statut || 'planifie',
          notes: session.notes
        }
      ));

      // Note: Cette logique devrait être améliorée pour préserver les IDs
      planning['_sessions'] = newSessions;
      planning['_sessionsCount'] = newSessions.length;
    }

    // Sauvegarder
    const updatedPlanning = await this.planningRepository.update(planning);

    Logger.business('planning', 'updated', { planningId });
    return updatedPlanning;
  }

  async deletePlanning(planningId: ObjectId, userId: ObjectId): Promise<boolean> {
    Logger.business('planning', 'delete', { planningId, userId });

    // Vérifier l'accès
    await this.getPlanning(planningId, userId);

    const deleted = await this.planningRepository.delete(planningId);

    Logger.business('planning', 'deleted', { planningId });
    return deleted;
  }

  async addSession(planningId: ObjectId, userId: ObjectId, session: {
    matiere: string;
    debut: string;
    fin: string;
    type?: string;
    method?: string;
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';
    notes?: string;
  }): Promise<Planning> {
    Logger.business('planning', 'add_session', { planningId, userId });

    const planning = await this.getPlanning(planningId, userId);

    const newSession = new PlanningSession(
      session.matiere,
      new Date(session.debut),
      new Date(session.fin),
      {
        type: session.type,
        method: session.method,
        priority: session.priority,
        notes: session.notes
      }
    );

    planning.addSession(newSession);
    const updatedPlanning = await this.planningRepository.update(planning);

    Logger.business('planning', 'session_added', { planningId, sessionId: newSession.id });
    return updatedPlanning;
  }

  async updateSession(planningId: ObjectId, userId: ObjectId, sessionId: string, updates: Partial<{
    matiere: string;
    debut: string;
    fin: string;
    type?: string;
    method?: string;
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';
    statut?: 'planifie' | 'en_cours' | 'termine' | 'rate';
    notes?: string;
  }>): Promise<Planning> {
    Logger.business('planning', 'update_session', { planningId, userId, sessionId });

    const planning = await this.getPlanning(planningId, userId);

    // Préparer les mises à jour
    const sessionUpdates: any = {};
    if (updates.matiere) sessionUpdates.matiere = updates.matiere;
    if (updates.debut) sessionUpdates.debut = new Date(updates.debut);
    if (updates.fin) sessionUpdates.fin = new Date(updates.fin);
    if (updates.type !== undefined) sessionUpdates.type = updates.type;
    if (updates.method !== undefined) sessionUpdates.method = updates.method;
    if (updates.priority !== undefined) sessionUpdates.priority = updates.priority;
    if (updates.statut !== undefined) sessionUpdates.statut = updates.statut;
    if (updates.notes !== undefined) sessionUpdates.notes = updates.notes;

    planning.updateSession(sessionId, sessionUpdates);
    const updatedPlanning = await this.planningRepository.update(planning);

    Logger.business('planning', 'session_updated', { planningId, sessionId });
    return updatedPlanning;
  }

  async deleteSession(planningId: ObjectId, userId: ObjectId, sessionId: string): Promise<Planning> {
    Logger.business('planning', 'delete_session', { planningId, userId, sessionId });

    const planning = await this.getPlanning(planningId, userId);
    planning.removeSession(sessionId);
    const updatedPlanning = await this.planningRepository.update(planning);

    Logger.business('planning', 'session_deleted', { planningId, sessionId });
    return updatedPlanning;
  }
}

// Service d'export iCal
export class ICalExportService implements IExportService {
  generateICal(planning: Planning): Promise<string> {
    let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PlanÉtude//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:PlanÉtude - ${planning.titre}
`;

    for (const session of planning.sessions) {
      const startDate = new Date(session.debut);
      const endDate = new Date(session.fin);

      const dtstart = this.formatICalDate(startDate);
      const dtend = this.formatICalDate(endDate);

      ical += `BEGIN:VEVENT
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${session.matiere}
DESCRIPTION:Type: ${session.type || 'N/A'}\\nMéthode: ${session.method || 'N/A'}
LOCATION:PlanÉtude
STATUS:CONFIRMED
END:VEVENT
`;
    }

    ical += 'END:VCALENDAR';

    return Promise.resolve(ical);
  }

  generatePDF(planning: Planning): Promise<Buffer> {
    // Implémentation PDF différée pour éviter les dépendances lourdes
    return Promise.resolve(Buffer.from('PDF generation not implemented yet'));
  }

  private formatICalDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
}