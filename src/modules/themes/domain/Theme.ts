import { ObjectId } from '../../../shared/types';

export class Theme {
  public readonly id: ObjectId;
  public readonly createdAt: Date;

  private _key: string;
  private _name: string;
  private _description?: string;
  private _priceXP: number;
  private _config: {
    primaryColor: string;
    secondaryColor?: string;
    backgroundColor: string;
    fontFamily: string;
  };
  private _previewUrl?: string;

  constructor(
    id: ObjectId,
    key: string,
    name: string,
    config: {
      primaryColor: string;
      secondaryColor?: string;
      backgroundColor: string;
      fontFamily: string;
    },
    options?: {
      description?: string;
      priceXP?: number;
      previewUrl?: string;
      createdAt?: Date;
    }
  ) {
    this.id = id;
    this._key = key;
    this._name = name;
    this._config = config;
    this._description = options?.description;
    this._priceXP = options?.priceXP || 0;
    this._previewUrl = options?.previewUrl;
    this.createdAt = options?.createdAt || new Date();
  }

  get key(): string { return this._key; }
  get name(): string { return this._name; }
  get description(): string | undefined { return this._description; }
  get priceXP(): number { return this._priceXP; }
  get config() { return { ...this._config }; }
  get previewUrl(): string | undefined { return this._previewUrl; }

  toPersistence(): any {
    return {
      _id: this.id,
      key: this._key,
      name: this._name,
      description: this._description,
      priceXP: this._priceXP,
      config: this._config,
      previewUrl: this._previewUrl,
      createdAt: this.createdAt
    };
  }

  static fromPersistence(data: any): Theme {
    return new Theme(
      data._id || data.id,
      data.key,
      data.name,
      data.config,
      {
        description: data.description,
        priceXP: data.priceXP,
        previewUrl: data.previewUrl,
        createdAt: data.createdAt
      }
    );
  }
}