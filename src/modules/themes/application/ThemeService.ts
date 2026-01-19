import { Theme } from '../domain/Theme';
import { IThemeRepository } from '../domain/Repositories';
import { ObjectId } from '../../../shared/types';
import { Logger } from '../../../core/logging/Logger';
import { NotFoundError } from '../../../shared/errors/CustomErrors';

export class ThemeService implements IThemeRepository {
  constructor(
    private themeRepository: IThemeRepository
  ) {}

  async getThemes(): Promise<Theme[]> {
    Logger.business('theme', 'get_all');
    return this.themeRepository.findAll();
  }

  async getThemeByKey(key: string): Promise<Theme | null> {
    Logger.business('theme', 'get_by_key', { key });
    return this.themeRepository.findByKey(key);
  }

  async getThemeById(id: ObjectId): Promise<Theme> {
    const theme = await this.themeRepository.findById(id);
    if (!theme) {
      throw new NotFoundError('Thème');
    }
    return theme;
  }

  async createTheme(data: Omit<Theme, 'id' | 'createdAt'>): Promise<Theme> {
    Logger.business('theme', 'create', { key: data.key });

    const theme = new Theme(
      '' as ObjectId,
      data.key,
      data.name,
      data.config,
      {
        description: data.description,
        priceXP: data.priceXP,
        previewUrl: data.previewUrl
      }
    );

    const savedTheme = await this.themeRepository.create(theme);
    Logger.business('theme', 'created', { themeId: savedTheme.id });
    return savedTheme;
  }

  async updateTheme(id: ObjectId, updates: Partial<Omit<Theme, 'id' | 'createdAt'>>): Promise<Theme> {
    Logger.business('theme', 'update', { themeId: id });

    const theme = await this.getThemeById(id);
    // Logique de mise à jour simplifiée
    const updatedTheme = await this.themeRepository.update(theme);
    
    Logger.business('theme', 'updated', { themeId: id });
    return updatedTheme;
  }

  async deleteTheme(id: ObjectId): Promise<boolean> {
    Logger.business('theme', 'delete', { themeId: id });
    
    await this.getThemeById(id);
    const deleted = await this.themeRepository.delete(id);
    
    Logger.business('theme', 'deleted', { themeId: id });
    return deleted;
  }

  // Implémentation du repository
  async findById(id: ObjectId): Promise<Theme | null> {
    return this.themeRepository.findById(id);
  }

  async findByKey(key: string): Promise<Theme | null> {
    return this.themeRepository.findByKey(key);
  }

  async findAll(): Promise<Theme[]> {
    return this.themeRepository.findAll();
  }

  async create(theme: Theme): Promise<Theme> {
    return this.themeRepository.create(theme);
  }

  async update(theme: Theme): Promise<Theme> {
    return this.themeRepository.update(theme);
  }

  async delete(id: ObjectId): Promise<boolean> {
    return this.themeRepository.delete(id);
  }
}