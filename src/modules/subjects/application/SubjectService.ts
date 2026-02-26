import { Subject } from '../domain/Subject';
import { ISubjectRepository } from '../domain/Repositories';
import { ObjectId } from '../../../shared/types';
import { Logger } from '../../../core/logging/Logger';
import { NotFoundError, AuthorizationError } from '../../../shared/errors/CustomErrors';

export class SubjectService implements ISubjectRepository {
  constructor(
    private subjectRepository: ISubjectRepository
  ) {}

  async createSubject(userId: ObjectId, data: { name: string; color: string }): Promise<Subject> {
    Logger.business('subject', 'create', { userId, name: data.name });

    const subject = new Subject(
      '' as ObjectId,
      userId,
      data.name,
      data.color
    );

    const savedSubject = await this.subjectRepository.create(subject);
    Logger.business('subject', 'created', { subjectId: savedSubject.id });
    return savedSubject;
  }

  async getSubjects(userId: ObjectId): Promise<Subject[]> {
    Logger.business('subject', 'get_all', { userId });
    return this.subjectRepository.findByUserId(userId);
  }

  async getSubjectById(id: ObjectId, userId: ObjectId): Promise<Subject> {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) {
      throw new NotFoundError('Matière');
    }
    // Matières globales (seed) : accès lecture pour tous
    if (subject.userId == null) return subject;
    // Matières utilisateur : vérifier que c'est bien les siennes
    const subjectUserId = String(subject.userId);
    const requestUserId = userId != null ? String(userId) : null;
    if (subjectUserId !== requestUserId) {
      throw new AuthorizationError('Vous n\'avez pas accès à cette matière');
    }
    return subject;
  }

  async updateSubject(id: ObjectId, userId: ObjectId, updates: { name?: string; color?: string }): Promise<Subject> {
    Logger.business('subject', 'update', { subjectId: id, userId });

    const subject = await this.getSubjectById(id, userId);
    if (subject.userId == null) {
      throw new AuthorizationError('Les matières globales ne peuvent pas être modifiées');
    }

    if (updates.name) {
      subject.updateName(updates.name);
    }
    if (updates.color) {
      subject.updateColor(updates.color);
    }

    const updatedSubject = await this.subjectRepository.update(subject);
    Logger.business('subject', 'updated', { subjectId: id });
    return updatedSubject;
  }

  async deleteSubject(id: ObjectId, userId: ObjectId): Promise<boolean> {
    Logger.business('subject', 'delete', { subjectId: id, userId });

    const subject = await this.getSubjectById(id, userId);
    if (subject.userId == null) {
      throw new AuthorizationError('Les matières globales ne peuvent pas être supprimées');
    }
    const deleted = await this.subjectRepository.delete(subject.id);

    Logger.business('subject', 'deleted', { subjectId: id });
    return deleted;
  }

  // Implémentation du repository pour ISubjectRepository
  async findById(id: ObjectId): Promise<Subject | null> {
    return this.subjectRepository.findById(id);
  }

  async findByUserId(userId: ObjectId): Promise<Subject[]> {
    return this.subjectRepository.findByUserId(userId);
  }

  async create(subject: Subject): Promise<Subject> {
    return this.subjectRepository.create(subject);
  }

  async update(subject: Subject): Promise<Subject> {
    return this.subjectRepository.update(subject);
  }

  async delete(id: ObjectId): Promise<boolean> {
    return this.subjectRepository.delete(id);
  }

  async countByUserId(userId: ObjectId): Promise<number> {
    return this.subjectRepository.countByUserId(userId);
  }
}