import type { BaseConfig } from './types';

export class ConfigController<T extends BaseConfig> {
  private readonly config: T;

  constructor(config: T) {
    this.config = Object.freeze({ ...config });
  }

  /**
   * Get a configuration value by key
   *
   * @param key - The configuration key to retrieve
   * @returns The configuration value
   * @throws Error if the key doesn't exist in the configuration
   */
  get<K extends keyof T>(key: K): T[K] {
    if (!(key in this.config)) {
      throw new Error(
        `Configuration key "${String(key)}" not found. Available keys: ${Object.keys(this.config).join(', ')}`
      );
    }
    return this.config[key];
  }

  /**
   * Check if a configuration key exists
   *
   * @param key - The configuration key to check
   * @returns true if the key exists, false otherwise
   */
  has<K extends keyof T>(key: K): boolean {
    return key in this.config;
  }

  /**
   * Get a configuration value with a default fallback
   *
   * @param key - The configuration key to retrieve
   * @param defaultValue - The default value if key doesn't exist
   * @returns The configuration value or default value
   */
  getOrDefault<K extends keyof T>(key: K, defaultValue: T[K]): T[K] {
    return this.has(key) ? this.config[key] : defaultValue;
  }
}
