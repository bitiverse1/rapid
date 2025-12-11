# Configuration System

## Overview

The Rapid configuration system is designed for app-centric configuration management. Each app maintains its own configuration files that extend a base configuration, and uses the `ConfigController` utility for type-safe access.

## Architecture

### Base Configuration
All app configs must extend `BaseConfig` with these required properties:

```typescript
interface BaseConfig {
  stage: string;           // Deployment stage (dev, test, prod)
  project: string;         // Project name
  awsAccountId: string;    // AWS Account ID (12 digits)
  awsRegion: AWSRegion;    // AWS Region
  logLevel: LogLevel;      // Logging level
}
```

### App Configuration Structure

```
apps/your-app/
├── config/
│   ├── dev.config.ts     # Development config
│   ├── prod.config.ts    # Production config
│   └── index.ts          # Config loader
├── bin/
│   └── app.ts           # CDK entry point (loads config)
└── lib/
    └── stack.ts         # Stacks receive ConfigController
```

## Usage Examples

### 1. Define App Configuration

```typescript
// apps/your-app/config/dev.config.ts
import type { AppConfig } from '@rapid/config';
import { AWS_REGIONS, LOG_LEVELS } from '@rapid/constants';

export const devConfig: AppConfig = {
  // Required base config
  stage: 'dev',
  project: 'your-app',
  awsAccountId: '123456789012',
  awsRegion: AWS_REGIONS.US_EAST_1,
  logLevel: LOG_LEVELS.DEBUG,

  // App-specific config
  apiUrl: 'https://api-dev.example.com',
  databaseTableName: 'your-app-dev-table',
  bucketName: 'your-app-dev-bucket',
  enableFeatureX: false,
  maxRetries: 3,
};
```

### 2. Load Configuration in CDK App

```typescript
// apps/your-app/bin/app.ts
import * as cdk from 'aws-cdk-lib';
import { ConfigController } from '@rapid/config';
import { getConfig } from '../config';
import { YourStack } from '../lib/your-stack';

const app = new cdk.App();

// Get stage from context or environment
const stage = app.node.tryGetContext('stage') || 'dev';

// Load config and create controller
const config = getConfig(stage);
const configCtrl = new ConfigController(config);

// Create stack with config controller
new YourStack(app, `${configCtrl.get('project')}-${configCtrl.get('stage')}`, {
  configCtrl,
  env: {
    account: configCtrl.get('awsAccountId'),
    region: configCtrl.get('awsRegion'),
  },
});
```

### 3. Use ConfigController in Stacks

```typescript
// apps/your-app/lib/your-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ConfigController } from '@rapid/config';

export interface YourStackProps extends cdk.StackProps {
  configCtrl: ConfigController;
}

export class YourStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: YourStackProps) {
    super(scope, id, props);

    const { configCtrl } = props;

    // Access base config
    const stage = configCtrl.get('stage');
    const project = configCtrl.get('project');
    const logLevel = configCtrl.get('logLevel');

    // Access app-specific config with type assertion
    const tableName = configCtrl.get('databaseTableName') as string;
    const apiUrl = configCtrl.get('apiUrl') as string;
    const enableFeatureX = configCtrl.get('enableFeatureX') as boolean;

    // Use config values in your infrastructure
    // ...
  }
}
```

### 4. Pass ConfigController to Constructs

```typescript
// apps/your-app/lib/constructs/api-construct.ts
import { Construct } from 'constructs';
import { ConfigController } from '@rapid/config';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export interface ApiConstructProps {
  configCtrl: ConfigController;
}

export class ApiConstruct extends Construct {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiConstructProps) {
    super(scope, id);

    const { configCtrl } = props;

    const stage = configCtrl.get('stage');
    const project = configCtrl.get('project');

    this.api = new apigateway.RestApi(this, 'Api', {
      restApiName: `${project}-${stage}-api`,
      description: `API for ${project} in ${stage} environment`,
    });
  }
}
```

## ConfigController API

### Methods

- **`get<K>(key: K): T[K]`**  
  Get a configuration value by key. Throws error if key doesn't exist.

- **`has<K>(key: K): boolean`**  
  Check if a configuration key exists.

- **`getAll(): Readonly<T>`**  
  Get the complete configuration object (read-only).

- **`getOrDefault<K>(key: K, defaultValue: T[K]): T[K]`**  
  Get a value with a fallback default.

### Examples

```typescript
// Get values (throws if not found)
const stage = configCtrl.get('stage');
const customVar = configCtrl.get('myCustomProperty');

// Check if key exists
if (configCtrl.has('optionalFeature')) {
  const feature = configCtrl.get('optionalFeature');
}

// Get with default fallback
const timeout = configCtrl.getOrDefault('timeout', 30);

// Get all config
const allConfig = configCtrl.getAll();
console.log(allConfig);
```

## Deployment

Deploy to different stages using CDK context:

```bash
# Deploy to dev (default)
cdk deploy

# Deploy to production
cdk deploy --context stage=prod

# Or use environment variable
export STAGE=prod
cdk deploy
```

## Benefits

1. **Type Safety**: ConfigController provides typed access to configuration
2. **Validation**: Base config requirements are validated on construction
3. **Immutability**: Configuration is frozen after creation
4. **Flexibility**: Each app defines its own custom properties
5. **Consistency**: Base properties ensure all apps have essential config
6. **Simplicity**: Single source of truth passed down from app entry point
