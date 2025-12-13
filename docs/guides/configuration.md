# Configuration Guide

## Overview

The Rapid configuration system provides app-centric configuration management with full TypeScript autocomplete support. Each app maintains its own configuration files that extend a base configuration, and uses the `ConfigController` utility for type-safe access to configuration values.

## Key Features

- **Type Safety**: Full TypeScript autocomplete when accessing config values
- **Validation**: Base config requirements are validated on construction
- **Immutability**: Configuration is frozen after creation
- **Flexibility**: Each app defines its own custom properties
- **Consistency**: Base properties ensure all apps have essential config
- **Simplicity**: Single source of truth passed down from app entry point

## Base Configuration

All app configs must extend `BaseConfig` with these required properties:

```typescript
interface BaseConfig {
  stage: string; // Deployment stage (dev, test, prod)
  project: string; // Project name
  awsAccountId: string; // AWS Account ID (12 digits)
  awsRegion: AWSRegion; // AWS Region
  logLevel: LogLevel; // Logging level
  tags?: Array<{ key: string; value: string }>; // Optional resource tags
}
```

## Setting Up Configuration

### 1. Define Your App's Config Type

Create a type definition that extends `BaseConfig` with your app-specific properties:

```typescript
// apps/your-app/config/src/types.ts
import type { BaseConfig } from '@rapid/config';

export interface YourAppConfig extends BaseConfig {
  // API Configuration
  apiUrl: string;
  apiTimeout: number;

  // Database Configuration
  databaseTableName: string;
  databaseReadCapacity: number;
  databaseWriteCapacity: number;

  // Storage Configuration
  bucketName: string;

  // Feature Flags
  enableFeatureX: boolean;
  enableCaching: boolean;

  // Other Settings
  maxRetries: number;
  features: {
    authentication: boolean;
    notifications: boolean;
  };
}
```

### 2. Create Environment-Specific Configs

Define configuration for each environment:

```typescript
// apps/your-app/config/src/config.ts
import { ConfigController } from '@rapid/config';
import { AWS_REGIONS, LOG_LEVELS } from '@rapid/constants';
import type { YourAppConfig } from './types';

const configs: Record<string, YourAppConfig> = {
  dev: {
    // Required base config
    stage: 'dev',
    project: 'your-app',
    awsAccountId: process.env.AWS_ACCOUNT_ID || '',
    awsRegion: AWS_REGIONS.US_EAST_1,
    logLevel: LOG_LEVELS.DEBUG,
    tags: [
      { key: 'Environment', value: 'Development' },
      { key: 'ManagedBy', value: 'CDK' },
    ],

    // App-specific config
    apiUrl: 'https://api-dev.example.com',
    apiTimeout: 30000,
    databaseTableName: 'your-app-dev-table',
    databaseReadCapacity: 5,
    databaseWriteCapacity: 5,
    bucketName: 'your-app-dev-bucket',
    enableFeatureX: false,
    enableCaching: false,
    maxRetries: 3,
    features: {
      authentication: true,
      notifications: false,
    },
  },

  prod: {
    stage: 'prod',
    project: 'your-app',
    awsAccountId: process.env.AWS_ACCOUNT_ID || '',
    awsRegion: AWS_REGIONS.US_EAST_1,
    logLevel: LOG_LEVELS.INFO,
    tags: [
      { key: 'Environment', value: 'Production' },
      { key: 'ManagedBy', value: 'CDK' },
    ],

    apiUrl: 'https://api.example.com',
    apiTimeout: 10000,
    databaseTableName: 'your-app-prod-table',
    databaseReadCapacity: 100,
    databaseWriteCapacity: 50,
    bucketName: 'your-app-prod-bucket',
    enableFeatureX: true,
    enableCaching: true,
    maxRetries: 5,
    features: {
      authentication: true,
      notifications: true,
    },
  },
};

export const configCtrl = new ConfigController<YourAppConfig>(configs);
```

### 3. Export Config Types and Controller

```typescript
// apps/your-app/config/src/index.ts
export * from './config';
export * from './types';
```

## Using ConfigController

### In CDK App Entry Point

```typescript
// apps/your-app/cdk/src/index.ts
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { YourAppStack } from './stacks/your-app-stack';
import { configCtrl } from '../config/src/config';

const app = new cdk.App();

// Get environment from context or default to 'dev'
const environment = app.node.tryGetContext('environment') || 'dev';

// Get configuration for the environment
const config = configCtrl.get(environment);

new YourAppStack(app, `YourAppStack-${config.stage}`, {
  env: {
    account: config.awsAccountId,
    region: config.awsRegion,
  },
  config,
  tags: {
    Project: config.project,
    Environment: config.stage,
    ...Object.fromEntries(config.tags?.map(tag => [tag.key, tag.value]) || []),
  },
});

app.synth();
```

### In CDK Stacks

