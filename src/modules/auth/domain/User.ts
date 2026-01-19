import { ObjectId } from '../../../shared/types';

// Entité métier User (Domain Entity)
export class User {
  public readonly id: ObjectId;
  public readonly createdAt: Date;
  public updatedAt: Date;

  // Propriétés métier
  private _email: string;
  private _name: string;
  private _passwordHash?: string;
  private _googleId?: string;
  private _avatar?: string;
  private _gender: 'M' | 'F';
  private _role: 'user' | 'admin';
  private _isVerified: boolean;

  // Préférences
  private _preferences: UserPreferences;

  // Statistiques d'étude
  private _studyStats: StudyStats;

  constructor(
    id: ObjectId,
    email: string,
    name: string,
    gender: 'M' | 'F',
    preferences?: Partial<UserPreferences>,
    studyStats?: Partial<StudyStats>,
    options?: {
      passwordHash?: string;
      googleId?: string;
      avatar?: string;
      role?: 'user' | 'admin';
      isVerified?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    }
  ) {
    this.id = id;
    this._email = email;
    this._name = name;
    this._gender = gender;
    this._role = options?.role || 'user';
    this._isVerified = options?.isVerified || false;

    this._passwordHash = options?.passwordHash;
    this._googleId = options?.googleId;
    this._avatar = options?.avatar;

    this._preferences = {
      currentTheme: preferences?.currentTheme || 'classic-pink',
      unlockedThemes: preferences?.unlockedThemes || ['classic-pink'],
      matieres: preferences?.matieres || []
    };

    this._studyStats = {
      totalStudyTime: studyStats?.totalStudyTime || 0,
      lastStudyDate: studyStats?.lastStudyDate,
      subjectMastery: studyStats?.subjectMastery || []
    };

    this.createdAt = options?.createdAt || new Date();
    this.updatedAt = options?.updatedAt || new Date();
  }

  // Getters
  get email(): string { return this._email; }
  get name(): string { return this._name; }
  get gender(): 'M' | 'F' { return this._gender; }
  get role(): 'user' | 'admin' { return this._role; }
  get isVerified(): boolean { return this._isVerified; }
  get passwordHash(): string | undefined { return this._passwordHash; }
  get googleId(): string | undefined { return this._googleId; }
  get avatar(): string | undefined { return this._avatar; }
  get preferences(): UserPreferences { return { ...this._preferences }; }
  get studyStats(): StudyStats { return { ...this._studyStats }; }

  // Méthodes métier
  updateProfile(updates: { name?: string; preferences?: Partial<UserPreferences> }): void {
    if (updates.name) {
      this._name = updates.name.trim();
    }

    if (updates.preferences) {
      this._preferences = {
        ...this._preferences,
        ...updates.preferences
      };
    }

    this.updatedAt = new Date();
  }

  unlockTheme(themeKey: string): void {
    if (!this._preferences.unlockedThemes.includes(themeKey)) {
      this._preferences.unlockedThemes.push(themeKey);
      this.updatedAt = new Date();
    }
  }

  addSubject(subject: string): void {
    if (!this._preferences.matieres.includes(subject)) {
      this._preferences.matieres.push(subject);
      this.updatedAt = new Date();
    }
  }

  removeSubject(subject: string): void {
    this._preferences.matieres = this._preferences.matieres.filter(s => s !== subject);
    this.updatedAt = new Date();
  }

  updateStudyStats(updates: Partial<StudyStats>): void {
    this._studyStats = {
      ...this._studyStats,
      ...updates
    };
    this.updatedAt = new Date();
  }

  addStudyTime(minutes: number): void {
    this._studyStats.totalStudyTime += minutes;
    this._studyStats.lastStudyDate = new Date();
    this.updatedAt = new Date();
  }

  updateSubjectMastery(subjectName: string, score: number): void {
    const existingIndex = this._studyStats.subjectMastery.findIndex(
      s => s.subjectName === subjectName
    );

    if (existingIndex >= 0) {
      this._studyStats.subjectMastery[existingIndex] = {
        ...this._studyStats.subjectMastery[existingIndex],
        score: Math.max(0, Math.min(100, score)),
        lastStudied: new Date()
      };
    } else {
      this._studyStats.subjectMastery.push({
        subjectName,
        score: Math.max(0, Math.min(100, score)),
        lastStudied: new Date()
      });
    }

    this.updatedAt = new Date();
  }

  getSubjectMastery(subjectName: string): number {
    const subject = this._studyStats.subjectMastery.find(s => s.subjectName === subjectName);
    return subject?.score || 0;
  }

  // Méthodes d'authentification
  setPasswordHash(hash: string): void {
    this._passwordHash = hash;
    this.updatedAt = new Date();
  }

  setGoogleId(googleId: string): void {
    this._googleId = googleId;
    this.updatedAt = new Date();
  }

  setAvatar(avatar: string): void {
    this._avatar = avatar;
    this.updatedAt = new Date();
  }

  verify(): void {
    this._isVerified = true;
    this.updatedAt = new Date();
  }

  // Méthodes utilitaires
  hasPassword(): boolean {
    return !!this._passwordHash;
  }

  hasGoogleAuth(): boolean {
    return !!this._googleId;
  }

  canAccessTheme(themeKey: string): boolean {
    return this._preferences.unlockedThemes.includes(themeKey);
  }

  isAdmin(): boolean {
    return this._role === 'admin';
  }

  // Conversion pour la persistance
  toPersistence(): any {
    return {
      _id: this.id,
      email: this._email,
      name: this._name,
      password: this._passwordHash,
      googleId: this._googleId,
      avatar: this._avatar,
      gender: this._gender,
      role: this._role,
      isVerified: this._isVerified,
      preferences: this._preferences,
      studyStats: this._studyStats,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Factory method
  static fromPersistence(data: any): User {
    return new User(
      data._id || data.id,
      data.email,
      data.name,
      data.gender,
      data.preferences,
      data.studyStats,
      {
        passwordHash: data.password,
        googleId: data.googleId,
        avatar: data.avatar,
        role: data.role,
        isVerified: data.isVerified,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }
    );
  }
}

// Value Objects
export class UserPreferences {
  constructor(
    public currentTheme: string = 'classic-pink',
    public unlockedThemes: string[] = ['classic-pink'],
    public matieres: string[] = []
  ) {}
}

export class StudyStats {
  constructor(
    public totalStudyTime: number = 0,
    public lastStudyDate?: Date,
    public subjectMastery: SubjectMastery[] = []
  ) {}
}

export class SubjectMastery {
  constructor(
    public subjectName: string,
    public score: number,
    public lastStudied: Date
  ) {}
}

// Entité RefreshToken
export class RefreshToken {
  public readonly id: ObjectId;
  public readonly userId: ObjectId;
  public readonly token: string;
  public readonly createdAt: Date;
  public readonly expiresAt: Date;

  constructor(
    id: ObjectId,
    userId: ObjectId,
    token: string,
    expiresAt: Date,
    createdAt?: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.token = token;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt || new Date();
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  toPersistence(): any {
    return {
      _id: this.id,
      userId: this.userId,
      token: this.token,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt
    };
  }

  static fromPersistence(data: any): RefreshToken {
    return new RefreshToken(
      data._id || data.id,
      data.userId,
      data.token,
      data.expiresAt,
      data.createdAt
    );
  }
}