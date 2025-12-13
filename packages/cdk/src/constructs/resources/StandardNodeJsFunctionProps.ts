import { Construct } from 'constructs';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import { BaseConfig, ConfigController } from '@rapid/config';

export interface StandardNodeJsFunctionProps extends NodejsFunctionProps {
  configCtrl: ConfigController<BaseConfig>;
  functionName: string;
  description: string;
}

export class StandardNodeJsFunction extends NodejsFunction {
  constructor(
    scope: Construct,
    id: string,
    props: StandardNodeJsFunctionProps
  ) {
    const { functionName, description, environment, configCtrl, ...rest } =
      props;
    super(scope, id, {
      functionName,
      description,

      environment: {
        ...environment,
        LOG_LEVEL: configCtrl.get('logLevel'),
        STAGE: configCtrl.get('stage'),
      },
      ...rest,
    });
  }
}
