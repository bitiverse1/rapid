import type { AppConfig } from './types';
import { ConfigController } from './config-controller';

/**
 * Generic configuration loader that creates a ConfigController
 *
 * @param configs - Map of stage names to configuration objects
 * @param stage - Optional stage override (defaults to env vars)
 * @returns ConfigController instance with the loaded configuration
 *
 * @example
 * ```typescript
 * import { getConfig } from '@rapid/config';
 * import { devConfig } from './dev.config';
 * import { prodConfig } from './prod.config';
 *
 * const configCtrl = getConfig({
 *   dev: devConfig,
 *   prod: prodConfig
 * });
 * ```
 */
export function getConfig<T extends AppConfig>(
  configs: Record<string, T>,
  stage?: string
): ConfigController<T> {
  const env =
    stage || process.env.STAGE || process.env.CDK_DEPLOY_STAGE || 'dev';

  const config = configs[env];

  if (!config) {
    throw new Error(
      `No configuration found for stage "${env}". Available stages: ${Object.keys(configs).join(', ')}`
    );
  }

  return new ConfigController<T>(config);
}