```typescript
// apps/your-app/cdk/src/stacks/your-app-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import type { YourAppConfig } from '../../config/src/types';

export interface YourAppStackProps extends cdk.StackProps {
  config: YourAppConfig;
}

export class YourAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: YourAppStackProps) {
    super(scope, id, props);

    const { config } = props;

    // Access config with full TypeScript autocomplete!
    const tableName = config.databaseTableName; // ✅ Autocomplete works!
    const apiUrl = config.apiUrl; // ✅ Type-safe!
    const enableCache = config.enableCaching; // ✅ IntelliSense!

    // Use config values in your infrastructure
    const table = new cdk.aws_dynamodb.Table(this, 'Table', {
      tableName: tableName,
      partitionKey: { name: 'id', type: cdk.aws_dynamodb.AttributeType.STRING },
      readCapacity: config.databaseReadCapacity,
      writeCapacity: config.databaseWriteCapacity,
    });
  }
}
```

### In Constructs

```typescript
// apps/your-app/cdk/src/constructs/api-construct.ts
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import type { YourAppConfig } from '../../config/src/types';

export interface ApiConstructProps {
  config: YourAppConfig;
}

export class ApiConstruct extends Construct {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiConstructProps) {
    super(scope, id);

    const { config } = props;

    // Full autocomplete for all config properties
    this.api = new apigateway.RestApi(this, 'Api', {
      restApiName: `${config.project}-${config.stage}-api`,
      description: `API for ${config.project} in ${config.stage} environment`,
    });

    // Conditional logic based on config
    if (config.enableCaching) {
      // Add caching configuration
    }
  }
}
```

## ConfigController API

### Methods

#### `get(environment: string): T`

Get the complete configuration for a specific environment.

```typescript
const devConfig = configCtrl.get('dev');
const prodConfig = configCtrl.get('prod');
```

#### `has(environment: string): boolean`

Check if a configuration exists for an environment.

```typescript
if (configCtrl.has('staging')) {
  const config = configCtrl.get('staging');
}
```

#### `getAll(): Readonly<Record<string, T>>`

Get all configurations (read-only).

```typescript
const allConfigs = configCtrl.getAll();
console.log(Object.keys(allConfigs)); // ['dev', 'test', 'prod']
```

## Deployment

Deploy to different environments using CDK context:

```bash
# Deploy to dev (default)
cd apps/your-app/cdk
pnpm cdk deploy

# Deploy to production
pnpm cdk deploy -c environment=prod

# Deploy to test
pnpm cdk deploy -c environment=test
```

## Best Practices

### 1. Use Environment Variables for Secrets

Never hardcode sensitive values. Use environment variables:

```typescript
awsAccountId: process.env.AWS_ACCOUNT_ID || '',
apiKey: process.env.API_KEY || '',
```

### 2. Define Comprehensive Types

Include all properties your app needs in the config type for full autocomplete:

```typescript
export interface YourAppConfig extends BaseConfig {
  // Group related properties
  api: {
    url: string;
    timeout: number;
    retries: number;
  };

  database: {
    tableName: string;
    readCapacity: number;
    writeCapacity: number;
  };
}
```

### 3. Use Feature Flags

Enable/disable features per environment:

```typescript
features: {
  authentication: true,
  notifications: config.stage === 'prod',
  betaFeatures: config.stage === 'dev',
}
```

### 4. Validate Configuration

Add validation in your config file:

```typescript
const validateConfig = (config: YourAppConfig): void => {
  if (!config.awsAccountId.match(/^\d{12}$/)) {
    throw new Error('Invalid AWS Account ID');
  }
  if (config.apiTimeout < 1000) {
    throw new Error('API timeout must be at least 1000ms');
  }
};

// Validate all configs
Object.values(configs).forEach(validateConfig);
```

## Troubleshooting

### Autocomplete Not Working

If you're not getting autocomplete:

1. **Ensure you've typed the ConfigController:**

   ```typescript
   const configCtrl = new ConfigController<YourAppConfig>(configs);
   ```

2. **Pass the config type through props:**

   ```typescript
   export interface StackProps extends cdk.StackProps {
     config: YourAppConfig; // ✅ Typed
   }
   ```

3. **Restart your TypeScript server** in your IDE

### Configuration Not Found

If you get "Configuration not found" errors:

1. Check that the environment name matches exactly
2. Verify the config is defined in your configs object
3. Ensure you're passing the correct context: `-c environment=prod`

## Example Project Structure

```
apps/your-app/
├── cdk/
│   ├── src/
│   │   ├── index.ts              # CDK entry point
│   │   ├── stacks/
│   │   │   └── your-app-stack.ts # Stack using config
│   │   └── constructs/
│   │       └── api-construct.ts  # Construct using config
│   ├── package.json
│   ├── tsconfig.json
│   └── cdk.json
├── config/
│   ├── src/
│   │   ├── config.ts             # Environment configs
│   │   ├── types.ts              # Config type definition
│   │   └── index.ts              # Exports
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Summary

The Rapid configuration system provides:

- ✅ **Full TypeScript autocomplete** for all config properties
- ✅ **Type safety** to catch errors at compile time
- ✅ **Environment-specific** configurations
- ✅ **Immutable** config objects
- ✅ **Simple API** with ConfigController
- ✅ **Flexible** - define any properties your app needs

By following this guide, you'll have a robust, type-safe configuration system that scales with your application.
