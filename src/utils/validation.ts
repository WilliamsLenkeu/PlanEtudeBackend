import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  gender: z.enum(['M', 'F', 'Autre'], {
    errorMap: () => ({ message: "Le genre doit être M, F ou Autre" })
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const planningSchema = z.object({
  periode: z.enum(['jour', 'semaine', 'mois', 'semestre']),
  dateDebut: z.string().or(z.date()),
  sessions: z.array(z.object({
    matiere: z.string(),
    debut: z.string().or(z.date()),
    fin: z.string().or(z.date()),
    statut: z.enum(['planifie', 'en_cours', 'termine', 'rate']).default('planifie'),
    notes: z.string().optional(),
  })),
});

export const progressSchema = z.object({
  date: z.string().or(z.date()).optional(),
  sessionsCompletees: z.number().min(0),
  tempsEtudie: z.number().min(0),
  notes: z.string().optional(),
});