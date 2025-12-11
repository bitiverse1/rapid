# Example Lambda Handler

This directory would contain your Lambda function handlers. Each handler should be in its own directory with its specific logic.

Example structure:
```
lambdas/
├── user-api/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── handler.ts
├── order-processor/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── handler.ts
```

Each Lambda can import shared packages:
```typescript
import { DynamoDBService } from '@rapid/services';
import { CreateUserSchema } from '@rapid/schemas';
import { formatLambdaErrorResponse } from '@rapid/errors';
```
