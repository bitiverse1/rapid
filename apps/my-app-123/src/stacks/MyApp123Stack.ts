import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import type { ConfigController } from '@rapid/config';
import type { AppConfig } from '../config/types';

export interface MyApp123StackProps extends cdk.StackProps {
  configCtrl: ConfigController<AppConfig>;
}

export class MyApp123Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MyApp123StackProps) {
    super(scope, id, props);

    const { configCtrl } = props;

    // TODO: Add your AWS resources here
    
    // Example: Output the stage
    new cdk.CfnOutput(this, 'Stage', {
      value: configCtrl.get('stage'),
      description: 'Deployment stage',
    });
  }
}
