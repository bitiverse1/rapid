import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import type { ConfigController } from '@rapid/config';
import type { AppConfig } from '../types';

export interface ExampleReactMuiStackProps extends cdk.StackProps {
  configCtrl: ConfigController<AppConfig>;
}

export class ExampleReactMuiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ExampleReactMuiStackProps) {
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
