import { ObjectId } from '../../../shared/types';

export class LoFiTrack {
  public readonly id: ObjectId;
  public readonly createdAt: Date;

  private _title: string;
  private _artist: string;
  private _url: string;
  private _thumbnail?: string;
  private _category: string;

  constructor(
    id: ObjectId,
    title: string,
    artist: string,
    url: string,
    category: string,
    options?: {
      thumbnail?: string;
      createdAt?: Date;
    }
  ) {
    this.id = id;
    this._title = title;
    this._artist = artist;
    this._url = url;
    this._category = category;
    this._thumbnail = options?.thumbnail;
    this.createdAt = options?.createdAt || new Date();
  }

  get title(): string { return this._title; }
  get artist(): string { return this._artist; }
  get url(): string { return this._url; }
  get thumbnail(): string | undefined { return this._thumbnail; }
  get category(): string { return this._category; }

  toPersistence(): any {
    return {
      _id: this.id,
      title: this._title,
      artist: this._artist,
      url: this._url,
      thumbnail: this._thumbnail,
      category: this._category,
      createdAt: this.createdAt
    };
  }

  static fromPersistence(data: any): LoFiTrack {
    return new LoFiTrack(
      data._id || data.id,
      data.title,
      data.artist,
      data.url,
      data.category,
      {
        thumbnail: data.thumbnail,
        createdAt: data.createdAt
      }
    );
  }
}