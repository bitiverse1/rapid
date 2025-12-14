#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { getConfig } from '@rapid/config';
import { GlobalCognito } from './stacks/GlobalCognitoStack';
import { configs } from './config';

const app = new cdk.App();

// Get stage from context or default to 'dev'
const stage = (app.node.tryGetContext('stage') as string | undefined) || 'dev';

// Get configuration controller for the stage
const configCtrl = getConfig(configs, stage);

new GlobalCognito(app, configCtrl.prefix(), {
  env: {
    account: configCtrl.get('awsAccountId'),
    region: configCtrl.get('awsRegion'),
  },
  configCtrl,
});

// Tag all resources across all stacks, nested stacks, and constructs in the app
cdk.Tags.of(app).add('Project', configCtrl.get('project'));
cdk.Tags.of(app).add('Environment', configCtrl.get('stage'));
cdk.Tags.of(app).add('ManagedBy', 'CDK');

app.synth();
