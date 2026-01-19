import { ObjectId } from '../../../shared/types';
import { User } from '../domain/User';

// Interfaces des services métier
export interface IAuthService {
  register(data: {
    name: string;
    email: string;
    password: string;
    gender: 'M' | 'F';
  }): Promise<{ user: User; token: string; refreshToken: string }>;

  login(email: string, password: string): Promise<{ user: User; token: string; refreshToken: string }>;

  googleLogin(googleToken: string): Promise<{ user: User; token: string; refreshToken: string }>;

  refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }>;

  logout(token: string): Promise<void>;
}

export interface IUserService {
  getProfile(userId: ObjectId): Promise<User>;

  updateProfile(userId: ObjectId, updates: {
    name?: string;
    preferences?: Partial<User['preferences']>;
  }): Promise<User>;

  getUsers(options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ users: User[]; total: number }>;

  getUserStats(userId: ObjectId): Promise<User['studyStats']>;

  unlockTheme(userId: ObjectId, themeKey: string): Promise<User>;

  addSubject(userId: ObjectId, subject: string): Promise<User>;

  removeSubject(userId: ObjectId, subject: string): Promise<User>;
}

// Interfaces des services utilitaires
export interface IPasswordService {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export interface IJwtService {
  generate(payload: any): string;
  verify(token: string): any;
}

export interface IGoogleAuthService {
  verifyToken(token: string): Promise<{
    email: string;
    name: string;
    googleId: string;
    avatar?: string;
  }>;
}