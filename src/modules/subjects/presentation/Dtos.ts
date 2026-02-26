import { ObjectId } from '../../../shared/types';
import { Subject } from '../domain/Subject';

export class SubjectResponseDto {
  constructor(
    public id: ObjectId,
    public userId: ObjectId | null,
    public name: string,
    public color: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static fromDomain(subject: Subject): SubjectResponseDto {
    return new SubjectResponseDto(
      subject.id,
      subject.userId,
      subject.name,
      subject.color,
      subject.createdAt,
      subject.updatedAt
    );
  }
}

export class CreateSubjectRequestDto {
  constructor(
    public name: string,
    public color: string
  ) {}
}

export class UpdateSubjectRequestDto {
  constructor(
    public name?: string,
    public color?: string
  ) {}
}