import { AWS_REGIONS, LOG_LEVELS } from '@rapid/constants';

import type { ExampleAppConfig } from './types';

/**
 * Development configuration for example-app
 */
export const devConfig: ExampleAppConfig = {
  // Base config properties (required)
  stage: 'dev',
  project: 'example-app',
  awsAccountId: '123456789012',
  awsRegion: AWS_REGIONS.US_EAST_1,
  logLevel: LOG_LEVELS.DEBUG,

  // App-specific properties
  apiUrl: 'https://api-dev.example.com',
  databaseTableName: 'example-app-dev-table',
  enableCaching: true,
  cacheTTL: 60,
  maxConcurrentRequests: 10,
  bucketName: 'example-app-dev-bucket',
  
  // Feature flags
  features: {
    enableNewUI: false,
    enableAnalytics: false,
  },
};
