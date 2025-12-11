import type { AWSRegion, LogLevel } from '@rapid/constants';

/**
 * Base configuration that all app configs must extend
 */
export interface BaseConfig {
  /**
   * Deployment stage (e.g., 'dev', 'staging', 'prod')
   */
  stage: string;

  /**
   * Project name
   */
  project: string;

  /**
   * AWS Account ID for deployment
   */
  awsAccountId: string;

  /**
   * AWS Region for deployment
   */
  awsRegion: AWSRegion;

  /**
   * Logging level
   */
  logLevel: LogLevel;
}

/**
 * App-specific config extends BaseConfig with additional properties
 */
export type AppConfig = BaseConfig;
