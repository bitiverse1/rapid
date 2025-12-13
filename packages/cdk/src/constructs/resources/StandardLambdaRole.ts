import { Construct } from 'constructs';
import { Role, RoleProps, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { SERVICE_PRINCIPALS } from '@rapid/constants';

export interface StandardLambdaRoleProps extends RoleProps {
  roleName: string;
}

export class StandardLambdaRole extends Role {
  constructor(scope: Construct, id: string, props: StandardLambdaRoleProps) {
    const { roleName, assumedBy, ...rest } = props;
    super(scope, id, {
      roleName,
      assumedBy: assumedBy ?? new ServicePrincipal(SERVICE_PRINCIPALS.LAMBDA),
      ...rest,
    });
  }
}
