import User from '../models/User.model';
import Badge from '../models/Badge.model';

// Liste des quêtes quotidiennes possibles
const POSSIBLE_QUESTS = [
  { key: 'study_30_min', title: 'Concentration Intense 🧠', description: 'Étudie pendant au moins 30 minutes au total aujourd\'hui.', xpReward: 50, target: 30, iconKey: 'Timer' },
  { key: 'complete_2_sessions', title: 'Régularité 🎀', description: 'Termine au moins 2 sessions d\'étude aujourd\'hui.', xpReward: 40, target: 2, iconKey: 'CheckCircle' },
  { key: 'night_owl', title: 'Chouette de Nuit 🦉', description: 'Fais une session d\'étude après 21h.', xpReward: 30, target: 1, iconKey: 'Moon' },
  { key: 'early_bird', title: 'Lève-tôt 🌅', description: 'Fais une session d\'étude avant 9h du matin.', xpReward: 30, target: 1, iconKey: 'Sun' },
  { key: 'perfectionist', title: 'Perfectionniste ✨', description: 'Complète une session sans aucune pause.', xpReward: 60, target: 1, iconKey: 'Star' },
  { key: 'bookworm', title: 'Dévoreuse de Livres 📖', description: 'Étudie pendant 60 minutes au total aujourd\'hui.', xpReward: 100, target: 60, iconKey: 'BookOpen' }
];

export const addExperience = async (userId: string, xpAmount: number, studyMinutes: number = 0, subjectName?: string) => {
  const user = await User.findById(userId);
  if (!user) return null;

  // Initialiser si gamification n'existe pas
  if (!user.gamification) {
    user.gamification = {
      totalXP: 0,
      xp: 0,
      level: 1,
      streak: 0,
      totalStudyTime: 0,
      dailyQuests: [],
      lastQuestReset: new Date(),
      notifications: [],
      companion: {
        name: "Yumi",
        type: "Chat",
        level: 1,
        evolutionStage: 1,
        happiness: 100
      },
      subjectMastery: []
    };
  }

  // S'assurer que les nouveaux champs existent pour les anciens utilisateurs
  if (!user.gamification.companion) {
    user.gamification.companion = {
      name: "Yumi",
      type: "Chat",
      level: 1,
      evolutionStage: 1,
      happiness: 100
    };
  }
  if (!user.gamification.subjectMastery) {
    user.gamification.subjectMastery = [];
  }

  // INNOVATION : Multiplicateur de Streak (Plus tu es régulière, plus tu gagnes d'XP)
  let streakMultiplier = 1;
  if (user.gamification.streak >= 30) streakMultiplier = 1.5;
  else if (user.gamification.streak >= 15) streakMultiplier = 1.3;
  else if (user.gamification.streak >= 7) streakMultiplier = 1.1;

  const finalXpAmount = Math.floor(xpAmount * streakMultiplier);

  if (streakMultiplier > 1 && studyMinutes > 0) {
    user.gamification.notifications.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'quest',
      message: `Bonus de Streak x${streakMultiplier} activé ! ⚡`,
      read: false,
      createdAt: new Date()
    });
  }

  // Logique de Maîtrise par Matière (Innovation sans IA)
  if (subjectName) {
    const masteryIndex = user.gamification.subjectMastery.findIndex((m: any) => m.subjectName === subjectName);
    const gain = Math.min(5, studyMinutes / 10); // Gain max de 5 points de maîtrise par session

    if (masteryIndex > -1) {
      user.gamification.subjectMastery[masteryIndex].score = Math.min(100, user.gamification.subjectMastery[masteryIndex].score + gain);
      user.gamification.subjectMastery[masteryIndex].lastStudied = new Date();
      
      // INNOVATION : Débloquer un thème spécial si on atteint 50% de maîtrise dans une matière
      if (user.gamification.subjectMastery[masteryIndex].score >= 50) {
        const themeKey = `mastery_${subjectName.toLowerCase().replace(/\s+/g, '_')}`;
        if (!user.preferences.unlockedThemes.includes(themeKey)) {
          user.preferences.unlockedThemes.push(themeKey);
          user.gamification.notifications.push({
            id: Math.random().toString(36).substr(2, 9),
            type: 'badge',
            message: `Incroyable ! Ta maîtrise des ${subjectName} a débloqué le thème exclusif : ${subjectName} Master 🎨`,
            read: false,
            createdAt: new Date()
          });
        }
      }
    } else {
      user.gamification.subjectMastery.push({
        subjectName,
        score: gain,
        lastStudied: new Date()
      });
    }
  }

  // Faire baisser légèrement la maîtrise des autres matières (Courbe de l'oubli)
  user.gamification.subjectMastery.forEach((m: any) => {
    if (m.subjectName !== subjectName) {
      m.score = Math.max(0, m.score - 0.1); // Perte légère de 0.1 point par session d'une autre matière
    }
  });

  // Logique du Compagnon : Il gagne en bonheur quand on étudie
  user.gamification.companion.happiness = Math.min(100, user.gamification.companion.happiness + Math.floor(studyMinutes / 5));
  user.gamification.companion.level = user.gamification.level;
  
  // Évolution du compagnon tous les 15 niveaux
  const oldStage = user.gamification.companion.evolutionStage;
  if (user.gamification.level >= 30) user.gamification.companion.evolutionStage = 3;
  else if (user.gamification.level >= 15) user.gamification.companion.evolutionStage = 2;
  else user.gamification.companion.evolutionStage = 1;

  if (user.gamification.companion.evolutionStage > oldStage) {
    user.gamification.notifications.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'level',
      message: `Ton compagnon ${user.gamification.companion.name} a évolué ! 🌟✨`,
      read: false,
      createdAt: new Date()
    });
  }

  // Vérifier et réinitialiser les quêtes quotidiennes si nécessaire
  await checkAndResetQuests(user);

  user.gamification.xp += finalXpAmount;
  user.gamification.totalXP = (user.gamification.totalXP || 0) + finalXpAmount;
  user.gamification.totalStudyTime += studyMinutes;

  // Mise à jour des quêtes en cours
  await updateQuestProgress(user, studyMinutes);

  // Calcul du niveau (ex: 100 XP par niveau)
  const nextLevelThreshold = user.gamification.level * 100;
  if (user.gamification.xp >= nextLevelThreshold) {
    user.gamification.level += 1;
    // Notification de niveau
    user.gamification.notifications.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'level',
      message: `Félicitations ! Tu as atteint le niveau ${user.gamification.level} ! ✨`,
      read: false,
      createdAt: new Date()
    });
  }

  // Gestion du streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (user.gamification.lastStudyDate) {
    const lastDate = new Date(user.gamification.lastStudyDate);
    lastDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      user.gamification.streak += 1;
    } else if (diffDays > 1) {
      user.gamification.streak = 1;
    }
  } else {
    user.gamification.streak = 1;
  }

  user.gamification.lastStudyDate = today;
  
  // Vérification automatique des badges
  await checkAutoBadges(user);
  
  await user.save();
  return user.gamification;
};

