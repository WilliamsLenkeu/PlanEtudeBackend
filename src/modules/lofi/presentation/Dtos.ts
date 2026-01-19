import { ObjectId } from '../../../shared/types';
import { LoFiTrack } from '../domain/LoFi';

export class LoFiTrackResponseDto {
  constructor(
    public id: ObjectId,
    public title: string,
    public artist: string,
    public url: string,
    public thumbnail: string | undefined,
    public category: string,
    public createdAt: Date
  ) {}

  static fromDomain(track: LoFiTrack): LoFiTrackResponseDto {
    return new LoFiTrackResponseDto(
      track.id,
      track.title,
      track.artist,
      track.url,
      track.thumbnail,
      track.category,
      track.createdAt
    );
  }
}

export class CreateLoFiTrackRequestDto {
  constructor(
    public title: string,
    public artist: string,
    public url: string,
    public category: string,
    public thumbnail?: string
  ) {}
}