#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { getConfig } from '../config';
import { ExampleStack } from '../lib/example-stack';

const app = new cdk.App();

// Get stage from context or environment
const stage =
  (app.node.tryGetContext('stage') as string | undefined) ||
  process.env.STAGE ||
  'dev';

// Get ConfigController for this stage
const configCtrl = getConfig(stage);

// Create stack with configuration
new ExampleStack(
  app,
  `${configCtrl.get('project')}-${configCtrl.get('stage')}`,
  {
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
  }
);

app.synth();