// Réinitialise les quêtes si on a changé de jour
const checkAndResetQuests = async (user: any) => {
  const now = new Date();
  const lastReset = new Date(user.gamification.lastQuestReset || 0);
  
  if (now.toDateString() !== lastReset.toDateString()) {
    // LOGIQUE IA : On pourrait analyser les habitudes de l'utilisateur ici
    // Pour l'instant, on améliore la sélection aléatoire pondérée
    
    let questPool = [...POSSIBLE_QUESTS];
    
    // Si l'utilisateur étudie souvent tard, on lui donne plus de chances d'avoir 'night_owl'
    // Si l'utilisateur a un gros streak, on lui donne des quêtes plus dures comme 'bookworm'
    if (user.gamification.streak > 5) {
      questPool.push(...POSSIBLE_QUESTS.filter(q => q.key === 'bookworm' || q.key === 'perfectionist'));
    }

    const shuffled = questPool.sort(() => 0.5 - Math.random());
    const selectedQuests = [];
    const usedKeys = new Set();

    for (const q of shuffled) {
      if (selectedQuests.length >= 3) break;
      if (!usedKeys.has(q.key)) {
        selectedQuests.push({
          ...q,
          current: 0,
          isCompleted: false
        });
        usedKeys.add(q.key);
      }
    }

    user.gamification.dailyQuests = selectedQuests;
    user.gamification.lastQuestReset = now;
  }
};

