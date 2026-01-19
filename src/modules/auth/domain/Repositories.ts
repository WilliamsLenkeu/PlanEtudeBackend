import { ObjectId } from '../../../shared/types';
import { User, RefreshToken } from './User';

// Interfaces des repositories
export interface IUserRepository {
  // CRUD operations
  findById(id: ObjectId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: ObjectId): Promise<boolean>;

  // Query operations
  findAll(options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<User[]>;

  count(): Promise<number>;

  // Specific business operations
  existsByEmail(email: string): Promise<boolean>;
  updateStudyStats(userId: ObjectId, stats: Partial<User['studyStats']>): Promise<User>;
  unlockTheme(userId: ObjectId, themeKey: string): Promise<User>;
  addSubject(userId: ObjectId, subject: string): Promise<User>;
  removeSubject(userId: ObjectId, subject: string): Promise<User>;
}

// Interface du repository RefreshToken
export interface IRefreshTokenRepository {
  create(token: RefreshToken): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  deleteByToken(token: string): Promise<boolean>;
  deleteByUserId(userId: ObjectId): Promise<boolean>;
  deleteExpired(): Promise<number>;
}

// Interface générique pour les repositories
export interface IRepository<T, TId = ObjectId> {
  findById(id: TId): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: TId): Promise<boolean>;
  findAll(options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<T[]>;
  count(): Promise<number>;
}