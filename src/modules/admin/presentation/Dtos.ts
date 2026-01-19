export class AdminStatsDto {
  constructor(
    public totalUsers: number,
    public totalPlannings: number,
    public totalProgressRecords: number,
    public activeUsersToday: number,
    public totalStudyTime: number,
    public averageSessionDuration: number
  ) {}
}

export class AdminUserDto {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public role: string,
    public isBlocked: boolean,
    public createdAt: Date,
    public studyStats: {
      totalStudyTime: number;
      lastStudyDate?: Date;
    }
  ) {}
}

export class AdminUserActivityDto {
  constructor(
    public userId: string,
    public email: string,
    public name: string,
    public totalPlannings: number,
    public totalProgressRecords: number,
    public memberSince: Date,
    public lastActive: Date
  ) {}
}

export class UpdateUserStatusDto {
  constructor(
    public isBlocked?: boolean,
    public role?: string
  ) {}
}

export class UsersListDto {
  constructor(
    public users: AdminUserDto[],
    public total: number,
    public pagination: {
      page: number;
      limit: number;
      totalPages: number;
    }
  ) {}
}