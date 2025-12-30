import User from '../models/User.model';

export const addExperience = async (userId: string, xpAmount: number, studyMinutes: number = 0) => {
  const user = await User.findById(userId);
  if (!user) return null;

  // Initialiser si gamification n'existe pas
  if (!user.gamification) {
    user.gamification = {
      totalXP: 0,
      xp: 0,
      level: 1,
      streak: 0,
      totalStudyTime: 0
    };
  }

  user.gamification.xp += xpAmount;
  user.gamification.totalXP = (user.gamification.totalXP || 0) + xpAmount;
  user.gamification.totalStudyTime += studyMinutes;

  // Calcul du niveau (ex: 100 XP par niveau)
  const nextLevelThreshold = user.gamification.level * 100;
  if (user.gamification.xp >= nextLevelThreshold) {
    user.gamification.level += 1;
    // On pourrait ajouter une notification ou un badge ici
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
  
  await user.save();
  return user.gamification;
};
