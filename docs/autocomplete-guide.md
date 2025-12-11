# Configuration Autocomplete Guide

## Overview

The Rapid monorepo uses strongly-typed configurations that provide TypeScript autocomplete when accessing config values via `ConfigController`.

## How It Works

### 1. Define Your Config Interface

Create a `config/types.ts` file in your app that extends `BaseConfig`:

```typescript
// apps/user-service/config/types.ts
import type { BaseConfig } from '@rapid/config';

export interface UserServiceConfig extends BaseConfig {
  // Your app-specific properties
  app1SpecificSetting: string;
  app1MaxUsers: number;
  app1EnableNotifications: boolean;
  userTableName: string;
  jwtSecret: string;
  // ... more properties
}
```

### 2. Use the Interface in Config Files

```typescript
// apps/user-service/config/dev.config.ts
import type { UserServiceConfig } from './types';

export const devConfig: UserServiceConfig = {
  stage: 'dev',
  project: 'user-service',
  // ... base config
  app1SpecificSetting: 'my-value',
  app1MaxUsers: 1000,
  app1EnableNotifications: true,
  // TypeScript will enforce all required properties
};
```

### 3. Create Typed ConfigController

```typescript
// apps/user-service/bin/app.ts
import { ConfigController } from '@rapid/config';
import type { UserServiceConfig } from '../config/types';
import { getConfig } from '../config';

const config = getConfig(stage);
const configCtrl = new ConfigController<UserServiceConfig>(config);
```

### 4. Enjoy Autocomplete!

In your stacks and constructs:

```typescript
// apps/user-service/lib/user-service-stack.ts
export interface UserServiceStackProps extends cdk.StackProps {
  configCtrl: ConfigController<UserServiceConfig>;
}

export class UserServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: UserServiceStackProps) {
    super(scope, id, props);
    
    const { configCtrl } = props;
    
    // Type 'app1' and press Ctrl+Space to see:
    // - app1SpecificSetting
    // - app1MaxUsers
    // - app1EnableNotifications
    const setting = configCtrl.get('app1SpecificSetting'); // ← autocomplete works!
    
    // Or press Ctrl+Space inside the quotes to see ALL config keys:
    configCtrl.get(''); // ← shows all available properties
  }
}
```

## Examples

### Example App
- **Config**: `apps/example-app/config/types.ts` → `ExampleAppConfig`
- **Properties**: `apiUrl`, `databaseTableName`, `enableCaching`, `features`, etc.
- **Usage**: `apps/example-app/lib/example-stack.ts`

### User Service App
- **Config**: `apps/user-service/config/types.ts` → `UserServiceConfig`  
- **Properties**: `app1SpecificSetting`, `app1MaxUsers`, `userTableName`, `jwtSecret`, etc.
- **Usage**: `apps/user-service/lib/user-service-stack.ts`

## Try It Out

1. Open `apps/user-service/lib/user-service-stack.ts`
2. Find a line with `configCtrl.get('')`
3. Place your cursor between the quotes
4. Press **Ctrl+Space** (or **Cmd+Space** on Mac)
5. See all available config properties with their types!

## Benefits

✅ **Type Safety**: TypeScript catches typos and invalid property access at compile time  
✅ **Autocomplete**: IDE suggests all available config properties  
✅ **Documentation**: Hover over properties to see JSDoc comments  
✅ **Refactoring**: Rename properties safely across the entire codebase  
✅ **Discovery**: Easily explore what config options are available
