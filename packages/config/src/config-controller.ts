import type { AppConfig, BaseConfig } from './types';

/**
 * ConfigController - Utility class for managing and accessing configuration
 * 
 * @example
 * ```typescript
 * const config = {
 *   stage: 'dev',
 *   project: 'my-app',
 *   awsAccountId: '123456789012',
 *   awsRegion: AWS_REGIONS.US_EAST_1,
 *   logLevel: LOG_LEVELS.DEBUG,
 *   customVar: 'my-value',
 *   apiUrl: 'https://api.example.com'
 * };
 * 
 * const configCtrl = new ConfigController(config);
 * 
 * // Access base config properties
 * const stage = configCtrl.get('stage'); // 'dev'
 * const region = configCtrl.get('awsRegion'); // 'us-east-1'
 * 
 * // Access app-specific properties
 * const apiUrl = configCtrl.get('apiUrl'); // 'https://api.example.com'
 * const customVar = configCtrl.get('customVar'); // 'my-value'
 * ```
 */
export class ConfigController<T extends AppConfig = AppConfig> {
  private readonly config: T;

  constructor(config: T) {
    this.validateBaseConfig(config);
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
   * Get all configuration as a readonly object
   * 
   * @returns The complete configuration object
   */
  getAll(): Readonly<T> {
    return this.config;
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

  /**
   * Validate that all required base config properties are present
   */
  private validateBaseConfig(config: AppConfig): void {
    const requiredKeys: Array<keyof BaseConfig> = [
      'stage',
      'project',
      'awsAccountId',
      'awsRegion',
      'logLevel',
    ];

    const missingKeys = requiredKeys.filter((key) => !(key in config));

    if (missingKeys.length > 0) {
      throw new Error(
        `Missing required base configuration properties: ${missingKeys.join(', ')}`
      );
    }

    // Validate types
    if (typeof config.stage !== 'string' || config.stage.trim() === '') {
      throw new Error('Configuration property "stage" must be a non-empty string');
    }

    if (typeof config.project !== 'string' || config.project.trim() === '') {
      throw new Error('Configuration property "project" must be a non-empty string');
    }

    if (typeof config.awsAccountId !== 'string' || !/^\d{12}$/.test(config.awsAccountId)) {
      throw new Error('Configuration property "awsAccountId" must be a 12-digit string');
    }

    if (typeof config.awsRegion !== 'string' || config.awsRegion.trim() === '') {
      throw new Error('Configuration property "awsRegion" must be a non-empty string');
    }

    if (typeof config.logLevel !== 'string' || config.logLevel.trim() === '') {
      throw new Error('Configuration property "logLevel" must be a non-empty string');
    }
  }
}
