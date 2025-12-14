import { Construct } from 'constructs';
import { NestedStack } from 'aws-cdk-lib';
import { BaseNestedStackProps } from '../../types';
import { patterns as l3 } from '../../constructs';

export interface CognitoAuthStackProps extends BaseNestedStackProps {}

export class CognitoAuthStack extends NestedStack {
  public cognito: l3.CognitoWithPassKey;

  constructor(scope: Construct, id: string, props: CognitoAuthStackProps) {
    super(scope, id);

    this.cognito = new l3.CognitoWithPassKey(this, 'CognitoWithPassKey', {
      userPoolProps: {
        userPoolName: `${props.configCtrl.prefix()}-user-pool`,
      },
      defaultClientName: `${props.configCtrl.prefix()}-client`,
    });
  }
}
