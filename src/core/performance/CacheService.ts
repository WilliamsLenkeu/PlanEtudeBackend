import NodeCache from 'node-cache';

// Lazy import pour éviter les dépendances circulaires
const getLogger = () => {
  try {
    return require('../logging/Logger').Logger;
  } catch {
    return { info: console.log, warn: console.warn, error: console.error };
  }
};

// Configuration du cache
const CACHE_CONFIG = {
  stdTTL: 300, // 5 minutes par défaut
  checkperiod: 60, // Vérification toutes les minutes
  maxKeys: 1000 // Nombre maximum de clés
};

// Service de cache centralisé
export class CacheService {
  private static instance: CacheService;
  private cache: NodeCache;

  private constructor() {
    this.cache = new NodeCache(CACHE_CONFIG);
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  // Méthodes de base
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || CACHE_CONFIG.stdTTL);
  }

  delete(key: string): number {
    return this.cache.del(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  flush(): void {
    this.cache.flushAll();
    getLogger().info('Cache flushé');
  }

  // Méthodes helper pour les patterns courants
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await fetchFn();
    this.set(key, value, ttl);
    return value;
  }

  // Invalidation par pattern
  deleteByPattern(pattern: string): number {
    const keys = this.cache.keys();
    const regex = new RegExp(pattern);
    let deleted = 0;

    for (const key of keys) {
      if (regex.test(key)) {
        deleted += this.delete(key);
      }
    }

    return deleted;
  }

  // Stats du cache
  getStats(): any {
    return {
      keys: this.cache.keys().length,
      hits: (this.cache as any).getStats?.hits || 0,
      misses: (this.cache as any).getStats?.misses || 0
    };
  }
}

// Middleware de cache pour les requêtes HTTP
export const cacheMiddleware = (key: string, ttl?: number) => {
  return async (req: any, res: any, next: any) => {
    const cache = CacheService.getInstance();
    const cacheKey = `${key}:${req.originalUrl}`;

    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      return res.json(cached);
    }

    // Stocker le res.json original
    const originalJson = res.json.bind(res);

    res.json = (data: any) => {
      cache.set(cacheKey, data, ttl);
      return originalJson(data);
    };

    next();
  };
};

// Constants pour les clés de cache
export const CACHE_KEYS = {
  USER_PROFILE: 'user:profile:',
  USER_STATS: 'user:stats:',
  THEMES_LIST: 'themes:all',
  SUBJECTS_LIST: 'subjects:user:',
  PLANNING_LIST: 'planning:user:',
  PROGRESS_SUMMARY: 'progress:summary:',
  GLOBAL_STATS: 'admin:stats'
} as const;