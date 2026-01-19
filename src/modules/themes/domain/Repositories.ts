import { ObjectId } from '../../../shared/types';
import { Theme } from './Theme';

export interface IThemeRepository {
  findById(id: ObjectId): Promise<Theme | null>;
  findByKey(key: string): Promise<Theme | null>;
  findAll(): Promise<Theme[]>;
  create(theme: Theme): Promise<Theme>;
  update(theme: Theme): Promise<Theme>;
  delete(id: ObjectId): Promise<boolean>;
}

export interface IThemeService {
  getThemes(): Promise<Theme[]>;
  getThemeByKey(key: string): Promise<Theme | null>;
  getThemeById(id: ObjectId): Promise<Theme>;
  createTheme(data: Omit<Theme, 'id' | 'createdAt'>): Promise<Theme>;
  updateTheme(id: ObjectId, updates: Partial<Omit<Theme, 'id' | 'createdAt'>>): Promise<Theme>;
  deleteTheme(id: ObjectId): Promise<boolean>;
}