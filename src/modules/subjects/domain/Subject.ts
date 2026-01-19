import { ObjectId } from '../../../shared/types';

// Entité métier Subject (Domain Entity)
export class Subject {
  public readonly id: ObjectId;
  public readonly userId: ObjectId;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private _name: string;
  private _color: string;

  constructor(
    id: ObjectId,
    userId: ObjectId,
    name: string,
    color: string,
    options?: {
      createdAt?: Date;
      updatedAt?: Date;
    }
  ) {
    this.id = id;
    this.userId = userId;
    this._name = name;
    this._color = color;
    this.createdAt = options?.createdAt || new Date();
    this.updatedAt = options?.updatedAt || new Date();
  }

  get name(): string { return this._name; }
  get color(): string { return this._color; }

  updateName(name: string): void {
    this._name = name;
    this.updatedAt = new Date();
  }

  updateColor(color: string): void {
    this._color = color;
    this.updatedAt = new Date();
  }

  toPersistence(): any {
    return {
      _id: this.id,
      userId: this.userId,
      name: this._name,
      color: this._color,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromPersistence(data: any): Subject {
    return new Subject(
      data._id || data.id,
      data.userId,
      data.name,
      data.color,
      {
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }
    );
  }
}