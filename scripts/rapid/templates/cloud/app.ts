#!/usr/bin/env node
// @ts-nocheck - This is a template file with placeholders
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { getConfig } from '@rapid/config';
import { __STACK_CLASS__ } from './stacks/__STACK_CLASS__Stack';
import { configs } from './config';

const app = new cdk.App();

// Get stage from context or default to 'dev'
const stage = (app.node.tryGetContext('stage') as string | undefined) || 'dev';

// Get configuration controller for the stage
const configCtrl = getConfig(configs, stage);

new __STACK_CLASS__(app, `__STACK_CLASS__-${configCtrl.get('stage')}`, {
  env: configCtrl.get('awsAccountId')
    ? {
        account: configCtrl.get('awsAccountId'),
        region: configCtrl.get('awsRegion'),
      }
    : undefined,
  configCtrl,
  tags: {
    Project: configCtrl.get('project'),
    Environment: configCtrl.get('stage'),
    ...Object.fromEntries(
      configCtrl.get('tags')?.map((tag) => [tag.key, tag.value]) || []
    ),
  },
});

app.synth();
