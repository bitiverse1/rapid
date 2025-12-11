import type { BaseConfig } from '@rapid/config';

/**
 * Strongly-typed configuration for user-service
 * This enables TypeScript autocomplete for configCtrl.get()
 */
export interface UserServiceConfig extends BaseConfig {
  // Database Configuration
  userTableName: string;
  userTableReadCapacity: number;
  userTableWriteCapacity: number;
  
  // Authentication
  jwtSecret: string;
  jwtExpirationMinutes: number;
  
  // Email Service
  emailServiceUrl: string;
  emailFromAddress: string;
  
  // Rate Limiting
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  
  // App-specific Settings
  app1SpecificSetting: string;
  app1MaxUsers: number;
  app1EnableNotifications: boolean;
}
