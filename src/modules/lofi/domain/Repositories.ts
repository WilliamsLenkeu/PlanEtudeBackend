import { ObjectId } from '../../../shared/types';
import { LoFiTrack } from './LoFi';

export interface ILoFiRepository {
  findById(id: ObjectId): Promise<LoFiTrack | null>;
  findByCategory(category: string): Promise<LoFiTrack[]>;
  findAll(): Promise<LoFiTrack[]>;
  create(track: LoFiTrack): Promise<LoFiTrack>;
  delete(id: ObjectId): Promise<boolean>;
}

export interface ILoFiService {
  getTracks(category?: string): Promise<LoFiTrack[]>;
  getTrackById(id: ObjectId): Promise<LoFiTrack>;
  getCategories(): Promise<string[]>;
  createTrack(data: Omit<LoFiTrack, 'id' | 'createdAt'>): Promise<LoFiTrack>;
  deleteTrack(id: ObjectId): Promise<boolean>;
}