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

export const subjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Le nom est requis'),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Format de couleur invalide (ex: #FF0000)').optional(),
    icon: z.string().optional(),
    difficulty: z.number().min(1).max(5).optional(),
    goalHoursPerWeek: z.number().min(0).optional(),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    gender: z.enum(['M', 'F', 'Autre']).optional(),
    avatar: z.string().url().optional(),
    preferences: z.object({
      matieres: z.array(z.string()).optional()
    }).optional()
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, 'Ancien mot de passe requis'),
    newPassword: z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères')
  })
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
