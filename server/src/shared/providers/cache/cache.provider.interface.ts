export interface ICacheProvider {
  /**
   * Check if a key exists in the cache.
   */
  has(key: string): Promise<boolean>;

  /**
   * Retrieve a value from the cache.
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Set a value in the cache with an optional TTL in seconds.
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

  /**
   * Retrieve a value, or execute a factory function to compute, store, and return it.
   */
  remember<T>(key: string, ttlSeconds: number, factory: () => Promise<T>): Promise<T>;

  /**
   * Delete a value from the cache.
   */
  delete(key: string): Promise<void>;

  /**
   * Clear all values from the cache.
   */
  clear(): Promise<void>;

  /**
   * Get the remaining time-to-live for a key in seconds.
   * Returns -1 if the key doesn't have a TTL, or -2 if it doesn't exist.
   */
  ttl(key: string): Promise<number>;
}
