import { Construct } from 'constructs';
import {
  StandardNodeJsFunction,
  StandardNodeJsFunctionProps,
} from '../resources/StandardNodeJsFunctionProps';
import {
  StandardLogGroup,
  StandardLogGroupProps,
} from '../resources/StandardLogGroup';
import {
  StandardLambdaRole,
  StandardLambdaRoleProps,
} from '../resources/StandardLambdaRole';

export interface NodeJsLambdaWithLogGroupProps {
  lambdaProps: StandardNodeJsFunctionProps;
  roleProps: Omit<StandardLambdaRoleProps, 'roleName'>;
  logGroupProps: Omit<StandardLogGroupProps, 'logGroupName'>;
}

export class NodeJsLambdaWithLogGroup extends Construct {
  public readonly logGroup: StandardLogGroup;
  public readonly role: StandardLambdaRole;
  public readonly lambda;

  constructor(
    scope: Construct,
    id: string,
    private props: NodeJsLambdaWithLogGroupProps
  ) {
    super(scope, id);
    this.logGroup = this.createLogGroup();
    this.role = this.createRole();
    this.lambda = this.createLambda();
    this.logGroup.grantWrite(this.role);
  }

  private createLogGroup(): StandardLogGroup {
    const { logGroupProps, lambdaProps } = this.props;
    const logGroup = new StandardLogGroup(this, 'LogGroup', {
      logGroupName: `/aws/lambda/${lambdaProps.functionName}`,
      ...logGroupProps,
    });
    return logGroup;
  }

  private createRole() {
    const { roleProps, lambdaProps } = this.props;
    const role = new StandardLambdaRole(this, 'LambdaRole', {
      roleName: `${lambdaProps.functionName}-role`,
      ...roleProps,
    });
    return role;
  }

  private createLambda() {
    const { lambdaProps } = this.props;
    const lambda = new StandardNodeJsFunction(this, 'LambdaFunction', {
      ...lambdaProps,
      role: this.role,
      logGroup: this.logGroup,
    });
    return lambda;
  }
}
