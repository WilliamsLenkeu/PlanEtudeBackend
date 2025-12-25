/**
 * Service de planification (Fallback)
 * Utilisé quand l'IA n'est pas disponible ou pour des suggestions basiques.
 */

export const generateFallbackPlanning = (matieres: string[], periode: 'jour' | 'semaine') => {
  const sessions = [];
  const now = new Date();
  
  if (periode === 'jour') {
    // 3 sessions de 2h par jour par défaut
    for (let i = 0; i < Math.min(matieres.length, 3); i++) {
      const debut = new Date(now);
      debut.setHours(9 + i * 3, 0, 0, 0);
      const fin = new Date(debut);
      fin.setHours(debut.getHours() + 2);
      
      sessions.push({
        matiere: matieres[i],
        debut,
        fin,
        statut: 'planifie'
      });
    }
  } else if (periode === 'semaine') {
    // 1 session par matière par jour sur la semaine
    for (let d = 0; d < 7; d++) {
      const day = new Date(now);
      day.setDate(now.getDate() + d);
      
      const matiere = matieres[d % matieres.length];
      const debut = new Date(day);
      debut.setHours(14, 0, 0, 0);
      const fin = new Date(debut);
      fin.setHours(17, 0, 0, 0);
      
      sessions.push({
        matiere,
        debut,
        fin,
        statut: 'planifie'
      });
    }
  }
  
  return sessions;
};