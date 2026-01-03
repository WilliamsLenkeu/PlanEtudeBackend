import { IUser } from '../models/User.model';

interface PlanningOptions {
  periode: 'jour' | 'semaine';
  dateDebut: Date;
  matieres: string[];
  userMastery: Array<{ subjectName: string; score: number; lastStudied: Date }>;
}

export const generateHybridPlanning = (options: PlanningOptions) => {
  const { periode, dateDebut, matieres, userMastery } = options;
  const sessions = [];
  const daysToPlan = periode === 'jour' ? 1 : 7;

  // Configuration de base
  const START_HOUR = 9; // Début à 9h
  const SESSION_GAP = 15; // 15 min entre sessions
  const LONG_BREAK_DURATION = 60; // 1h de pause déjeuner
  const BUFFER_TIME = 30; // 30 min de buffer fin de journée

  for (let d = 0; d < daysToPlan; d++) {
    const currentDay = new Date(dateDebut);
    currentDay.setDate(dateDebut.getDate() + d);
    currentDay.setHours(START_HOUR, 0, 0, 0);

    let currentTime = new Date(currentDay);
    
    // Sélectionner les matières pour la journée (max 3 ou 4 pour éviter la surcharge)
    const dailySubjects = matieres
      .sort((a, b) => {
        const masteryA = userMastery.find(m => m.subjectName === a)?.score || 0;
        const masteryB = userMastery.find(m => m.subjectName === b)?.score || 0;
        return masteryA - masteryB; // Priorité aux matières les moins maîtrisées
      })
      .slice(0, 4);

    dailySubjects.forEach((matiere, index) => {
      // 1. Déterminer le type de session (Hybride Spaced Repetition)
      const mastery = userMastery.find(m => m.subjectName === matiere);
      let type: 'LEARNING' | 'REVIEW' | 'PRACTICE' | 'MOCK_EXAM' | 'BUFFER' | 'PAUSE' = 'LEARNING';
      
      if (mastery && mastery.score > 70) type = 'REVIEW';
      else if (mastery && mastery.score > 40) type = 'PRACTICE';

      // 2. Déterminer la durée et la méthode (Hybride Pomodoro/Deep Work)
      let duration = 60; // par défaut 1h
      let method: 'POMODORO' | 'DEEP_WORK' | 'CLASSIC' = 'POMODORO';

      if (type === 'LEARNING') {
        duration = 90;
        method = 'DEEP_WORK';
      } else if (type === 'REVIEW') {
        duration = 45;
        method = 'POMODORO';
      } else if (type === 'PRACTICE') {
        duration = 60;
        method = 'POMODORO';
      }

      // Création de la session
      const debut = new Date(currentTime);
      const fin = new Date(debut.getTime() + duration * 60000);

      sessions.push({
        matiere,
        debut,
        fin,
        type,
        method,
        priority: mastery && mastery.score < 30 ? 'HIGH' : 'MEDIUM',
        statut: 'planifie',
        totalPomodoros: method === 'POMODORO' ? Math.floor(duration / 30) : 0,
        notes: `Focus sur : ${type === 'LEARNING' ? 'Nouveaux concepts' : 'Renforcement'}`
      });

      // Avancer le temps
      currentTime = new Date(fin.getTime() + SESSION_GAP * 60000);

      // Pause déjeuner après la 2ème session
      if (index === 1) {
        const pauseDebut = new Date(currentTime);
        const pauseFin = new Date(pauseDebut.getTime() + LONG_BREAK_DURATION * 60000);
        
        sessions.push({
          matiere: 'PAUSE DÉJEUNER',
          debut: pauseDebut,
          fin: pauseFin,
          type: 'PAUSE',
          method: 'CLASSIC',
          priority: 'LOW',
          statut: 'termine'
        });

        currentTime = new Date(pauseFin.getTime());
      }
    });

    // 3. Ajouter un BUFFER en fin de journée
    const bufferDebut = new Date(currentTime);
    const bufferFin = new Date(bufferDebut.getTime() + BUFFER_TIME * 60000);
    
    sessions.push({
      matiere: 'TEMPS FLEXIBLE',
      debut: bufferDebut,
      fin: bufferFin,
      type: 'BUFFER',
      method: 'CLASSIC',
      priority: 'LOW',
      statut: 'planifie',
      notes: 'Pour rattraper les retards ou approfondir un sujet.'
    });
  }

  return sessions;
};
