import { BaseConfig } from './types';
import { ConfigController } from './config-controller';

export function getConfig<T extends BaseConfig>(
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
