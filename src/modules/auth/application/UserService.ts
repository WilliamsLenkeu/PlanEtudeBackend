import { User } from '../domain/User';
import { IUserRepository } from '../domain/Repositories';
import { IUserService } from './Services';
import { ObjectId } from '../../../shared/types';
import { Logger } from '../../../core/logging/Logger';
import { NotFoundError } from '../../../shared/errors/CustomErrors';

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getProfile(userId: ObjectId): Promise<User> {
    Logger.business('user', 'get_profile', { userId });

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Utilisateur');
    }

    return user;
  }

  async updateProfile(userId: ObjectId, updates: {
    name?: string;
    preferences?: Partial<User['preferences']>;
  }): Promise<User> {
    Logger.business('user', 'update_profile', { userId, updates });

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Utilisateur');
    }

    // Appliquer les mises à jour
    user.updateProfile(updates);

    // Sauvegarder
    const updatedUser = await this.userRepository.update(user);

    Logger.business('user', 'profile_updated', { userId });
    return updatedUser;
  }

  async getUsers(options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ users: User[]; total: number }> {
    Logger.business('user', 'get_users', { options });

    const [users, total] = await Promise.all([
      this.userRepository.findAll(options),
      this.userRepository.count()
    ]);

    return { users, total };
  }

  async getUserStats(userId: ObjectId): Promise<User['studyStats']> {
    Logger.business('user', 'get_stats', { userId });

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Utilisateur');
    }

    return user.studyStats;
  }

  async unlockTheme(userId: ObjectId, themeKey: string): Promise<User> {
    Logger.business('user', 'unlock_theme', { userId, themeKey });

    const user = await this.userRepository.unlockTheme(userId, themeKey);

    Logger.business('user', 'theme_unlocked', { userId, themeKey });
    return user;
  }

  async addSubject(userId: ObjectId, subject: string): Promise<User> {
    Logger.business('user', 'add_subject', { userId, subject });

    const user = await this.userRepository.addSubject(userId, subject);

    Logger.business('user', 'subject_added', { userId, subject });
    return user;
  }

  async removeSubject(userId: ObjectId, subject: string): Promise<User> {
    Logger.business('user', 'remove_subject', { userId, subject });

    const user = await this.userRepository.removeSubject(userId, subject);

    Logger.business('user', 'subject_removed', { userId, subject });
    return user;
  }
}