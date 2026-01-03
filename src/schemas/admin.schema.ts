import { z } from 'zod';

export const adminClearSchema = z.object({
  body: z.object({
    type: z.enum(['users', 'plannings', 'subjects', 'all'], {
      errorMap: () => ({ message: "Type de nettoyage invalide. Doit être 'users', 'plannings', 'subjects' ou 'all'." })
    }),
  }),
});

export const adminSeedSchema = z.object({
  query: z.object({
    themes: z.enum(['true', 'false']).optional(),
    subjects: z.enum(['true', 'false']).optional(),
    lofi: z.enum(['true', 'false']).optional(),
  }),
});
