import { ConfigController, getConfig as getConfigBase } from '@rapid/config';

import { devConfig } from './dev.config';
import { prodConfig } from './prod.config';
import type { ExampleAppConfig } from './types';

/**
 * Get configuration controller for example-app
 */
export function getConfig(stage?: string): ConfigController<ExampleAppConfig> {
  return getConfigBase<ExampleAppConfig>(
    {
      dev: devConfig,
      development: devConfig,
      prod: prodConfig,
      production: prodConfig,
    },
    stage
  );
}
