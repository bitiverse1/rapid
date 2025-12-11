#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ConfigController } from '@rapid/config';
import { ExampleStack } from '../lib/example-stack';
import { getConfig } from '../config';
import type { ExampleAppConfig } from '../config/types';

const app = new cdk.App();

// Get stage from context or environment
const stage = (app.node.tryGetContext('stage') as string | undefined) || process.env.STAGE || 'dev';

// Load configuration for the stage
const config = getConfig(stage);

// Create ConfigController with strongly-typed config
const configCtrl = new ConfigController<ExampleAppConfig>(config);

// Create stack with configuration
new ExampleStack(app, `${configCtrl.get('project')}-${configCtrl.get('stage')}`, {
  configCtrl,
  env: {
    account: configCtrl.get('awsAccountId'),
    region: configCtrl.get('awsRegion'),
  },
  description: `Example application stack for ${configCtrl.get('stage')} environment`,
  tags: {
    Project: configCtrl.get('project'),
    Stage: configCtrl.get('stage'),
    ManagedBy: 'Rapid',
  },
});

app.synth();
