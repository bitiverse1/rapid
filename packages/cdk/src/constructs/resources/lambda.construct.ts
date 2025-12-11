import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface RapidLambdaProps extends lambda.FunctionProps {
  /**
   * Optional description for the Lambda function
   */
  description?: string;

  /**
   * Log retention period (default: 7 days)
   */
  logRetention?: logs.RetentionDays;

  /**
   * Enable X-Ray tracing (default: true)
   */
  enableTracing?: boolean;
}

/**
 * L2 Construct: Custom Lambda function with organization defaults
 */
export class RapidLambda extends lambda.Function {
  constructor(scope: Construct, id: string, props: RapidLambdaProps) {
    const {
      logRetention = logs.RetentionDays.ONE_WEEK,
      enableTracing = true,
      runtime = lambda.Runtime.NODEJS_20_X,
      timeout = cdk.Duration.seconds(30),
      memorySize = 512,
      environment,
      ...restProps
    } = props;

    super(scope, id, {
      ...restProps,
      runtime,
      timeout,
      memorySize,
      tracing: enableTracing
        ? lambda.Tracing.ACTIVE
        : lambda.Tracing.DISABLED,
      logRetention,
      environment: {
        NODE_ENV: 'production',
        ...environment,
      },
    });

    // Add tags
    cdk.Tags.of(this).add('ManagedBy', 'Rapid');
    cdk.Tags.of(this).add('Component', 'Lambda');
  }
}
