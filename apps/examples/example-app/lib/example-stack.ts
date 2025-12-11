import { RapidLambda } from '@rapid/cdk';
import { ConfigController } from '@rapid/config';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import type { ExampleAppConfig } from '../config/types';


export interface ExampleStackProps extends cdk.StackProps {
  configCtrl: ConfigController<ExampleAppConfig>;
}

/**
 * Example CDK Stack demonstrating config usage
 */
export class ExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ExampleStackProps) {
    super(scope, id, props);

    const { configCtrl } = props;

    // Access base config properties
    const stage = configCtrl.get('stage');
    const project = configCtrl.get('project');
    const logLevel = configCtrl.get('logLevel');

    // Access app-specific properties
    const tableName = configCtrl.get('databaseTableName');
    const enableCaching = configCtrl.get('enableCaching');
    const apiUrl = configCtrl.get('apiUrl');

    // Create DynamoDB table
    const table = new dynamodb.Table(this, 'Table', {
      tableName,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    // Create Lambda function using custom construct
    const exampleLambda = new RapidLambda(this, 'ExampleFunction', {
      functionName: `${project}-${stage}-example`,
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Event:', JSON.stringify(event, null, 2));
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Hello from ${project}!' })
          };
        };
      `),
      environment: {
        STAGE: stage,
        PROJECT: project,
        LOG_LEVEL: logLevel,
        TABLE_NAME: tableName,
        ENABLE_CACHING: enableCaching.toString(),
        API_URL: apiUrl,
      },
    });

    // Grant Lambda permissions to access DynamoDB
    table.grantReadWriteData(exampleLambda);

    // Output configuration values
    new cdk.CfnOutput(this, 'Stage', { value: stage });
    new cdk.CfnOutput(this, 'Project', { value: project });
    new cdk.CfnOutput(this, 'TableName', { value: table.tableName });
    new cdk.CfnOutput(this, 'FunctionName', { value: exampleLambda.functionName });
  }
}
