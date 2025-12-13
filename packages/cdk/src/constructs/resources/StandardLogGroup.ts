import { Construct } from 'constructs';
import {
  LogGroup,
  LogGroupClass,
  LogGroupProps,
  RetentionDays,
} from 'aws-cdk-lib/aws-logs';
import { RemovalPolicy } from 'aws-cdk-lib';

export interface StandardLogGroupProps extends LogGroupProps {
  logGroupName: string;
}

export class StandardLogGroup extends LogGroup {
  constructor(scope: Construct, id: string, props: StandardLogGroupProps) {
    const { logGroupName, ...rest } = props;
    super(scope, id, {
      logGroupName,
      retention: RetentionDays.THREE_MONTHS,
      removalPolicy: RemovalPolicy.DESTROY,
      logGroupClass: LogGroupClass.STANDARD,
      ...rest,
    });
  }
}
