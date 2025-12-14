import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { TIMEOUT_SECONDS } from '@rapid/constants';
import type { ConfigController } from '@rapid/config';
import { stacks } from '@rapid/cdk';
import type { AppConfig } from '../types';

export interface GlobalCognitoProps extends cdk.StackProps {
  configCtrl: ConfigController<AppConfig>;
}

export class GlobalCognito extends cdk.Stack {
  public readonly globalCognitoNestedStack: stacks.nested.CognitoAuthStack;

  constructor(scope: Construct, id: string, props: GlobalCognitoProps) {
    super(scope, id, props);
    const { configCtrl } = props;

    this.globalCognitoNestedStack = new stacks.nested.CognitoAuthStack(
      this,
      'auth',
      {
        configCtrl,
        description: `Global Cognito Auth Stack for ${configCtrl.get('project')}-${configCtrl.get('stage')}`,
        timeout: cdk.Duration.seconds(TIMEOUT_SECONDS.FIFTEEN_MINUTES),
      }
    );
  }
}
