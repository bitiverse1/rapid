import { devConfig } from './dev.config';
import { prodConfig } from './prod.config';
import type { UserServiceConfig } from './types';

/**
 * Get configuration based on stage environment variable
 */
export function getConfig(stage?: string): UserServiceConfig {
  const env = stage || process.env.STAGE || process.env.CDK_DEPLOY_STAGE || 'dev';

  const configs: Record<string, UserServiceConfig> = {
    dev: devConfig,
    development: devConfig,
    prod: prodConfig,
    production: prodConfig,
  };

  const config = configs[env];

  if (!config) {
    throw new Error(
      `No configuration found for stage: ${env}. Available stages: ${Object.keys(configs).join(', ')}`
    );
  }

  return config;
}
