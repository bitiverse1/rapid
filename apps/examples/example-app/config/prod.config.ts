import { AWS_REGIONS, LOG_LEVELS } from '@rapid/constants';

import type { ExampleAppConfig } from './types';

/**
 * Production configuration for example-app
 */
export const prodConfig: ExampleAppConfig = {
  // Base config properties (required)
  stage: 'prod',
  project: 'example-app',
  awsAccountId: '987654321098',
  awsRegion: AWS_REGIONS.US_EAST_1,
  logLevel: LOG_LEVELS.INFO,

  // App-specific properties
  apiUrl: 'https://api.example.com',
  databaseTableName: 'example-app-prod-table',
  enableCaching: true,
  cacheTTL: 300,
  maxConcurrentRequests: 100,
  bucketName: 'example-app-prod-bucket',
  
  // Feature flags
  features: {
    enableNewUI: true,
    enableAnalytics: true,
  },
};
