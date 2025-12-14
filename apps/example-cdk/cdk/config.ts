import { AWS_REGIONS, LOG_LEVELS } from '@rapid/constants';
import type { AppConfig } from './types';

export const configs: Record<string, AppConfig> = {
  dev: {
    stage: 'dev',
    project: 'example-cdk',
    awsAccountId: '012345678901',
    awsRegion: AWS_REGIONS.US_WEST_2,
    logLevel: LOG_LEVELS.INFO,
    tags: [
      { key: 'Application', value: 'example-cdk' },
      { key: 'ManagedBy', value: 'CDK' },
    ],
  },
  test: {
    stage: 'test',
    project: 'example-cdk',
    awsAccountId: '012345678901',
    awsRegion: AWS_REGIONS.US_WEST_2,
    logLevel: LOG_LEVELS.INFO,
    tags: [
      { key: 'Application', value: 'example-cdk' },
      { key: 'ManagedBy', value: 'CDK' },
    ],
  },
  prod: {
    stage: 'prod',
    project: 'example-cdk',
    awsAccountId: '012345678901',
    awsRegion: AWS_REGIONS.US_WEST_2,
    logLevel: LOG_LEVELS.INFO,
    tags: [
      { key: 'Application', value: 'example-cdk' },
      { key: 'ManagedBy', value: 'CDK' },
    ],
  },
};
