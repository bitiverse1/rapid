import { AWS_REGIONS, LOG_LEVELS } from '@rapid/constants';

import type { UserServiceConfig } from './types';

/**
 * Development configuration for user-service
 */
export const devConfig: UserServiceConfig = {
  // Base config properties (required)
  stage: 'dev',
  project: 'user-service',
  awsAccountId: '123456789012',
  awsRegion: AWS_REGIONS.US_EAST_1,
  logLevel: LOG_LEVELS.DEBUG,

  // Database Configuration
  userTableName: 'user-service-dev-users',
  userTableReadCapacity: 5,
  userTableWriteCapacity: 5,
  
  // Authentication
  jwtSecret: 'dev-secret-key-change-in-production',
  jwtExpirationMinutes: 60,
  
  // Email Service
  emailServiceUrl: 'https://email-dev.example.com',
  emailFromAddress: 'noreply-dev@example.com',
  
  // Rate Limiting
  maxLoginAttempts: 5,
  lockoutDurationMinutes: 30,
  
  // App-specific Settings
  app1SpecificSetting: 'This is specific to user-service',
  app1MaxUsers: 1000,
  app1EnableNotifications: true,
};
