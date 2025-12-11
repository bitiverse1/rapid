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
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

// User Status
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
} as const;

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
} as const;

// AWS Region
export const AWS_REGIONS = {
  US_EAST_1: 'us-east-1',
  US_WEST_2: 'us-west-2',
  EU_WEST_1: 'eu-west-1',
  AP_SOUTHEAST_1: 'ap-southeast-1',
} as const;

// Environment Types
export const ENVIRONMENTS = {
  DEVELOPMENT: 'dev',
  TEST: 'test',
  STAGING: 'staging',
  PRODUCTION: 'prod',
} as const;

// Log Levels
export const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Cache TTL (in seconds)
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

// API Versioning
export const API_VERSION = {
  V1: 'v1',
  V2: 'v2',
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  XML: 'application/xml',
  HTML: 'text/html',
  TEXT: 'text/plain',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const;

// Type Exports
export type HTTPStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
export type AWSRegion = (typeof AWS_REGIONS)[keyof typeof AWS_REGIONS];
export type Environment = (typeof ENVIRONMENTS)[keyof typeof ENVIRONMENTS];
export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];
export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];
