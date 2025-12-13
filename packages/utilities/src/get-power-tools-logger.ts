import { Context } from 'aws-lambda';
import { LogLevel } from '@aws-lambda-powertools/logger/lib/cjs/types/Logger';
import { Logger } from '@aws-lambda-powertools/logger';
import { getEnvVar } from './get-env-var';

export function getPowerToolsLogger(
  event: unknown,
  context: Context,
  serviceName: string
) {
  const logger = new Logger({
    serviceName,
    logLevel: getEnvVar('LOG_LEVEL', 'DEBUG') as unknown as LogLevel,
  });
  logger.addContext(context);
  logger.debug('Event', { event });
  return logger;
}
