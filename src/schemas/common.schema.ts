import { z } from 'zod';

export const progressSchema = z.object({
  body: z.object({
    sessionsCompletees: z.number().min(0),
    tempsEtudie: z.number().min(0),
    date: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const subjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Le nom est requis'),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Format de couleur invalide (ex: #FF0000)').optional(),
    icon: z.string().optional(),
    difficulty: z.number().min(1).max(5).optional(),
    goalHoursPerWeek: z.number().min(0).optional(),
  }),
});

export const reminderSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Le titre est requis'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Format de date invalide",
    }),
    planningId: z.string().optional(),
  }),
});
