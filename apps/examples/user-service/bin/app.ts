#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { getConfig } from '../config';
import { UserServiceStack } from '../lib/user-service-stack';

/**
 * CDK App entry point for user-service
 *
 * This demonstrates:
 * 1. Loading app-specific strongly-typed configuration
 * 2. Getting ConfigController from getConfig()
 * 3. Passing configCtrl to stacks for centralized config access
 */
const app = new cdk.App();

// Get the stage from CDK context or environment
const stage =
  (app.node.tryGetContext('stage') as string | undefined) ||
  process.env.STAGE ||
  'dev';

// Get ConfigController for this stage
const configCtrl = getConfig(stage);

// Create stack and pass configCtrl
new UserServiceStack(app, `UserServiceStack-${stage}`, {
  configCtrl,
  env: {
    account: configCtrl.get('awsAccountId'),
    region: configCtrl.get('awsRegion'),
  },
  description: `User Service Stack for ${stage} environment`,
});

app.synth();
