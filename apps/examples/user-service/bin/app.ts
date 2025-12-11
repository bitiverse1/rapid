#!/usr/bin/env node
import { ConfigController } from '@rapid/config';
import * as cdk from 'aws-cdk-lib';


import { getConfig } from '../config';
import type { UserServiceConfig } from '../config/types';
import { UserServiceStack } from '../lib/user-service-stack';

/**
 * CDK App entry point for user-service
 * 
 * This demonstrates:
 * 1. Loading app-specific strongly-typed configuration
 * 2. Creating ConfigController with the typed config
 * 3. Passing configCtrl to stacks for centralized config access
 */
const app = new cdk.App();

// Get the stage from CDK context or environment
const stage = (app.node.tryGetContext('stage') as string | undefined) || process.env.STAGE || 'dev';

// Load strongly-typed configuration for this app
const config = getConfig(stage);

// Create ConfigController with typed config
const configCtrl = new ConfigController<UserServiceConfig>(config);

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
