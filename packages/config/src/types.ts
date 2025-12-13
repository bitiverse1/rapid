import type { Tag } from '@rapid/types';
import type { AWSRegionType, LogLevelType } from '@rapid/constants';

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
  awsRegion: AWSRegionType;

  /**
   * Logging level
   */
  logLevel: LogLevelType;

  /**
   * Optional tags to apply to resources
   */
  tags?: Tag[];
}
