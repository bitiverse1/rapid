import { AWS_REGIONS, LOG_LEVELS } from '@rapid/constants';

import type { UserServiceConfig } from './types';

/**
 * Production configuration for user-service
 */
export const prodConfig: UserServiceConfig = {
  // Base config properties (required)
  stage: 'prod',
  project: 'user-service',
  awsAccountId: '987654321098',
  awsRegion: AWS_REGIONS.US_EAST_1,
  logLevel: LOG_LEVELS.INFO,

  // Database Configuration
  userTableName: 'user-service-prod-users',
  userTableReadCapacity: 25,
  userTableWriteCapacity: 25,
  
  // Authentication
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpirationMinutes: 30,
  
  // Email Service
  emailServiceUrl: 'https://email.example.com',
  emailFromAddress: 'noreply@example.com',
  
  // Rate Limiting
  maxLoginAttempts: 3,
  lockoutDurationMinutes: 60,
  
  // App-specific Settings
  app1SpecificSetting: 'Production setting for user-service',
  app1MaxUsers: 100000,
  app1EnableNotifications: true,
};
