import { User } from '../src/modules/auth/domain/User';
import { Planning, PlanningSession } from '../src/modules/planning/domain/Planning';

describe('User Entity', () => {
  const validUserData = {
    id: '123456789012345678901234' as any,
    email: 'test@example.com',
    name: 'Test User',
    gender: 'M' as const
  };

  describe('constructor', () => {
    it('should create a user with valid data', () => {
      const user = new User(
        validUserData.id,
        validUserData.email,
        validUserData.name,
        validUserData.gender
      );

      expect(user.email).toBe(validUserData.email);
      expect(user.name).toBe(validUserData.name);
      expect(user.gender).toBe(validUserData.gender);
      expect(user.role).toBe('user');
      expect(user.preferences.currentTheme).toBe('classic-pink');
      expect(user.studyStats.totalStudyTime).toBe(0);
    });

    it('should set default preferences', () => {
      const user = new User(
        validUserData.id,
        validUserData.email,
        validUserData.name,
        validUserData.gender
      );

      expect(user.preferences.currentTheme).toBe('classic-pink');
      expect(user.preferences.unlockedThemes).toContain('classic-pink');
      expect(user.preferences.matieres).toEqual([]);
    });
  });

  describe('updateProfile', () => {
    it('should update name', () => {
      const user = new User(
        validUserData.id,
        validUserData.email,
        validUserData.name,
        validUserData.gender
      );

      user.updateProfile({ name: 'New Name' });

      expect(user.name).toBe('New Name');
    });

    it('should update preferences', () => {
      const user = new User(
        validUserData.id,
        validUserData.email,
        validUserData.name,
        validUserData.gender
      );

      user.updateProfile({
        preferences: { currentTheme: 'dark-mode' }
      });

      expect(user.preferences.currentTheme).toBe('dark-mode');
    });
  });

  describe('unlockTheme', () => {
    it('should unlock a new theme', () => {
      const user = new User(
        validUserData.id,
        validUserData.email,
        validUserData.name,
        validUserData.gender
      );

      user.unlockTheme('ocean-blue');

      expect(user.preferences.unlockedThemes).toContain('ocean-blue');
    });

    it('should not duplicate theme', () => {
      const user = new User(
        validUserData.id,
        validUserData.email,
        validUserData.name,
        validUserData.gender
      );

      const initialCount = user.preferences.unlockedThemes.length;

      user.unlockTheme('classic-pink'); // Already unlocked
      user.unlockTheme('classic-pink');

      expect(user.preferences.unlockedThemes.length).toBe(initialCount);
    });
  });

  describe('addSubject', () => {
    it('should add a subject', () => {
      const user = new User(
        validUserData.id,
        validUserData.email,
        validUserData.name,
        validUserData.gender
      );

      user.addSubject('Mathématiques');

      expect(user.preferences.matieres).toContain('Mathématiques');
    });
  });

  describe('addStudyTime', () => {
    it('should add study time', () => {
      const user = new User(
        validUserData.id,
        validUserData.email,
        validUserData.name,
        validUserData.gender
      );

      user.addStudyTime(30);

      expect(user.studyStats.totalStudyTime).toBe(30);
      expect(user.studyStats.lastStudyDate).toBeDefined();
    });

    it('should accumulate study time', () => {
      const user = new User(
        validUserData.id,
        validUserData.email,
        validUserData.name,
        validUserData.gender
      );

      user.addStudyTime(30);
      user.addStudyTime(45);

      expect(user.studyStats.totalStudyTime).toBe(75);
    });
  });

  describe('updateSubjectMastery', () => {
    it('should add new subject mastery', () => {
      const user = new User(
        validUserData.id,
        validUserData.email,
        validUserData.name,
        validUserData.gender
      );

      user.updateSubjectMastery('Mathématiques', 75);

      const mastery = user.getSubjectMastery('Mathématiques');
      expect(mastery).toBe(75);
    });

    it('should update existing subject mastery', () => {
      const user = new User(
        validUserData.id,
        validUserData.email,
        validUserData.name,
        validUserData.gender
      );

      user.updateSubjectMastery('Mathématiques', 75);
      user.updateSubjectMastery('Mathématiques', 85);

      const mastery = user.getSubjectMastery('Mathématiques');
      expect(mastery).toBe(85);
    });

    it('should clamp score between 0 and 100', () => {
      const user = new User(
        validUserData.id,
        validUserData.email,
        validUserData.name,
        validUserData.gender
      );

      user.updateSubjectMastery('Mathématiques', 150);
      expect(user.getSubjectMastery('Mathématiques')).toBe(100);

      user.updateSubjectMastery('Mathématiques', -50);
      expect(user.getSubjectMastery('Mathématiques')).toBe(0);
    });
  });

  describe('toPersistence', () => {
    it('should return correct persistence object', () => {
      const user = new User(
        validUserData.id,
        validUserData.email,
        validUserData.name,
        validUserData.gender
      );

      const persistence = user.toPersistence();

      expect(persistence._id).toBe(validUserData.id);
      expect(persistence.email).toBe(validUserData.email);
      expect(persistence.name).toBe(validUserData.name);
      expect(persistence.gender).toBe(validUserData.gender);
    });
  });
});

