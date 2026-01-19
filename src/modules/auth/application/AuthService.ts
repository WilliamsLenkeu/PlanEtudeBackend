import { OAuth2Client } from 'google-auth-library';
import { User, RefreshToken } from '../domain/User';
import { IUserRepository, IRefreshTokenRepository } from '../domain/Repositories';
import { IAuthService, IPasswordService, IJwtService, IGoogleAuthService } from './Services';
import { ObjectId } from '../../../shared/types';
import { DateUtils, SecurityUtils } from '../../../shared/utils';
import { config } from '../../../core/config/appConfig';
import { Logger } from '../../../core/logging/Logger';
import { eventBus, EventTypes, createEvent } from '../../../core/events/EventBus';
import { AppError, ValidationError, AuthenticationError } from '../../../shared/errors/CustomErrors';

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private passwordService: IPasswordService,
    private jwtService: IJwtService,
    private googleAuthService: IGoogleAuthService
  ) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
    gender: 'M' | 'F';
  }): Promise<{ user: User; token: string; refreshToken: string }> {
    Logger.business('auth', 'register', { email: data.email });

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError('Un utilisateur avec cet email existe déjà');
    }

    // Créer l'utilisateur
    const user = new User(
      '' as ObjectId, // Sera généré par MongoDB
      data.email,
      data.name,
      data.gender
    );

    // Hasher le mot de passe
    const hashedPassword = await this.passwordService.hash(data.password);
    user.setPasswordHash(hashedPassword);

    // Sauvegarder l'utilisateur
    const savedUser = await this.userRepository.create(user);

    // Générer les tokens
    const token = this.jwtService.generate({ id: savedUser.id });
    const refreshToken = await this.createRefreshToken(savedUser.id);

    // Émettre l'événement
    eventBus.emitUserRegistered(createEvent({
      userId: savedUser.id,
      email: savedUser.email,
      name: savedUser.name
    }));

    Logger.auth(savedUser.id, 'registered');
    return { user: savedUser, token, refreshToken };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string; refreshToken: string }> {
    Logger.business('auth', 'login', { email });

    // Trouver l'utilisateur
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    if (!user.passwordHash) {
      throw new AuthenticationError('Ce compte utilise l\'authentification Google');
    }

    const isPasswordValid = await this.passwordService.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Email ou mot de passe incorrect');
    }

    // Générer les tokens
    const token = this.jwtService.generate({ id: user.id });
    const refreshToken = await this.createRefreshToken(user.id);

    // Émettre l'événement
    eventBus.emitUserLoggedIn(createEvent({
      userId: user.id
    }));

    Logger.auth(user.id, 'logged_in');
    return { user, token, refreshToken };
  }

  async googleLogin(googleToken: string): Promise<{ user: User; token: string; refreshToken: string }> {
    Logger.business('auth', 'google_login');

    // Vérifier le token Google
    const googleUser = await this.googleAuthService.verifyToken(googleToken);

    // Chercher l'utilisateur existant
    let user = await this.userRepository.findByEmail(googleUser.email);

    if (user) {
      // Mettre à jour les informations Google si nécessaire
      if (!user.googleId) {
        user.setGoogleId(googleUser.googleId);
        if (googleUser.avatar && !user.avatar) {
          user.setAvatar(googleUser.avatar);
        }
        user.verify(); // Marquer comme vérifié
        user = await this.userRepository.update(user);
      }
    } else {
      // Créer un nouvel utilisateur
      user = new User(
        '' as ObjectId,
        googleUser.email,
        googleUser.name,
        'M', // Genre par défaut, peut être changé plus tard
        undefined,
        undefined,
        {
          googleId: googleUser.googleId,
          avatar: googleUser.avatar,
          isVerified: true
        }
      );

      user = await this.userRepository.create(user);

      // Émettre l'événement d'inscription
      eventBus.emitUserRegistered(createEvent({
        userId: user.id,
        email: user.email,
        name: user.name
      }));
    }

    // Générer les tokens
    const token = this.jwtService.generate({ id: user.id });
    const refreshToken = await this.createRefreshToken(user.id);

    // Émettre l'événement de connexion
    eventBus.emitUserLoggedIn(createEvent({
      userId: user.id
    }));

    Logger.auth(user.id, 'logged_in_google');
    return { user, token, refreshToken };
  }

  async refreshToken(refreshTokenString: string): Promise<{ token: string; refreshToken: string }> {
    Logger.business('auth', 'refresh_token');

    // Trouver le refresh token
    const refreshToken = await this.refreshTokenRepository.findByToken(refreshTokenString);
    if (!refreshToken) {
      throw new AuthenticationError('Refresh token invalide');
    }

    if (refreshToken.isExpired()) {
      await this.refreshTokenRepository.deleteByToken(refreshTokenString);
      throw new AuthenticationError('Refresh token expiré');
    }

    // Générer de nouveaux tokens
    const token = this.jwtService.generate({ id: refreshToken.userId });
    const newRefreshToken = await this.createRefreshToken(refreshToken.userId);

    // Supprimer l'ancien refresh token
    await this.refreshTokenRepository.deleteByToken(refreshTokenString);

    Logger.auth(refreshToken.userId, 'token_refreshed');
    return { token, refreshToken: newRefreshToken };
  }

  async logout(token: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.id;

      // Supprimer tous les refresh tokens de l'utilisateur
      await this.refreshTokenRepository.deleteByUserId(userId);

      Logger.auth(userId, 'logged_out');
    } catch (error) {
      // Le token peut être expiré, on ne fait rien
      Logger.warn('Logout avec token invalide', { error: (error as Error).message });
    }
  }

  private async createRefreshToken(userId: ObjectId): Promise<string> {
    const token = SecurityUtils.generateRefreshToken();
    const expiresAt = DateUtils.addDays(new Date(), 30); // 30 jours

    const refreshToken = new RefreshToken(
      '' as ObjectId,
      userId,
      token,
      expiresAt
    );

    await this.refreshTokenRepository.create(refreshToken);
    return token;
  }
}

// Implémentations des services utilitaires
export class BcryptPasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return SecurityUtils.hashPassword(password);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return SecurityUtils.comparePassword(password, hash);
  }
}

export class JwtService implements IJwtService {
  generate(payload: any): string {
    return SecurityUtils.generateJwt(payload);
  }

  verify(token: string): any {
    try {
      return SecurityUtils.verifyJwt(token);
    } catch (error) {
      throw new AuthenticationError('Token JWT invalide');
    }
  }
}

export class GoogleAuthService implements IGoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(config.googleClientId);
  }

  async verifyToken(token: string): Promise<{
    email: string;
    name: string;
    googleId: string;
    avatar?: string;
  }> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: config.googleClientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new AuthenticationError('Token Google invalide');
      }

      const { email, name, sub: googleId, picture: avatar } = payload;

      if (!email) {
        throw new AuthenticationError('Email non trouvé dans le token Google');
      }

      return {
        email,
        name: name || 'Utilisateur Google',
        googleId,
        avatar
      };
    } catch (error) {
      Logger.error('Erreur vérification token Google', { error: (error as Error).message });
      throw new AuthenticationError('Échec de l\'authentification Google');
    }
  }
}