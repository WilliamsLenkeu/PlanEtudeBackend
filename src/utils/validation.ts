import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Format email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    gender: z.enum(['M', 'F', 'O']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Format email invalide'),
    password: z.string().min(1, 'Le mot de passe est requis'),
  }),
});

export const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Le message ne peut pas être vide'),
  }),
});

export const progressSchema = z.object({
  body: z.object({
    sessionsCompletees: z.number().min(0),
    tempsEtudie: z.number().min(0),
    date: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const planningSchema = z.object({
  body: z.object({
    periode: z.enum(['jour', 'semaine', 'mois']),
    dateDebut: z.string().optional(),
    sessions: z.array(z.object({
      matiere: z.string().min(1),
      debut: z.string(),
      fin: z.string(),
      notes: z.string().optional()
    })).min(1)
  }),
});
