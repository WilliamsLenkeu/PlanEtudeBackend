import { ObjectId } from '../../../shared/types';
import { Planning } from '../domain/Planning';

// DTOs de réponse
export class PlanningResponseDto {
  constructor(
    public id: ObjectId,
    public userId: ObjectId,
    public titre: string,
    public periode: 'jour' | 'semaine' | 'mois' | 'semestre',
    public nombre: number,
    public dateDebut: Date,
    public generatedBy: 'AI' | 'LOCAL',
    public sessions: any[],
    public sessionsCount: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static fromDomain(planning: Planning): PlanningResponseDto {
    return new PlanningResponseDto(
      planning.id,
      planning.userId,
      planning.titre,
      planning.periode,
      planning.nombre,
      planning.dateDebut,
      planning.generatedBy,
      planning.sessions.map(s => ({
        id: s.id,
        matiere: s.matiere,
        debut: s.debut,
        fin: s.fin,
        type: s.type,
        method: s.method,
        priority: s.priority,
        statut: s.statut,
        notes: s.notes
      })),
      planning.sessionsCount,
      planning.createdAt,
      planning.updatedAt
    );
  }
}

export class PlanningsListDto {
  constructor(
    public plannings: PlanningResponseDto[],
    public total: number,
    public pagination: {
      page: number;
      limit: number;
      totalPages: number;
    }
  ) {}
}

export class ICalExportDto {
  constructor(
    public ical: string,
    public filename: string
  ) {}
}

// DTOs de requête
export class CreatePlanningRequestDto {
  constructor(
    public titre: string,
    public periode: 'jour' | 'semaine' | 'mois' | 'semestre',
    public nombre: number,
    public dateDebut: string,
    public sessions: Array<{
      matiere: string;
      debut: string;
      fin: string;
      type?: string;
      method?: string;
      priority?: 'HIGH' | 'MEDIUM' | 'LOW';
      notes?: string;
    }>,
    public generatedBy?: 'AI' | 'LOCAL'
  ) {}
}

export class UpdatePlanningRequestDto {
  constructor(
    public titre?: string,
    public periode?: 'jour' | 'semaine' | 'mois' | 'semestre',
    public sessions?: Array<{
      matiere: string;
      debut: string;
      fin: string;
      type?: string;
      method?: string;
      priority?: 'HIGH' | 'MEDIUM' | 'LOW';
      statut?: 'planifie' | 'en_cours' | 'termine' | 'rate';
      notes?: string;
    }>
  ) {}
}

export class AddSessionRequestDto {
  constructor(
    public matiere: string,
    public debut: string,
    public fin: string,
    public type?: string,
    public method?: string,
    public priority?: 'HIGH' | 'MEDIUM' | 'LOW',
    public notes?: string
  ) {}
}

export class UpdateSessionRequestDto {
  constructor(
    public matiere?: string,
    public debut?: string,
    public fin?: string,
    public type?: string,
    public method?: string,
    public priority?: 'HIGH' | 'MEDIUM' | 'LOW',
    public statut?: 'planifie' | 'en_cours' | 'termine' | 'rate',
    public notes?: string
  ) {}
}

export class PlanningQueryDto {
  constructor(
    public limit?: number,
    public offset?: number,
    public sortBy?: string,
    public sortOrder?: 'asc' | 'desc'
  ) {}
}