import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../../core/config/appConfig';

// Utilitaires de sécurité
export class SecurityUtils {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  static generateJwt(payload: any): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    } as jwt.SignOptions);
  }

  static verifyJwt(token: string): any {
    return jwt.verify(token, config.jwtSecret);
  }
}

// Utilitaires de dates
export class DateUtils {
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  static isValidDate(date: any): date is Date {
    return date instanceof Date && !isNaN(date.getTime());
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static getStartOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  static getEndOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  static getWeekRange(date: Date): { start: Date; end: Date } {
    const start = new Date(date);
    const end = new Date(date);

    // Début de semaine (lundi)
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    // Fin de semaine (dimanche)
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }
}

// Utilitaires de calcul pour la gamification
export class GamificationUtils {
  static calculateLevel(xp: number): number {
    // Niveau basé sur une progression quadratique
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  static calculateXpForLevel(level: number): number {
    return level * level * 100;
  }

  static calculateXpToNextLevel(currentXp: number): number {
    const currentLevel = this.calculateLevel(currentXp);
    const nextLevelXp = this.calculateXpForLevel(currentLevel + 1);
    return nextLevelXp - currentXp;
  }

  static calculateSessionXp(durationMinutes: number, subjectMastery: number = 0): number {
    // XP = durée * (1 + maîtrise/100) * multiplicateur de base
    const baseXp = durationMinutes * 10; // 10 XP par minute
    const masteryBonus = subjectMastery / 100;
    return Math.round(baseXp * (1 + masteryBonus));
  }

  static calculateStreakBonus(streakDays: number): number {
    if (streakDays < 7) return 0;
    if (streakDays < 30) return Math.floor(streakDays / 7) * 50;
    return Math.floor(streakDays / 30) * 200;
  }
}

// Utilitaires pour les collections
export class CollectionUtils {
  static chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  static groupBy<T, K extends keyof any>(array: T[], key: (item: T) => K): Map<K, T[]> {
    const map = new Map<K, T[]>();
    array.forEach(item => {
      const groupKey = key(item);
      if (!map.has(groupKey)) {
        map.set(groupKey, []);
      }
      map.get(groupKey)!.push(item);
    });
    return map;
  }

  static unique<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  static shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Utilitaires de validation
export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  static sanitizeString(str: string): string {
    return str.trim().replace(/[<>]/g, '');
  }

  static isStrongPassword(password: string): boolean {
    // Au moins 8 caractères, une majuscule, une minuscule, un chiffre
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }
}

// Utilitaires de formatage
export class FormatUtils {
  static formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins}min`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h${mins}min`;
    }
  }

  static formatDateRelative(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Aujourd\'hui';
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  }

  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  static truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
  }
}