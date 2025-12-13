// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// Order Status
export const ORDER_STATUS: Record<string, string> = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
};

// User Status
export const USER_STATUS: Record<string, string> = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
};

// Error Codes
export const ERROR_CODES: Record<string, string> = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
};

// AWS Region
export const AWS_REGIONS: Record<string, string> = {
  US_EAST_1: 'us-east-1',
  US_WEST_2: 'us-west-2',
  EU_WEST_1: 'eu-west-1',
  AP_SOUTHEAST_1: 'ap-southeast-1',
};

// Environment Types
export const ENVIRONMENTS: Record<string, string> = {
  DEV: 'dev',
  TEST: 'test',
  STAGE: 'staging',
  PROD: 'prod',
  QA: 'qa',
};

// Log Levels
export const LOG_LEVELS: Record<string, string> = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Cache TTL (in seconds)
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
};

// API Versioning
export const API_VERSION: Record<string, string> = {
  V1: 'v1',
  V2: 'v2',
};

// Content Types
export const CONTENT_TYPES: Record<string, string> = {
  JSON: 'application/json',
  XML: 'application/xml',
  HTML: 'text/html',
  TEXT: 'text/plain',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
};

export const SERVICE_PRINCIPALS = {
  APIGATEWAY: 'apigateway.amazonaws.com',
  BEDROCK: 'bedrock.amazonaws.com',
  CLOUDFORMATION: 'cloudformation.amazonaws.com',
  CLOUDFRONT: 'cloudfront.amazonaws.com',
  CLOUDWATCH: 'cloudwatch.amazonaws.com',
  CODEBUILD: 'codebuild.amazonaws.com',
  CODEPIPELINE: 'codepipeline.amazonaws.com',
  COGNITO_IDP: 'cognito-idp.amazonaws.com',
  CONNECT: 'connect.amazonaws.com',
  DYNAMODB: 'dynamodb.amazonaws.com',
  EC2: 'ec2.amazonaws.com',
  ECS_TASKS: 'ecs-tasks.amazonaws.com',
  ECS: 'ecs.amazonaws.com',
  EKS: 'eks.amazonaws.com',
  ELASTICLOADBALANCING: 'elasticloadbalancing.amazonaws.com',
  EVENTS: 'events.amazonaws.com',
  FIREHOSE: 'firehose.amazonaws.com',
  GLUE: 'glue.amazonaws.com',
  IAM: 'iam.amazonaws.com',
  KINESIS: 'kinesis.amazonaws.com',
  KMS: 'kms.amazonaws.com',
  LAMBDA: 'lambda.amazonaws.com',
  LOGS: 'logs.amazonaws.com',
  QUICKSIGHT: 'quicksight.amazonaws.com',
  RDS: 'rds.amazonaws.com',
  S3: 's3.amazonaws.com',
  SAGEMAKER: 'sagemaker.amazonaws.com',
  SECRETSMANAGER: 'secretsmanager.amazonaws.com',
  SES: 'ses.amazonaws.com',
  SNS: 'sns.amazonaws.com',
  SQS: 'sqs.amazonaws.com',
  SSM: 'ssm.amazonaws.com',
  STATES: 'states.amazonaws.com',
  STEPFUNCTIONS: 'states.amazonaws.com',
  VPC_FLOW_LOGS: 'vpc-flow-logs.amazonaws.com',
};

export type AWSRegionType = (typeof AWS_REGIONS)[keyof typeof AWS_REGIONS];
export type LogLevelType = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];
export type ServicePrincipalType =
  (typeof SERVICE_PRINCIPALS)[keyof typeof SERVICE_PRINCIPALS];
export type ApiVersionType = (typeof API_VERSION)[keyof typeof API_VERSION];
export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];
export type EnvironmentType = (typeof ENVIRONMENTS)[keyof typeof ENVIRONMENTS];
export type HttpStatusType = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export type UserStatusType = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export type ErrorCodeType = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
