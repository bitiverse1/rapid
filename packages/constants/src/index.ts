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
} as const satisfies Record<string, number>;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const satisfies Record<string, string>;

// User Status
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
} as const satisfies Record<string, string>;

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const satisfies Record<string, string>;

// AWS Region
export const AWS_REGIONS = {
  US_EAST_1: 'us-east-1',
  US_WEST_2: 'us-west-2',
  EU_WEST_1: 'eu-west-1',
  AP_SOUTHEAST_1: 'ap-southeast-1',
} as const satisfies Record<string, string>;

// Environment Types
export const ENVIRONMENTS = {
  DEV: 'dev',
  TEST: 'test',
  STAGE: 'staging',
  PROD: 'prod',
  QA: 'qa',
} as const satisfies Record<string, string>;

// Log Levels
export const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
} as const satisfies Record<string, string>;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const satisfies Record<string, number>;

// Cache TTL (in seconds)
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const satisfies Record<string, number>;

// API Versioning
export const API_VERSION = {
  V1: 'v1',
  V2: 'v2',
} as const satisfies Record<string, string>;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  XML: 'application/xml',
  HTML: 'text/html',
  TEXT: 'text/plain',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const satisfies Record<string, string>;

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

export const TIMEOUT_SECONDS = {
  FIVE_MINUTES: 300,
  TEN_MINUTES: 600,
  FIFTEEN_MINUTES: 900,
  THIRTY_MINUTES: 1800,
  ONE_HOUR: 3600,
  TWO_HOURS: 7200,
  THREE_HOURS: 10800,
  FOUR_HOURS: 14400,
  FIVE_HOURS: 18000,
  SIX_HOURS: 21600,
  SEVEN_HOURS: 25200,
  EIGHT_HOURS: 28800,
  NINE_HOURS: 32400,
  TEN_HOURS: 36000,
  ELEVEN_HOURS: 39600,
  TWELVE_HOURS: 43200,
  ONE_DAY: 86400,
  TWO_DAYS: 172800,
  THREE_DAYS: 259200,
  ONE_WEEK: 604800,
  TWO_WEEKS: 1209600,
  THREE_WEEKS: 1814400,
  ONE_MONTH: 2592000,
  TWO_MONTHS: 5184000,
  THREE_MONTHS: 7776000,
  SIX_MONTHS: 15552000,
  ONE_YEAR: 31536000,
} as const satisfies Record<string, number>;

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
export type TimeoutSecondsType =
  (typeof TIMEOUT_SECONDS)[keyof typeof TIMEOUT_SECONDS];
