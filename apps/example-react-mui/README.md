# example-react-mui

Example react app with mui

## Structure

```
example-react-mui/
├── cdk/              # AWS CDK infrastructure
│   ├── app.ts        # CDK app entry point
│   ├── config.ts     # Environment configuration
│   ├── types.ts      # TypeScript type definitions
│   ├── stacks/       # CDK stacks
│   └── constructs/   # Reusable CDK constructs
├── lambdas/          # Lambda function handlers
├── frontend/         # Frontend application
└── README.md         # This file
```

## Configuration

This application supports the following environments:
- dev
- test
- prod

Configuration is managed via the `config.ts` file using the `ConfigController`.

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

### Frontend Development

```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

