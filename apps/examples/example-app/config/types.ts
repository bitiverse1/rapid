import type { BaseConfig } from '@rapid/config';

/**
 * Strongly-typed configuration for example-app
 * This enables TypeScript autocomplete for configCtrl.get()
 */
export interface ExampleAppConfig extends BaseConfig {
  // API Configuration
  apiUrl: string;
  apiTimeout?: number;

  // Database Configuration
  databaseTableName: string;
  
  // Caching Configuration
  enableCaching: boolean;
  cacheTTL?: number;
  
  // Performance Settings
  maxConcurrentRequests: number;
  
  // Storage Configuration
  bucketName: string;
  
  // Feature Flags
  features: {
    enableNewUI: boolean;
    enableAnalytics: boolean;
  };
}
