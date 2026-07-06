import { ICacheProvider } from './cache.provider.interface';

interface CacheItem<T> {
  value: T;
  expiry: number | null; // Timestamp in MS, null means no expiry
}

export class MemoryCacheService implements ICacheProvider {
  private cache: Map<string, CacheItem<any>> = new Map();

  async has(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (item.expiry !== null && Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (item.expiry !== null && Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.cache.set(key, { value, expiry });
  }

  async remember<T>(key: string, ttlSeconds: number, factory: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async ttl(key: string): Promise<number> {
    const item = this.cache.get(key);
    if (!item) return -2;

    if (item.expiry === null) return -1;

    const remainingMs = item.expiry - Date.now();
    if (remainingMs <= 0) {
      this.cache.delete(key);
      return -2;
    }

    return Math.floor(remainingMs / 1000);
  }
}

// Global instance for simple DI
export const memoryCache = new MemoryCacheService();
