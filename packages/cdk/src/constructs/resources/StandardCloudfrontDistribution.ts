import { Construct } from 'constructs';
import {
  Distribution,
  DistributionProps,
  PriceClass,
  SecurityPolicyProtocol,
  HttpVersion,
} from 'aws-cdk-lib/aws-cloudfront';
import { Duration } from 'aws-cdk-lib';
import { HTTP_STATUS } from '@rapid/constants';

export interface StandardCloudfrontDistributionProps extends DistributionProps {
  comment: string;
}

export class StandardCloudfrontDistribution extends Distribution {
  constructor(
    scope: Construct,
    id: string,
    props: StandardCloudfrontDistributionProps
  ) {
    const { comment, ...rest } = props;

    super(scope, id, {
      comment: comment || `CloudFront Distribution for ${id}`,
      priceClass: PriceClass.PRICE_CLASS_100,
      enableIpv6: true,
      httpVersion: HttpVersion.HTTP3,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_3_2025,
      enableLogging: false,
      defaultRootObject: 'index.html',
      enabled: true,
      errorResponses: [
        {
          httpStatus: HTTP_STATUS.FORBIDDEN,
          responseHttpStatus: HTTP_STATUS.OK,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(5),
        },
        {
          httpStatus: HTTP_STATUS.NOT_FOUND,
          responseHttpStatus: HTTP_STATUS.OK,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(5),
        },
      ],
      ...rest,
    });
  }
}
