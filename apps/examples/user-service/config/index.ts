import { ConfigController, getConfig as getConfigBase } from '@rapid/config';

import { devConfig } from './dev.config';
import { prodConfig } from './prod.config';
import type { UserServiceConfig } from './types';

/**
 * Get configuration controller for user-service
 */
export function getConfig(stage?: string): ConfigController<UserServiceConfig> {
  return getConfigBase<UserServiceConfig>(
    {
      dev: devConfig,
      development: devConfig,
      prod: prodConfig,
      production: prodConfig,
    },
    stage
  );
}
