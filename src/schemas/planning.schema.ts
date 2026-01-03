import { z } from 'zod';

export const planningSchema = z.object({
  body: z.object({
    periode: z.enum(['jour', 'semaine', 'mois', 'semestre']),
    dateDebut: z.string(),
    sessions: z.array(z.object({
      matiere: z.string().min(1),
      debut: z.string(),
      fin: z.string(),
      type: z.enum(['LEARNING', 'REVIEW', 'PRACTICE', 'MOCK_EXAM', 'BUFFER', 'PAUSE']).optional(),
      method: z.enum(['POMODORO', 'DEEP_WORK', 'CLASSIC']).optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
      notes: z.string().optional()
    })).min(1)
  }),
});

export const generatePlanningSchema = z.object({
  body: z.object({
    periode: z.enum(['jour', 'semaine']),
    dateDebut: z.string(),
  }),
});
