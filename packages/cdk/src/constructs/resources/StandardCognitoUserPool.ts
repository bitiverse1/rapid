import { Construct } from 'constructs';
import {
  FeaturePlan,
  PasskeyUserVerification,
  UserPool,
  UserPoolProps,
} from 'aws-cdk-lib/aws-cognito';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';

export interface StandardCognitoUserPoolProps extends UserPoolProps {
  userPoolName: string;
}

export class StandardCognitoUserPool extends UserPool {
  constructor(
    scope: Construct,
    id: string,
    props: StandardCognitoUserPoolProps
  ) {
    const { userPoolName, ...rest } = props;
    super(scope, id, {
      userPoolName,
      deletionProtection: false,
      featurePlan: FeaturePlan.ESSENTIALS,
      passkeyUserVerification: PasskeyUserVerification.REQUIRED,
      passwordPolicy: {
        minLength: 12,
        passwordHistorySize: 5,
        requireDigits: true,
        requireLowercase: true,
        requireSymbols: true,
        requireUppercase: true,
        tempPasswordValidity: Duration.days(3),
      },
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
        phone: false,
        username: false,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      ...rest,
    });
  }
}
