import { GamificationUtils, DateUtils, SecurityUtils } from '../src/shared/utils';

describe('GamificationUtils', () => {
  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => {
      expect(GamificationUtils.calculateLevel(0)).toBe(1);
    });

    it('should return level 2 for 100 XP', () => {
      expect(GamificationUtils.calculateLevel(100)).toBe(2);
    });

    it('should return level 3 for 400 XP', () => {
      expect(GamificationUtils.calculateLevel(400)).toBe(3);
    });

    it('should return level 4 for 900 XP', () => {
      expect(GamificationUtils.calculateLevel(900)).toBe(4);
    });
  });

  describe('calculateXpForLevel', () => {
    it('should return 100 XP for level 1', () => {
      expect(GamificationUtils.calculateXpForLevel(1)).toBe(100);
    });

    it('should return 400 XP for level 2', () => {
      expect(GamificationUtils.calculateXpForLevel(2)).toBe(400);
    });

    it('should return 900 XP for level 3', () => {
      expect(GamificationUtils.calculateXpForLevel(3)).toBe(900);
    });
  });

  describe('calculateSessionXp', () => {
    it('should calculate XP based on duration', () => {
      const xp = GamificationUtils.calculateSessionXp(30);
      expect(xp).toBe(300); // 30 * 10 = 300
    });

    it('should apply mastery bonus', () => {
      const xpWithBonus = GamificationUtils.calculateSessionXp(30, 50);
      expect(xpWithBonus).toBe(450); // 300 * (1 + 0.5) = 450
    });

    it('should round to nearest integer', () => {
      const xp = GamificationUtils.calculateSessionXp(15);
      expect(xp).toBe(150);
    });
  });

  describe('calculateStreakBonus', () => {
    it('should return 0 for less than 7 days', () => {
      expect(GamificationUtils.calculateStreakBonus(5)).toBe(0);
    });

    it('should return bonus for 7-30 days', () => {
      expect(GamificationUtils.calculateStreakBonus(7)).toBe(50);
      expect(GamificationUtils.calculateStreakBonus(14)).toBe(100);
    });

    it('should return bonus for over 30 days', () => {
      expect(GamificationUtils.calculateStreakBonus(30)).toBe(200);
      expect(GamificationUtils.calculateStreakBonus(60)).toBe(400);
    });
  });
});

describe('DateUtils', () => {
  describe('formatDate', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(DateUtils.formatDate(date)).toBe('2024-01-15');
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid date', () => {
      expect(DateUtils.isValidDate(new Date())).toBe(true);
    });

    it('should return false for invalid date', () => {
      expect(DateUtils.isValidDate('not a date')).toBe(false);
    });

    it('should return false for invalid Date object', () => {
      expect(DateUtils.isValidDate(new Date('invalid'))).toBe(false);
    });
  });

  describe('addDays', () => {
    it('should add days to a date', () => {
      const date = new Date('2024-01-15');
      const result = DateUtils.addDays(date, 5);
      expect(result.getDate()).toBe(20);
    });

    it('should handle month boundaries', () => {
      const date = new Date('2024-01-30');
      const result = DateUtils.addDays(date, 5);
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(4);
    });
  });

  describe('getStartOfDay', () => {
    it('should set time to 00:00:00', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = DateUtils.getStartOfDay(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });
  });

  describe('getEndOfDay', () => {
    it('should set time to 23:59:59.999', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = DateUtils.getEndOfDay(date);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
    });
  });
});

describe('SecurityUtils', () => {
  describe('hashPassword', () => {
    it('should hash password', async () => {
      const hash = await SecurityUtils.hashPassword('testPassword123');
      expect(hash).toBeDefined();
      expect(hash).not.toBe('testPassword123');
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should produce different hashes for same password', async () => {
      const hash1 = await SecurityUtils.hashPassword('testPassword123');
      const hash2 = await SecurityUtils.hashPassword('testPassword123');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const hash = await SecurityUtils.hashPassword('testPassword123');
      const result = await SecurityUtils.comparePassword('testPassword123', hash);
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const hash = await SecurityUtils.hashPassword('testPassword123');
      const result = await SecurityUtils.comparePassword('wrongPassword', hash);
      expect(result).toBe(false);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a token', () => {
      const token = SecurityUtils.generateRefreshToken();
      expect(token).toBeDefined();
      expect(token.length).toBeGreaterThan(50);
    });

    it('should generate unique tokens', () => {
      const token1 = SecurityUtils.generateRefreshToken();
      const token2 = SecurityUtils.generateRefreshToken();
      expect(token1).not.toBe(token2);
    });
  });
});