import { z } from 'zod';

// Schémas de validation réutilisables
export const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID MongoDB invalide');

export const EmailSchema = z.string().email('Email invalide');

export const PasswordSchema = z.string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre');

export const GenderSchema = z.enum(['M', 'F'], {
  errorMap: () => ({ message: 'Le genre doit être M ou F' })
});

export const ThemeNameSchema = z.string().min(1, 'Le nom du thème est requis');

export const SubjectNameSchema = z.string().min(1, 'Le nom de la matière est requis');

export const DateStringSchema = z.string().refine((date) => !isNaN(Date.parse(date)), {
  message: 'Date invalide'
});

// Schémas de domaine spécifiques
export const UserPreferencesSchema = z.object({
  currentTheme: z.string().default('classic-pink'),
  unlockedThemes: z.array(z.string()).default(['classic-pink']),
  matieres: z.array(z.string()).default([]),
  hasCompletedSetup: z.boolean().default(false)
});

export const StudyStatsSchema = z.object({
  totalStudyTime: z.number().min(0).default(0),
  lastStudyDate: z.date().optional(),
  subjectMastery: z.array(z.object({
    subjectName: z.string(),
    score: z.number().min(0).max(100).default(0),
    lastStudied: z.date().default(() => new Date())
  })).default([])
});

// DTOs de requête Auth
export const RegisterUserDto = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: EmailSchema,
  password: PasswordSchema,
  gender: GenderSchema
});

export const LoginUserDto = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Le mot de passe est requis')
});

export const UpdateProfileDto = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  preferences: UserPreferencesSchema.optional()
});

// DTOs de requête Planning
export const SessionDto = z.object({
  matiere: z.string().min(1, 'La matière est requise'),
  debut: DateStringSchema,
  fin: DateStringSchema,
  type: z.string().optional(),
  method: z.string().optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  statut: z.enum(['planifie', 'en_cours', 'termine', 'rate']).default('planifie'),
  notes: z.string().optional()
});

export const CreatePlanningDto = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  periode: z.enum(['jour', 'semaine', 'mois', 'semestre']),
  nombre: z.number().min(1).max(52),
  dateDebut: DateStringSchema,
  sessions: z.array(SessionDto).min(1, 'Au moins une session est requise'),
  generatedBy: z.enum(['AI', 'LOCAL']).optional()
});

export const UpdatePlanningDto = z.object({
  titre: z.string().min(1).optional(),
  periode: z.enum(['jour', 'semaine', 'mois', 'semestre']).optional(),
  sessions: z.array(SessionDto).optional()
});

export const AddSessionDto = z.object({
  matiere: z.string().min(1, 'La matière est requise'),
  debut: DateStringSchema,
  fin: DateStringSchema,
  type: z.string().optional(),
  method: z.string().optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  notes: z.string().optional()
});

export const UpdateSessionDto = z.object({
  matiere: z.string().optional(),
  debut: DateStringSchema.optional(),
  fin: DateStringSchema.optional(),
  type: z.string().optional(),
  method: z.string().optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  statut: z.enum(['planifie', 'en_cours', 'termine', 'rate']).optional(),
  notes: z.string().optional()
});

// Schémas pour le module Progress
export const RecordProgressDto = z.object({
  date: DateStringSchema,
  sessionsCompletees: z.number().min(0).default(0),
  tempsEtudie: z.number().min(0).default(0),
  notes: z.string().optional()
});

// DTOs de requête Subjects
export const CreateSubjectDto = z.object({
  name: SubjectNameSchema,
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Couleur hexadécimale invalide')
});

// DTOs de requête Themes
export const CreateThemeDto = z.object({
  key: z.string().min(1, 'La clé du thème est requise'),
  name: ThemeNameSchema,
  description: z.string().optional(),
  priceXP: z.number().min(0).default(0),
  config: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string().optional(),
    backgroundColor: z.string(),
    fontFamily: z.string()
  })
});

// Types inférés
export type RegisterUser = z.infer<typeof RegisterUserDto>;
export type LoginUser = z.infer<typeof LoginUserDto>;
export type UpdateProfile = z.infer<typeof UpdateProfileDto>;
export type CreatePlanning = z.infer<typeof CreatePlanningDto>;
export type UpdatePlanning = z.infer<typeof UpdatePlanningDto>;
export type AddSession = z.infer<typeof AddSessionDto>;
export type UpdateSession = z.infer<typeof UpdateSessionDto>;
export type RecordProgress = z.infer<typeof RecordProgressDto>;
export type CreateSubject = z.infer<typeof CreateSubjectDto>;
export type CreateTheme = z.infer<typeof CreateThemeDto>;