// API Response Types
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: APIError;
  metadata?: ResponseMetadata;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMetadata {
  timestamp: string;
  requestId: string;
  version: string;
}

// Lambda Event Types
export interface APIGatewayEvent {
  body: string | null;
  headers: Record<string, string>;
  httpMethod: string;
  path: string;
  queryStringParameters: Record<string, string> | null;
  pathParameters: Record<string, string> | null;
  requestContext: RequestContext;
}

export interface RequestContext {
  requestId: string;
  accountId: string;
  stage: string;
  identity: Identity;
}

export interface Identity {
  sourceIp: string;
  userAgent: string;
}

// Domain Models
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: UserStatus;
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Request/Response Types
export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface UpdateUserRequest {
  name?: string;
  status?: UserStatus;
}

export interface CreateOrderRequest {
  userId: string;
  items: OrderItem[];
}

// Pagination Types
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMetadata;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
