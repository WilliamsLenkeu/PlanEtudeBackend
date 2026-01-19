import { LoFiTrack } from '../domain/LoFi';
import { ILoFiRepository } from '../domain/Repositories';
import { ObjectId } from '../../../shared/types';
import { Logger } from '../../../core/logging/Logger';
import { NotFoundError } from '../../../shared/errors/CustomErrors';

export class LoFiService implements ILoFiRepository {
  constructor(
    private lofiRepository: ILoFiRepository
  ) {}

  async getTracks(category?: string): Promise<LoFiTrack[]> {
    Logger.business('lofi', 'get_tracks', { category });
    
    if (category) {
      return this.lofiRepository.findByCategory(category);
    }
    return this.lofiRepository.findAll();
  }

  async getTrackById(id: ObjectId): Promise<LoFiTrack> {
    const track = await this.lofiRepository.findById(id);
    if (!track) {
      throw new NotFoundError('Track');
    }
    return track;
  }

  async getCategories(): Promise<string[]> {
    Logger.business('lofi', 'get_categories');
    const tracks = await this.lofiRepository.findAll();
    const categories = [...new Set(tracks.map(t => t.category))];
    return categories;
  }

  async createTrack(data: Omit<LoFiTrack, 'id' | 'createdAt'>): Promise<LoFiTrack> {
    Logger.business('lofi', 'create', { title: data.title });

    const track = new LoFiTrack(
      '' as ObjectId,
      data.title,
      data.artist,
      data.url,
      data.category,
      { thumbnail: data.thumbnail }
    );

    const savedTrack = await this.lofiRepository.create(track);
    Logger.business('lofi', 'created', { trackId: savedTrack.id });
    return savedTrack;
  }

  async deleteTrack(id: ObjectId): Promise<boolean> {
    Logger.business('lofi', 'delete', { trackId: id });

    await this.getTrackById(id);
    const deleted = await this.lofiRepository.delete(id);

    Logger.business('lofi', 'deleted', { trackId: id });
    return deleted;
  }

  // Implémentation du repository
  async findById(id: ObjectId): Promise<LoFiTrack | null> {
    return this.lofiRepository.findById(id);
  }

  async findByCategory(category: string): Promise<LoFiTrack[]> {
    return this.lofiRepository.findByCategory(category);
  }

  async findAll(): Promise<LoFiTrack[]> {
    return this.lofiRepository.findAll();
  }

  async create(track: LoFiTrack): Promise<LoFiTrack> {
    return this.lofiRepository.create(track);
  }

  async delete(id: ObjectId): Promise<boolean> {
    return this.lofiRepository.delete(id);
  }
}