import { Construct } from 'constructs';
import {
  RestApi,
  RestApiProps,
  EndpointType,
} from 'aws-cdk-lib/aws-apigateway';

export interface StandardAPIGWRestApiProps extends RestApiProps {
  restApiName: string;
}

export class StandardAPIGWRestApi extends RestApi {
  constructor(scope: Construct, id: string, props: StandardAPIGWRestApiProps) {
    const { restApiName, ...rest } = props;
    super(scope, id, {
      restApiName,
      description: rest.description || `REST API for ${restApiName}`,
      deploy: true,
      retainDeployments: false,
      deployOptions: {
        stageName: rest.deployOptions?.stageName || 'api',
        description: rest.deployOptions?.description || 'Production deployment',
        throttlingBurstLimit: rest.deployOptions?.throttlingBurstLimit || 5000,
        throttlingRateLimit: rest.deployOptions?.throttlingRateLimit || 10000,
        tracingEnabled: rest.deployOptions?.tracingEnabled ?? false,
      },
      endpointConfiguration: rest.endpointConfiguration || {
        types: [EndpointType.REGIONAL],
      },
      defaultCorsPreflightOptions: rest.defaultCorsPreflightOptions, // CORS configuration (disabled by default, enable per resource)
      defaultMethodOptions: {
        apiKeyRequired: rest.defaultMethodOptions?.apiKeyRequired ?? false,
        authorizationType:
          rest.defaultMethodOptions?.authorizationType || undefined,
        ...rest.defaultMethodOptions,
      },
      ...rest,
    });
  }
}
