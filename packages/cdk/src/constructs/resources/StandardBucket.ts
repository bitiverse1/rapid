import { Construct } from 'constructs';
import { BlockPublicAccess, Bucket, BucketProps } from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';

export interface StandardBucketProps extends BucketProps {
  bucketName: string;
}

export class StandardBucket extends Bucket {
  constructor(scope: Construct, id: string, props: StandardBucketProps) {
    const { bucketName, ...rest } = props;
    super(scope, id, {
      bucketName,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      ...rest,
    });
  }
}
