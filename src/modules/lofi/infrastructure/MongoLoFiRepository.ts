import { Model } from 'mongoose';
import { LoFiTrack } from '../domain/LoFi';
import { ILoFiRepository } from '../domain/Repositories';
import { ObjectId } from '../../../shared/types';
import { Logger } from '../../../core/logging/Logger';

export class MongoLoFiRepository implements ILoFiRepository {
  constructor(private lofiModel: Model<any>) {}

  async findById(id: ObjectId): Promise<LoFiTrack | null> {
    try {
      const startTime = Date.now();
      const data = await this.lofiModel.findById(id).lean();
      Logger.database('findById', 'lofi_tracks', Date.now() - startTime);
      return data ? LoFiTrack.fromPersistence(data) : null;
    } catch (error) {
      Logger.database('findById', 'lofi_tracks', 0, error);
      throw error;
    }
  }

  async findByCategory(category: string): Promise<LoFiTrack[]> {
    try {
      const startTime = Date.now();
      const data = await this.lofiModel.find({ category }).lean();
      Logger.database('findByCategory', 'lofi_tracks', Date.now() - startTime);
      return data.map(item => LoFiTrack.fromPersistence(item));
    } catch (error) {
      Logger.database('findByCategory', 'lofi_tracks', 0, error);
      throw error;
    }
  }

  async findAll(): Promise<LoFiTrack[]> {
    try {
      const startTime = Date.now();
      const data = await this.lofiModel.find().lean();
      Logger.database('findAll', 'lofi_tracks', Date.now() - startTime);
      return data.map(item => LoFiTrack.fromPersistence(item));
    } catch (error) {
      Logger.database('findAll', 'lofi_tracks', 0, error);
      throw error;
    }
  }

  async create(track: LoFiTrack): Promise<LoFiTrack> {
    try {
      const startTime = Date.now();
      const data = track.toPersistence();
      const created = await this.lofiModel.create(data);
      Logger.database('create', 'lofi_tracks', Date.now() - startTime);
      return LoFiTrack.fromPersistence(created);
    } catch (error) {
      Logger.database('create', 'lofi_tracks', 0, error);
      throw error;
    }
  }

  async delete(id: ObjectId): Promise<boolean> {
    try {
      const startTime = Date.now();
      const result = await this.lofiModel.findByIdAndDelete(id);
      Logger.database('delete', 'lofi_tracks', Date.now() - startTime);
      return !!result;
    } catch (error) {
      Logger.database('delete', 'lofi_tracks', 0, error);
      throw error;
    }
  }
}