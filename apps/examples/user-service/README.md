# User Service App

A CDK application demonstrating strongly-typed configuration with autocomplete.

## Configuration Autocomplete

This app shows how TypeScript autocomplete works with `ConfigController`:

1. **Typed Config Interface**: See `config/types.ts` - defines `UserServiceConfig`
2. **Autocomplete in Action**: In `lib/user-service-stack.ts`, when you type:
   ```typescript
   configCtrl.get('app1')
   ```
   You'll see autocomplete suggestions for:
   - `app1SpecificSetting`
   - `app1MaxUsers`
   - `app1EnableNotifications`

3. **All Properties Available**: Type `configCtrl.get('')` and press Ctrl+Space to see all available config keys

## Usage

```bash
# Development deployment
pnpm cdk synth
pnpm cdk deploy

# Production deployment
pnpm cdk deploy --context stage=prod
```

## Configuration Files

- `config/types.ts` - TypeScript interface with all config properties
- `config/dev.config.ts` - Development environment configuration
- `config/prod.config.ts` - Production environment configuration
- `config/index.ts` - Config loader function
