import { IUser } from '../models/User.model';
import { generateAIPanning } from './aiService';
import logger from '../utils/logger';

interface PlanningOptions {
  titre?: string;
  periode: 'jour' | 'semaine' | 'mois' | 'semestre';
  nombre: number;
  dateDebut: Date;
  matieres: string[];
  userMastery: Array<{ subjectName: string; score: number; lastStudied: Date }>;
}

export const generateHybridPlanning = async (options: PlanningOptions) => {
  const { titre, periode, nombre, dateDebut, matieres, userMastery } = options;

  try {
    // Tentative de génération via Mistral AI
    const aiResponse = await generateAIPanning({
      titre: titre || 'Générer un titre',
      periode,
      nombre,
      dateDebut: dateDebut.toISOString(),
      matieres,
      userMastery
    });

    if (aiResponse && aiResponse.sessions) {
      return {
        titre: titre || aiResponse.titre || 'Mon Planning',
        sessions: aiResponse.sessions,
        generatedBy: 'AI' as const
      };
    }
  } catch (error) {
    logger.warn('Échec de la génération IA, repli sur l\'algorithme local', error);
  }

  // Fallback : Algorithme local intelligent
  const sessions = [];
  
  // Utiliser les matières de l'utilisateur ou des matières par défaut si vide
  const subjectsToUse = matieres.length > 0 ? matieres : ['Révisions Générales', 'Auto-Formation'];
  
  let daysToPlan = 1;
  if (periode === 'jour') daysToPlan = 1 * nombre;
  else if (periode === 'semaine') daysToPlan = 7 * nombre;
  else if (periode === 'mois') daysToPlan = 30 * nombre;
  else if (periode === 'semestre') daysToPlan = 180 * nombre;

  const START_HOUR = 9;
  const SESSION_DURATION = 90; // 1h30 par session
  const SESSION_GAP = 15; // 15 min de pause
  const LUNCH_HOUR = 12;
  const LUNCH_DURATION = 60;

  for (let d = 0; d < daysToPlan; d++) {
    const currentDay = new Date(dateDebut);
    currentDay.setDate(dateDebut.getDate() + d);
    
    // Ignorer les week-ends si c'est un planning long ? (Optionnel, ici on planifie tout)
    
    let currentTime = new Date(currentDay);
    currentTime.setHours(START_HOUR, 0, 0, 0);

    // 4 sessions par jour
    for (let s = 0; s < 4; s++) {
      // Sélection intelligente de la matière (rotation)
      const matiere = subjectsToUse[ (d + s) % subjectsToUse.length ];
      
      // Pause déjeuner
      if (currentTime.getHours() >= LUNCH_HOUR && currentTime.getHours() < LUNCH_HOUR + 1) {
        sessions.push({
          matiere: 'PAUSE DÉJEUNER',
          debut: new Date(currentTime),
          fin: new Date(currentTime.getTime() + LUNCH_DURATION * 60000),
          type: 'PAUSE',
          method: 'CLASSIC',
          priority: 'LOW',
          statut: 'planifie',
          notes: 'Bon appétit ! 🍎'
        });
        currentTime = new Date(currentTime.getTime() + LUNCH_DURATION * 60000);
      }

      const debut = new Date(currentTime);
      const fin = new Date(debut.getTime() + SESSION_DURATION * 60000);

      // Déterminer le type et la méthode intelligemment
      const mastery = userMastery.find(m => m.subjectName === matiere);
      let type: 'LEARNING' | 'REVIEW' | 'PRACTICE' = 'LEARNING';
      let method: 'DEEP_WORK' | 'POMODORO' = 'DEEP_WORK';
      
      if (mastery && mastery.score > 70) {
        type = 'REVIEW';
        method = 'POMODORO';
      } else if (mastery && mastery.score > 40) {
        type = 'PRACTICE';
        method = 'POMODORO';
      }

      sessions.push({
        matiere,
        debut,
        fin,
        type,
        method,
        priority: mastery && mastery.score < 30 ? 'HIGH' : 'MEDIUM',
        statut: 'planifie',
        notes: `Focus sur : ${matiere}. Méthode conseillée : ${method}.`
      });

      currentTime = new Date(fin.getTime() + SESSION_GAP * 60000);
    }

    // Fin de journée : Buffer/Temps libre
    sessions.push({
      matiere: 'BILAN & REPOS',
      debut: new Date(currentTime),
      fin: new Date(currentTime.getTime() + 30 * 60000),
      type: 'BUFFER',
      method: 'CLASSIC',
      priority: 'LOW',
      statut: 'planifie',
      notes: 'Analyse de la journée et préparation du lendemain.'
    });
  }

  return {
    titre: titre || 'Mon Planning',
    sessions,
    generatedBy: 'LOCAL' as const
  };
};
