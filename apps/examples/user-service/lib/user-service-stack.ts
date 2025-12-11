import { RapidLambda } from '@rapid/cdk';
import { ConfigController } from '@rapid/config';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';


import type { UserServiceConfig } from '../config/types';

export interface UserServiceStackProps extends cdk.StackProps {
  configCtrl: ConfigController<UserServiceConfig>;
}

/**
 * User Service CDK Stack
 * 
 * When you type configCtrl.get('app1') you'll see autocomplete suggestions:
 * - app1SpecificSetting
 * - app1MaxUsers
 * - app1EnableNotifications
 */
export class UserServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: UserServiceStackProps) {
    super(scope, id, props);

    const { configCtrl } = props;

    // Access base config properties with autocomplete
    const stage = configCtrl.get('stage');
    const project = configCtrl.get('project');
    const logLevel = configCtrl.get('logLevel');

    // Access user-service specific properties with autocomplete
    // Try typing: configCtrl.get('app1') - you'll see all app1* properties
    const userTableName = configCtrl.get('userTableName');
    const app1Setting = configCtrl.get('app1SpecificSetting');
    const app1MaxUsers = configCtrl.get('app1MaxUsers');
    const maxLoginAttempts = configCtrl.get('maxLoginAttempts');
    const jwtExpirationMinutes = configCtrl.get('jwtExpirationMinutes');

    // Create DynamoDB table for users
    const userTable = new dynamodb.Table(this, 'UserTable', {
      tableName: userTableName,
      partitionKey: {
        name: 'userId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: configCtrl.get('userTableReadCapacity'),
      writeCapacity: configCtrl.get('userTableWriteCapacity'),
      removalPolicy: stage === 'prod' 
        ? cdk.RemovalPolicy.RETAIN 
        : cdk.RemovalPolicy.DESTROY,
    });

    // Create authentication Lambda
    const authLambda = new RapidLambda(this, 'AuthFunction', {
      functionName: `${project}-${stage}-auth`,
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          return {
            statusCode: 200,
            body: JSON.stringify({ 
              message: 'Auth function',
              maxLoginAttempts: ${maxLoginAttempts},
              jwtExpiration: ${jwtExpirationMinutes}
            })
          };
        };
      `),
      environment: {
        USER_TABLE_NAME: userTableName,
        JWT_EXPIRATION_MINUTES: jwtExpirationMinutes.toString(),
        MAX_LOGIN_ATTEMPTS: maxLoginAttempts.toString(),
        LOG_LEVEL: logLevel,
        APP1_SETTING: app1Setting,
        APP1_MAX_USERS: app1MaxUsers.toString(),
      },
    });

    // Grant Lambda permissions to access the table
    userTable.grantReadWriteData(authLambda);

    // Stack outputs
    new cdk.CfnOutput(this, 'Stage', { value: stage });
    new cdk.CfnOutput(this, 'Project', { value: project });
    new cdk.CfnOutput(this, 'UserTableName', { value: userTable.tableName });
    new cdk.CfnOutput(this, 'AuthFunctionName', { value: authLambda.functionName });
    new cdk.CfnOutput(this, 'App1Setting', { value: app1Setting });
  }
}
