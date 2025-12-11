import { z } from 'zod';

// User Schemas
export const UserStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'DELETED',
]);

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  status: UserStatusSchema.optional(),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  status: UserStatusSchema,
});

// Order Schemas
export const OrderStatusSchema = z.enum([
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
]);

export const OrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const CreateOrderSchema = z.object({
  userId: z.string().uuid(),
  items: z.array(OrderItemSchema).min(1, 'At least one item required'),
});

export const OrderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  items: z.array(OrderItemSchema),
  total: z.number().positive(),
  status: OrderStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Pagination Schemas
export const PaginationParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const PaginationMetadataSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    items: z.array(itemSchema),
    pagination: PaginationMetadataSchema,
  });

// API Response Schema
export const APIErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
});

export const ResponseMetadataSchema = z.object({
  timestamp: z.string().datetime(),
  requestId: z.string().uuid(),
  version: z.string(),
});

export const APIResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: APIErrorSchema.optional(),
    metadata: ResponseMetadataSchema.optional(),
  });

// Type Exports (inferred from schemas)
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type User = z.infer<typeof UserSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
export type PaginationMetadata = z.infer<typeof PaginationMetadataSchema>;
export type APIError = z.infer<typeof APIErrorSchema>;
export type ResponseMetadata = z.infer<typeof ResponseMetadataSchema>;
