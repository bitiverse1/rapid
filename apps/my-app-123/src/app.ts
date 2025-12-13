#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { getConfig } from '@rapid/config';
import { MyApp123Stack } from './stacks/MyApp123Stack';
import { configs } from './config/config';

const app = new cdk.App();

// Get environment from context or default to 'dev'
const environment = (app.node.tryGetContext('environment') as string | undefined) || 'dev';

// Get configuration controller for the environment
const configCtrl = getConfig(configs, environment);

new MyApp123Stack(app, `MyApp123Stack-${configCtrl.get('stage')}`, {
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
