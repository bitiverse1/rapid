import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import type { ConfigController } from '@rapid/config';
import type { AppConfig } from '../types';

export interface ExampleCdkStackProps extends cdk.StackProps {
  configCtrl: ConfigController<AppConfig>;
}

export class ExampleCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ExampleCdkStackProps) {
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
