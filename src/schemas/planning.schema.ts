import { z } from 'zod';

export const createPlanningSchema = z.object({
  body: z.object({
    titre: z.string({
      required_error: "Le titre est requis",
    }).max(50, "Le titre ne doit pas dépasser 50 caractères"),
    periode: z.enum(['jour', 'semaine', 'mois', 'semestre'], {
      required_error: "La période est requise",
    }),
    nombre: z.number().min(1).optional(),
    dateDebut: z.string({
      required_error: "La date de début est requise",
    }),
    generatedBy: z.enum(['AI', 'LOCAL']).optional(),
    sessions: z.array(
      z.object({
        matiere: z.string({
          required_error: "La matière est requise",
        }),
        debut: z.string({
          required_error: "La date de début de session est requise",
        }),
        fin: z.string({
          required_error: "La date de fin de session est requise",
        }),
        type: z.enum(['LEARNING', 'REVIEW', 'PRACTICE', 'MOCK_EXAM', 'BUFFER', 'PAUSE']).optional(),
        method: z.enum(['POMODORO', 'DEEP_WORK', 'CLASSIC']).optional(),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
        notes: z.string().optional(),
      })
    ).min(1, "Au moins une session est requise"),
  }),
});

export const generatePlanningSchema = z.object({
  body: z.object({
    titre: z.string().max(50).optional(),
    periode: z.enum(['jour', 'semaine', 'mois', 'semestre'], {
      required_error: "La période est requise",
    }),
    nombre: z.number().min(1).optional(),
    dateDebut: z.string({
      required_error: "La date de début est requise",
    }),
  }),
});