describe('Planning Entity', () => {
  const validPlanningData = {
    id: '123456789012345678901234' as any,
    userId: '123456789012345678901235' as any,
    titre: 'Weekly Study Plan',
    periode: 'semaine' as const,
    nombre: 5,
    dateDebut: new Date('2024-01-15')
  };

  describe('constructor', () => {
    it('should create a planning with valid data', () => {
      const planning = new Planning(
        validPlanningData.id,
        validPlanningData.userId,
        validPlanningData.titre,
        validPlanningData.periode,
        validPlanningData.nombre,
        validPlanningData.dateDebut
      );

      expect(planning.titre).toBe(validPlanningData.titre);
      expect(planning.periode).toBe('semaine');
      expect(planning.generatedBy).toBe('LOCAL');
      expect(planning.sessionsCount).toBe(0);
    });
  });

  describe('addSession', () => {
    it('should add a session', () => {
      const planning = new Planning(
        validPlanningData.id,
        validPlanningData.userId,
        validPlanningData.titre,
        validPlanningData.periode,
        validPlanningData.nombre,
        validPlanningData.dateDebut
      );

      const session = new PlanningSession(
        'Mathématiques',
        new Date('2024-01-15T10:00:00'),
        new Date('2024-01-15T11:30:00')
      );

      planning.addSession(session);

      expect(planning.sessionsCount).toBe(1);
      expect(planning.sessions).toHaveLength(1);
    });
  });

  describe('calculateTotalDuration', () => {
    it('should calculate total duration in minutes', () => {
      const planning = new Planning(
        validPlanningData.id,
        validPlanningData.userId,
        validPlanningData.titre,
        validPlanningData.periode,
        validPlanningData.nombre,
        validPlanningData.dateDebut
      );

      planning.addSession(new PlanningSession(
        'Mathématiques',
        new Date('2024-01-15T10:00:00'),
        new Date('2024-01-15T11:00:00') // 60 minutes
      ));

      planning.addSession(new PlanningSession(
        'Français',
        new Date('2024-01-15T12:00:00'),
        new Date('2024-01-15T12:30:00') // 30 minutes
      ));

      expect(planning.calculateTotalDuration()).toBe(90);
    });

    it('should return 0 for empty planning', () => {
      const planning = new Planning(
        validPlanningData.id,
        validPlanningData.userId,
        validPlanningData.titre,
        validPlanningData.periode,
        validPlanningData.nombre,
        validPlanningData.dateDebut
      );

      expect(planning.calculateTotalDuration()).toBe(0);
    });
  });

  describe('calculateCompletionRate', () => {
    it('should calculate completion rate', () => {
      const planning = new Planning(
        validPlanningData.id,
        validPlanningData.userId,
        validPlanningData.titre,
        validPlanningData.periode,
        validPlanningData.nombre,
        validPlanningData.dateDebut
      );

      planning.addSession(new PlanningSession(
        'Mathématiques',
        new Date('2024-01-15T10:00:00'),
        new Date('2024-01-15T11:00:00'),
        { statut: 'termine' }
      ));

      planning.addSession(new PlanningSession(
        'Français',
        new Date('2024-01-15T12:00:00'),
        new Date('2024-01-15T12:30:00'),
        { statut: 'planifie' }
      ));

      expect(planning.calculateCompletionRate()).toBe(50);
    });

    it('should return 0 for empty planning', () => {
      const planning = new Planning(
        validPlanningData.id,
        validPlanningData.userId,
        validPlanningData.titre,
        validPlanningData.periode,
        validPlanningData.nombre,
        validPlanningData.dateDebut
      );

      expect(planning.calculateCompletionRate()).toBe(0);
    });
  });

  describe('getSessionsBySubject', () => {
    it('should filter sessions by subject', () => {
      const planning = new Planning(
        validPlanningData.id,
        validPlanningData.userId,
        validPlanningData.titre,
        validPlanningData.periode,
        validPlanningData.nombre,
        validPlanningData.dateDebut
      );

      planning.addSession(new PlanningSession(
        'Mathématiques',
        new Date('2024-01-15T10:00:00'),
        new Date('2024-01-15T11:00:00')
      ));

      planning.addSession(new PlanningSession(
        'Mathématiques',
        new Date('2024-01-15T14:00:00'),
        new Date('2024-01-15T15:00:00')
      ));

      planning.addSession(new PlanningSession(
        'Français',
        new Date('2024-01-15T12:00:00'),
        new Date('2024-01-15T12:30:00')
      ));

      const mathSessions = planning.getSessionsBySubject('Mathématiques');
      expect(mathSessions).toHaveLength(2);
    });
  });

  describe('toPersistence', () => {
    it('should return correct persistence object', () => {
      const planning = new Planning(
        validPlanningData.id,
        validPlanningData.userId,
        validPlanningData.titre,
        validPlanningData.periode,
        validPlanningData.nombre,
        validPlanningData.dateDebut
      );

      const persistence = planning.toPersistence();

      expect(persistence._id).toBe(validPlanningData.id);
      expect(persistence.userId).toBe(validPlanningData.userId);
      expect(persistence.titre).toBe(validPlanningData.titre);
      expect(persistence.periode).toBe('semaine');
    });
  });
});