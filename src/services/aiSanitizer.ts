import crypto from 'crypto';

export function anonymizeString(s: string | undefined) {
  if (!s) return '';
  return crypto.createHash('sha256').update(s).digest('hex').slice(0, 12);
}

export function buildSanitizedContext(user: any, planning: any, message: string, history: any[] = []) {
  // Ne transmettre que des résumés et des identifiants non réversibles
  const userSummary = user
    ? {
        id: anonymizeString(user._id?.toString() || user.id || user.email),
        name: user.name ? `${user.name[0]}.` : 'Utilisateur',
        preferences: user.preferences || {},
      }
    : { id: 'anon', name: 'Utilisateur', preferences: {} };

  const planningSummary = planning
    ? {
        periode: planning.periode,
        sessionsCount: Array.isArray(planning.sessions) ? planning.sessions.length : 0,
      }
    : null;

  // Sanitize history: keep only role and short preview
  const sanitizedHistory = history.map((h: any) => ({
    role: h.role,
    snippet: (h.content || '').slice(0, 200),
  }));

  const promptContext = `Contexte utilisateur (anonymisé): ${JSON.stringify(userSummary)}. Planning résumé: ${planningSummary ? JSON.stringify(planningSummary) : 'pas de planning'}.`;

  const sanitizedMessage = message;

  return { promptContext, sanitizedMessage, sanitizedHistory };
}

export default { anonymizeString, buildSanitizedContext };
