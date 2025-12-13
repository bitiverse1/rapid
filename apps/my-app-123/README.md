# my-app-123

Test app with numbers

## Structure

```
my-app-123/
├── cdk/              # AWS CDK infrastructure
├── config/           # Environment configuration
└── README.md         # This file
```

## Configuration

This application supports the following environments:
- dev
- test
- prod

Configuration is managed via the `@rapid/my-app-123-config` package using the `ConfigController`.

## Development

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- AWS CLI configured with appropriate credentials

### Installation

```bash
# From the workspace root
pnpm install
```

### CDK Commands

```bash
cd cdk

# Build the CDK app
pnpm build

# Synthesize CloudFormation template
pnpm synth

# Deploy to AWS
pnpm deploy

# Show differences
pnpm diff

# Destroy the stack
pnpm destroy
```

### Deploy to specific environment

```bash
pnpm cdk deploy -c environment=prod
```

