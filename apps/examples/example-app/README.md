# Example App

This example application demonstrates how to use the Rapid configuration system.

## Configuration Structure

Each app has its own config directory with environment-specific files:

```
apps/example-app/
├── config/
│   ├── dev.config.ts      # Development configuration
│   ├── prod.config.ts     # Production configuration
│   └── index.ts           # Config loader
├── bin/
│   └── app.ts            # CDK app entry point
└── lib/
    └── example-stack.ts  # CDK stack using ConfigController
```

## Base Config

All configs must extend `BaseConfig` with these required properties:
- `stage`: Deployment stage (e.g., 'dev', 'prod')
- `project`: Project name
- `awsAccountId`: AWS Account ID (12 digits)
- `awsRegion`: AWS Region
- `logLevel`: Logging level

## App-Specific Config

Add custom properties to your config:

```typescript
export const devConfig: AppConfig = {
  // Base config (required)
  stage: 'dev',
  project: 'example-app',
  awsAccountId: '123456789012',
  awsRegion: AWS_REGIONS.US_EAST_1,
  logLevel: LOG_LEVELS.DEBUG,

  // App-specific properties
  apiUrl: 'https://api-dev.example.com',
  databaseTableName: 'example-app-dev-table',
  enableCaching: true,
  customVar: 'my-value',
};
```

## Using ConfigController

### In CDK Stacks

```typescript
export interface MyStackProps extends cdk.StackProps {
  configCtrl: ConfigController;
}

export class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MyStackProps) {
    super(scope, id, props);

    const { configCtrl } = props;

    // Access base config
    const stage = configCtrl.get('stage');
    const region = configCtrl.get('awsRegion');

    // Access app-specific config
    const apiUrl = configCtrl.get('apiUrl');
    const tableName = configCtrl.get('databaseTableName');
  }
}
```

### In CDK App Entry Point

```typescript
// Load config for stage
const config = getConfig(stage);

// Create ConfigController
const configCtrl = new ConfigController(config);

// Pass to stacks
new MyStack(app, 'MyStack', {
  configCtrl,
  env: {
    account: configCtrl.get('awsAccountId'),
    region: configCtrl.get('awsRegion'),
  },
});
```

## Deployment

Deploy to different stages:

```bash
# Deploy to dev (default)
npm run deploy

# Deploy to prod
cdk deploy --context stage=prod

# Or set environment variable
STAGE=prod npm run deploy
```

## ConfigController Methods

- `get(key)`: Get a config value (throws if not found)
- `has(key)`: Check if a key exists
- `getAll()`: Get the complete config object
- `getOrDefault(key, defaultValue)`: Get value with fallback
