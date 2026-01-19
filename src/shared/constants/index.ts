// Constantes de l'application

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const;

// Gamification
export const GAMIFICATION = {
  XP_PER_MINUTE: 10,
  BASE_LEVEL_XP: 100,
  STREAK_BONUS_THRESHOLD: 7,
  STREAK_WEEKLY_BONUS: 50,
  STREAK_MONTHLY_BONUS: 200,
  MAX_LEVEL: 100
} as const;

// Sécurité
export const SECURITY = {
  PASSWORD_SALT_ROUNDS: 12,
  JWT_EXPIRES_IN: '30d',
  REFRESH_TOKEN_EXPIRES_IN_DAYS: 30,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 50,
  MAX_NOTES_LENGTH: 500,
  MAX_SESSIONS_PER_PLANNING: 50,
  MAX_SUBJECTS_PER_USER: 20
} as const;

// Thèmes par défaut
export const DEFAULT_THEMES = [
  {
    key: 'classic-pink',
    name: 'Rose Classique',
    config: {
      primaryColor: '#FF6B9D',
      secondaryColor: '#FFB3C1',
      backgroundColor: '#FFF5F7',
      fontFamily: 'Quicksand, sans-serif'
    }
  },
  {
    key: 'ocean-blue',
    name: 'Océan Bleu',
    config: {
      primaryColor: '#4A90E2',
      secondaryColor: '#7BC9FF',
      backgroundColor: '#F0F8FF',
      fontFamily: 'Quicksand, sans-serif'
    }
  }
] as const;

// Types de session
export const SESSION_TYPES = [
  'Cours théorique',
  'Exercices pratiques',
  'Révision',
  'Examen blanc',
  'Lecture',
  'Vidéo',
  'Autre'
] as const;

// Méthodes d'étude
export const STUDY_METHODS = [
  'Méthode Pomodoro',
  'Méthode Feynman',
  'Carte mentale',
  'Répétition espacée',
  'Apprentissage actif',
  'Autre'
] as const;

// Périodes de planning
export const PLANNING_PERIODS = {
  JOUR: 'jour',
  SEMAINE: 'semaine',
  MOIS: 'mois',
  SEMESTRE: 'semestre'
} as const;

// Couleurs par défaut pour les matières
export const SUBJECT_COLORS = [
  '#FF6B9D', // Rose
  '#4A90E2', // Bleu
  '#50C878', // Vert
  '#FFD700', // Or
  '#FF6347', // Rouge
  '#9370DB', // Violet
  '#FFA500', // Orange
  '#20B2AA', // Cyan
  '#FF69B4', // Rose foncé
  '#32CD32'  // Vert lime
] as const;

// Messages d'erreur standardisés
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Accès non autorisé',
  FORBIDDEN: 'Action interdite',
  NOT_FOUND: 'Ressource non trouvée',
  VALIDATION_ERROR: 'Données invalides',
  INTERNAL_ERROR: 'Erreur interne du serveur',
  SERVICE_UNAVAILABLE: 'Service temporairement indisponible',
  RATE_LIMIT_EXCEEDED: 'Trop de requêtes, veuillez réessayer plus tard'
} as const;

// Messages de succès standardisés
export const SUCCESS_MESSAGES = {
  CREATED: 'Ressource créée avec succès',
  UPDATED: 'Ressource mise à jour avec succès',
  DELETED: 'Ressource supprimée avec succès',
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie'
} as const;

// Cache TTL (en secondes)
export const CACHE_TTL = {
  USER_PROFILE: 300, // 5 minutes
  THEMES_LIST: 3600, // 1 heure
  SUBJECTS_LIST: 1800, // 30 minutes
  STATS_SUMMARY: 600, // 10 minutes
  PLANNING_DATA: 300 // 5 minutes
} as const;

// Limites d'API
export const API_LIMITS = {
  MAX_PLANNING_SESSIONS: 50,
  MAX_PROGRESS_ENTRIES_PER_DAY: 10,
  MAX_REMINDERS_PER_USER: 20,
  MAX_BADGES_PER_USER: 100
} as const;