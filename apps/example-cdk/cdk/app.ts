#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { getConfig } from '@rapid/config';
import { ExampleCdkStack } from './stacks/ExampleCdkStack';
import { configs } from './config';

const app = new cdk.App();

// Get stage from context or default to 'dev'
const stage = (app.node.tryGetContext('stage') as string | undefined) || 'dev';

// Get configuration controller for the stage
const configCtrl = getConfig(configs, stage);

new ExampleCdkStack(app, `ExampleCdkStack-${configCtrl.get('stage')}`, {
  env: {
    account: configCtrl.get('awsAccountId'),
    region: configCtrl.get('awsRegion'),
  },
  configCtrl,
  tags: {
    Project: configCtrl.get('project'),
    Environment: configCtrl.get('stage'),
    ...Object.fromEntries(configCtrl.get('tags')?.map(tag => [tag.key, tag.value]) || []),
  },
});

app.synth();
