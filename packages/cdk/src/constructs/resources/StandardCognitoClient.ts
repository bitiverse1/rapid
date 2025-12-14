import { Construct } from 'constructs';
import {
  UserPool,
  UserPoolClient,
  UserPoolClientProps,
} from 'aws-cdk-lib/aws-cognito';
import { Duration } from 'aws-cdk-lib';

export interface StandardCognitoClientProps extends UserPoolClientProps {
  userPoolClientName: string;
  userPool: UserPool;
}

export class StandardCognitoClient extends UserPoolClient {
  constructor(scope: Construct, id: string, props: StandardCognitoClientProps) {
    const { userPoolClientName, userPool, ...rest } = props;
    super(scope, id, {
      userPool,
      userPoolClientName,
      accessTokenValidity: Duration.days(1),
      idTokenValidity: Duration.days(1),
      refreshTokenValidity: Duration.days(30),
      authFlows: {
        user: true,
        userPassword: true,
        userSrp: true,
      },
      authSessionValidity: Duration.minutes(3),
      preventUserExistenceErrors: true,
      ...rest,
    });
  }
}
