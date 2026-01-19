import { User } from '../domain/User';
import { ObjectId } from '../../../shared/types';

// DTOs de réponse
export class UserResponseDto {
  constructor(
    public id: ObjectId,
    public email: string,
    public name: string,
    public gender: 'M' | 'F',
    public role: 'user' | 'admin',
    public isVerified: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public avatar?: string,
    public preferences?: User['preferences'],
    public studyStats?: User['studyStats']
  ) {}

  static fromDomain(user: User): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.email,
      user.name,
      user.gender,
      user.role,
      user.isVerified,
      user.createdAt,
      user.updatedAt,
      user.avatar,
      user.preferences,
      user.studyStats
    );
  }
}

export class AuthResponseDto {
  constructor(
    public user: UserResponseDto,
    public token: string,
    public refreshToken: string
  ) {}

  static create(user: User, token: string, refreshToken: string): AuthResponseDto {
    return new AuthResponseDto(
      UserResponseDto.fromDomain(user),
      token,
      refreshToken
    );
  }
}

export class TokenResponseDto {
  constructor(
    public token: string,
    public refreshToken: string
  ) {}
}

// DTOs de requête pour les contrôleurs
export class RegisterRequestDto {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public gender: 'M' | 'F'
  ) {}
}

export class LoginRequestDto {
  constructor(
    public email: string,
    public password: string
  ) {}
}

export class GoogleLoginRequestDto {
  constructor(
    public idToken: string
  ) {}
}

export class RefreshTokenRequestDto {
  constructor(
    public token: string
  ) {}
}

export class UpdateProfileRequestDto {
  constructor(
    public name?: string,
    public preferences?: Partial<User['preferences']>
  ) {}

  static fromRequest(data: any): UpdateProfileRequestDto {
    return new UpdateProfileRequestDto(data.name, data.preferences);
  }
}

// Correction pour éviter l'erreur de paramètre requis après optionnel
export class CreateUserDto {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public gender: 'M' | 'F'
  ) {}
}

export class UsersQueryDto {
  constructor(
    public limit?: number,
    public offset?: number,
    public sortBy?: string,
    public sortOrder?: 'asc' | 'desc'
  ) {}
}