// Met à jour la progression des quêtes
const updateQuestProgress = async (user: any, studyMinutes: number) => {
  const now = new Date();
  const hour = now.getHours();

  user.gamification.dailyQuests.forEach((quest: any) => {
    if (quest.isCompleted) return;

    if (quest.key === 'study_30_min' || quest.key === 'bookworm') {
      quest.current += studyMinutes;
    } else if (quest.key === 'complete_2_sessions') {
      quest.current += 1;
    } else if (quest.key === 'night_owl' && hour >= 21) {
      quest.current = 1;
    } else if (quest.key === 'early_bird' && hour <= 9) {
      quest.current = 1;
    } else if (quest.key === 'perfectionist' && studyMinutes >= 25) { // Supposons qu'une session complète sans pause fait 25min+
      quest.current = 1;
    }

    if (quest.current >= quest.target) {
      quest.isCompleted = true;
      user.gamification.xp += quest.xpReward;
      user.gamification.totalXP += quest.xpReward;
      // Notification de quête
      user.gamification.notifications.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'quest',
        message: `Quête terminée : ${quest.title} (+${quest.xpReward} XP) 🎁`,
        read: false,
        createdAt: new Date()
      });
    }
  });
};

// Système de détection automatique des badges
const checkAutoBadges = async (user: any) => {
  const badgesToAdd = [];
  const existingBadges = await Badge.find({ userId: user._id });
  const badgeKeys = existingBadges.map(b => b.key);

  const BADGE_DEFINITIONS = [
    { key: 'first_step', name: 'Premiers Pas ✨', description: 'Bravo ! Tu as terminé ta toute première session d\'étude.', iconKey: 'Footprints' },
    { key: 'marathon', name: 'Marathonienne 🏃‍♀️', description: 'Tu as étudié plus de 5 heures au total !', iconKey: 'Timer' },
    { key: 'streak_7', name: 'Fidélité Rose 🌸', description: 'Une semaine complète d\'étude sans s\'arrêter !', iconKey: 'Flame' },
    { key: 'study_king', name: 'Reine du Travail 👑', description: 'Tu as atteint 20 heures d\'étude total !', iconKey: 'Crown' },
    { key: 'level_10', name: 'Apprentie Élite 🎀', description: 'Tu as atteint le niveau 10 !', iconKey: 'Zap' },
    { key: 'night_lover', name: 'Amoureuse de la Nuit 🌙', description: 'Tu as fait 5 sessions nocturnes.', iconKey: 'MoonStar' },
    { key: 'subject_master', name: 'Maîtresse de Discipline 📚', description: 'Tu as étudié une même matière pendant plus de 10 heures.', iconKey: 'Library' }
  ];

  for (const def of BADGE_DEFINITIONS) {
    if (badgeKeys.includes(def.key)) continue;

    let shouldAdd = false;
    if (def.key === 'first_step') shouldAdd = true; // Déjà appelé lors d'une session terminée
    if (def.key === 'marathon' && user.gamification.totalStudyTime >= 300) shouldAdd = true;
    if (def.key === 'streak_7' && user.gamification.streak >= 7) shouldAdd = true;
    if (def.key === 'study_king' && user.gamification.totalStudyTime >= 1200) shouldAdd = true;
    if (def.key === 'level_10' && user.gamification.level >= 10) shouldAdd = true;
    // ... autres logiques pour les nouveaux badges
    
    if (shouldAdd) {
      badgesToAdd.push(def);
      // Notification de badge
      user.gamification.notifications.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'badge',
        message: `Nouveau badge débloqué : ${def.name} 🏆`,
        read: false,
        createdAt: new Date()
      });
    }
  }

  if (badgesToAdd.length > 0) {
    for (const b of badgesToAdd) {
      await Badge.create({ userId: user._id, ...b });
    }
  }
};

// Helper pour déterminer le rang selon le niveau
export const getRank = (level: number): string => {
  if (level >= 50) return "Déesse de la Sagesse 👑✨";
  if (level >= 40) return "Maîtresse des Études 👑🎀";
  if (level >= 30) return "Érudite Éclairée 📖🌸";
  if (level >= 20) return "Sage en Devenir 🧘‍♀️✨";
  if (level >= 10) return "Apprentie Passionnée 🎀";
  return "Nouvelle Étoile 🌟";
};
