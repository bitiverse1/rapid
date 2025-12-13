import { AWS_REGIONS, LOG_LEVELS } from '@rapid/constants';
import type { AppConfig } from './types';

export const configs: Record<string, AppConfig> = {
  dev: {
    stage: 'dev',
    project: 'my-app-123',
    awsAccountId: process.env.AWS_ACCOUNT_ID || '',
    awsRegion: AWS_REGIONS.US_EAST_1,
    logLevel: LOG_LEVELS.INFO,
    tags: [
      { key: 'Application', value: 'my-app-123' },
      { key: 'ManagedBy', value: 'CDK' },
    ],
  },
  test: {
    stage: 'test',
    project: 'my-app-123',
    awsAccountId: process.env.AWS_ACCOUNT_ID || '',
    awsRegion: AWS_REGIONS.US_EAST_1,
    logLevel: LOG_LEVELS.INFO,
    tags: [
      { key: 'Application', value: 'my-app-123' },
      { key: 'ManagedBy', value: 'CDK' },
    ],
  },
  prod: {
    stage: 'prod',
    project: 'my-app-123',
    awsAccountId: process.env.AWS_ACCOUNT_ID || '',
    awsRegion: AWS_REGIONS.US_EAST_1,
    logLevel: LOG_LEVELS.INFO,
    tags: [
      { key: 'Application', value: 'my-app-123' },
      { key: 'ManagedBy', value: 'CDK' },
    ],
  },
};
