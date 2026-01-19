// Types globaux de l'application

// Types de base
export type ObjectId = string;

export type Email = string;

export type Gender = 'M' | 'F';

export type UserRole = 'user' | 'admin';

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    type: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Types pour les sessions d'étude
export type SessionStatus = 'planifie' | 'en_cours' | 'termine' | 'rate';

export type SessionPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface StudySession {
  id: ObjectId;
  subject: string;
  startTime: Date;
  endTime: Date;
  type?: string;
  method?: string;
  priority?: SessionPriority;
  status: SessionStatus;
  notes?: string;
}

// Types pour la gamification
export interface GamificationStats {
  xp: number;
  level: number;
  streak: number;
  totalStudyTime: number; // en minutes
}

export interface Badge {
  id: ObjectId;
  key: string;
  name: string;
  description: string;
  icon?: string;
  unlockedAt?: Date;
}

export interface Achievement {
  id: ObjectId;
  key: string;
  name: string;
  description: string;
  xpReward: number;
  unlockedAt?: Date;
}

// Types pour les exports
export type ExportFormat = 'pdf' | 'ical' | 'json';

// Types pour les notifications
export interface Notification {
  id: ObjectId;
  userId: ObjectId;
  type: 'reminder' | 'achievement' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Types pour la configuration
export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenExpiresIn: string;
  mongodbUri: string;
  mongodbDbName: string;
  googleClientId: string;
  geminiApiKey: string;
  mistralApiKey: string;
  corsOrigins: string[];
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

// Types pour les services externes
export interface GeminiMessage {
  role: 'user' | 'model';
  parts: string;
}

export interface GeminiResponse {
  response: string;
  usage?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

// Types pour les WebSocket
export interface SocketUser {
  id: string;
  socketId: string;
  connectedAt: Date;
}

export interface WebSocketEvent {
  type: string;
  payload: any;
  userId?: string;
  timestamp: Date;
}