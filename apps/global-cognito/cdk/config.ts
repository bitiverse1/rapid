import { Tag } from '@rapid/types';
import { AWS_REGIONS, LOG_LEVELS } from '@rapid/constants';
import type { AppConfig } from './types';

const PROJECT_NAME = 'global-cognito';

const TAGS: Tag[] = [
  { key: 'Application', value: PROJECT_NAME },
  { key: 'ManagedBy', value: 'CDK' },
  { key: 'Stage', value: 'dev' },
];

export const configs: Record<string, AppConfig> = {
  dev: {
    stage: 'dev',
    project: PROJECT_NAME,
    awsAccountId: '012345678901',
    awsRegion: AWS_REGIONS.US_WEST_2,
    logLevel: LOG_LEVELS.INFO,
    tags: TAGS,
  },
  test: {
    stage: 'test',
    project: PROJECT_NAME,
    awsAccountId: '012345678901',
    awsRegion: AWS_REGIONS.US_WEST_2,
    logLevel: LOG_LEVELS.INFO,
    tags: TAGS.map((tag) =>
      tag.key === 'Stage' ? { ...tag, value: 'test' } : tag
    ),
  },
  prod: {
    stage: 'prod',
    project: PROJECT_NAME,
    awsAccountId: '012345678901',
    awsRegion: AWS_REGIONS.US_WEST_2,
    logLevel: LOG_LEVELS.INFO,
    tags: TAGS.map((tag) =>
      tag.key === 'Stage' ? { ...tag, value: 'prod' } : tag
    ),
  },
};
