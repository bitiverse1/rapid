# Rapid

A comprehensive TypeScript monorepo that serves as both a project accelerator and knowledge-sharing platform for building serverless applications on AWS. The major goal is to prevent any single dedicated team from bearing the responsibility of maintaining and creating new features and applications. Instead, the workload is distributed across the entire company through a rotating governance model that maintains consistent standards while encouraging creativity and innovation.

Client projects contribute battle-tested features and applications back to the monorepo, where they're refined into reusable CDK constructs, shared packages, Lambda functions, and full-stack applications. These shared resources then accelerate future client projects, creating a cycle of continuous improvement. The Rapid Core Team governs this ecosystem through quarterly rotations—not as developers writing code, but as stewards ensuring applications remain functional, demoable, and production-ready while distributing architectural knowledge across the organization.

It does not aim to be a one-size-fits-all solution, but rather a curated collection of best practices, reusable components, and proven patterns that can be adapted to meet the unique needs of different projects. By leveraging the collective experience of multiple teams and projects, the monorepo serves as a living library of serverless architecture expertise.

## Table of Contents

- [Project Structure](#project-structure)
- [Root Directories](#root-directories)
  - [apps/](#apps)
  - [lambdas/](#lambdas)
  - [docs/](#docs)
  - [scripts/](#scripts)
  - [tests/](#tests)
- [Packages](#packages)
  - [packages/cdk](#packagescdk)
  - [packages/config](#packagesconfig)
  - [packages/constants](#packagesconstants)
  - [packages/errors](#packageserrors)
  - [packages/schemas](#packagesschemas)
  - [packages/services](#packagesservices)
  - [packages/types](#packagestypes)
  - [packages/utilities](#packagesutilities)

## Project Structure

```
rapid/
├── .github/                  # GitHub Actions workflows, PR/issue templates
├── .husky/                   # Git hooks for pre-commit linting and testing
├── .vscode/                  # VS Code settings and recommended extensions
├── apps/                     # Full-stack applications
├── docs/                     # Architectures, guides, ADRs, etc.
├── lambdas/                  # AWS Lambda function handlers
├── packages/                 # Shared libraries and reusable code
│   ├── cdk/                  # Custom CDK constructs and stacks
│   │   ├── aspects/          # CDK Aspects for policies, tagging, and compliance
│   │   ├── constructs/       # Reusable CDK constructs
│   │   │   ├── resources/    # Individual AWS resources (Lambda, API, DynamoDB)
│   │   │   └── patterns/     # Multi-resource patterns (API+Lambda+DB combos)
│   │   ├── stacks/           # CDK stack definitions
│   │   │   ├── root/         # Root-level stacks (independently deployable)
│   │   │   └── nested/       # Nested stacks (embedded within root stacks)
│   │   └── utilities/        # CDK helper functions (naming, tags, ARN builders)
│   ├── config/               # Environment configs with layered access control
│   │   ├── environments/     # Config data for dev, test, prod
│   │   └── schemas/          # Zod schemas (cdk, runtime, frontend)
│   ├── constants/            # Shared constants, enums, and status codes
│   ├── errors/               # Custom error classes and error handlers
│   ├── schemas/              # Zod validation schemas for data validation
│   ├── services/             # Business logic and third-party integrations
│   ├── types/                # TypeScript interfaces and schemas
│   └── utilities/            # Helper functions (validation, formatting, etc.)
├── scripts/                  # Build, deployment, and maintenance scripts
├── tests/                    # Integration and E2E tests
├── .env.example              # Environment variables template
├── .eslintrc.js              # ESLint configuration
├── .gitignore                # Git ignore rules
├── .npmignore                # NPM publish ignore rules
├── .npmrc                    # NPM/PNPM configuration
├── jest.config.js            # Jest test configuration
├── package.json              # Workspace config and scripts
├── pnpm-workspace.yaml       # PNPM workspace definition
├── prettier.config.js        # Code formatting rules
├── README.md                 # This file
└── tsconfig.json             # Base TypeScript configuration
```

## Root Directories

### `apps/`

Complete, deployable applications representing distinct business capabilities or products. An app can be infrastructure-only (CDK stacks deploying AWS resources), a full-stack application (React frontend + backend APIs), or a combination of both. Each app is self-contained with its own `package.json`, build configuration, and deployment process.

Apps orchestrate the monorepo's resources by:

- Importing lambdas from `lambdas/` and deploying them via CDK
- Using constructs and stacks from `packages/cdk/` (or defining app-specific stacks when customization is needed)
- Consuming configuration from `packages/config/` for environment-specific settings
- Leveraging services, types, schemas, and utilities from `packages/`

**Examples:**

- **connect-manager/** - Application for managing Amazon Connect (contact center). Includes CDK stacks deploying Connect resources, Lambda functions for contact flow logic, and a React dashboard for administrators. Uses shared `packages/cdk/constructs` for common patterns and custom stacks for Connect-specific resources.
- **chat-app/** - Real-time chat application. Full-stack app with Next.js frontend, WebSocket API backend deployed as Lambda, DynamoDB for message storage, and S3 for media uploads. Imports lambdas from `lambdas/websocket-handler/` and uses `packages/services/database/DynamoDBService`.
- **audio-redaction/** - Audio processing pipeline that streams audio data to S3, transcribes with AWS Transcribe, redacts sensitive information, and stores results. Infrastructure-only app (no UI) using CDK to deploy Step Functions, Lambdas, S3 buckets, and EventBridge rules. Reuses `packages/cdk/stacks/root/` for standard patterns and adds custom nested stacks for complex audio processing workflows.

### `lambdas/`

Individual single purpose AWS Lambda function handlers organized by purpose. Each Lambda directory contains the handler code, any Lambda-specific logic, and configuration. Lambdas import shared code from `packages/` (services, types, schemas, utilities) to keep handlers focused and lightweight. Examples: `user-api/`, `order-processor/`, `image-resizer/`, `scheduled-cleanup/`.

### `docs/`

Centralized documentation for understanding, maintaining, and evolving the system. This directory captures institutional knowledge and serves as the single source of truth for project decisions and patterns.

**Contents:**

- **Architecture diagrams** - System design, data flow, infrastructure visualizations
- **API specifications** - OpenAPI/Swagger schemas, endpoint documentation
- **Deployment runbooks** - Step-by-step deployment procedures, rollback strategies
- **ADRs** - Architecture Decision Records documenting important technical decisions and trade-offs
- **Development guides** - Coding standards, contribution guidelines, onboarding documentation
- **Troubleshooting** - Common issues, debugging procedures, operational playbooks

### `scripts/`

Automation scripts for building, deploying, seeding data, database migrations, and maintenance tasks. These scripts orchestrate monorepo operations, CI/CD workflows, and complex development workflows.

**When scripts run:**

- **From package.json** - Referenced in npm scripts for common tasks (e.g., `"build": "./scripts/build-all.sh"`)
- **Pre/post deployment** - Executed as lifecycle hooks (e.g., database migrations before deployment, cache warming after deployment)
- **CI/CD pipelines** - Automated execution in GitHub Actions, GitLab CI, or other CI systems
- **Manual execution** - Run by developers for one-off tasks (generating code, seeding test data, cleanup operations)

**Examples:**

- `deploy.sh` - Orchestrates multi-environment deployment with validation and rollback
- `seed-database.ts` - Populates DynamoDB tables with test or initial data
- `generate-types.ts` - Auto-generates TypeScript types from OpenAPI specs or database schemas
- `clean-artifacts.sh` - Removes build outputs and temporary files across the monorepo
- `migrate-db.ts` - Runs database schema migrations before deployments
- `generate-lambda-configs.ts` - Creates Lambda environment variable configs from templates

### `tests/`

Comprehensive test suite for all shared packages. This directory contains unit tests for individual packages (utilities, services, errors, constants, types, schemas) and integration tests that validate cross-package interactions. Apps and lambdas maintain their own test folders for application-specific testing.

**What goes here:**

- **Package unit tests** - Tests for utilities, services, errors, constants, schemas, and other packages
  - `utilities.test.ts` - Testing helper functions like `formatDate()`, `slugify()`, `validateEmail()`
  - `services/dynamodb.test.ts` - Testing DynamoDB service methods
  - `errors.test.ts` - Testing custom error classes and error handlers
  - `constants.test.ts` - Validating constant values and enums
- **Package integration tests** - Tests that validate interactions between multiple packages (e.g., services using schemas and types together)
- **Shared infrastructure tests** - Validation of CDK constructs and stacks from `packages/cdk/`
- **Cross-package workflows** - Tests that exercise multiple packages in realistic scenarios
- **Contract tests** - Ensuring packages expose correct interfaces for consumers

**What does NOT go here:**

- **App-specific tests** - Live in `apps/[app-name]/tests/`
- **Lambda unit tests** - Live in `lambdas/[lambda-name]/tests/`

**Examples:**

- Unit test: Testing that `getEnvironmentVariable()` from utilities returns correct defaults
- Unit test: Validating that `StripeService.createCustomer()` properly formats requests
- Integration test: Testing that `packages/services/DynamoDBService` correctly uses types from `packages/types` and validates with schemas from `packages/schemas`
- Integration test: Validating that CDK constructs from `packages/cdk/constructs/` properly integrate with stacks from `packages/cdk/stacks/`

## Packages

### `packages/cdk`

Custom CDK constructs, stacks, and infrastructure patterns for deploying AWS resources. Organized into:

- **aspects/** - CDK Aspects for applying organization-wide policies, tagging, and compliance rules
- **constructs/** - Reusable CDK constructs organized by complexity:
  - **resources/** - L2 constructs that wrap single AWS resources (Lambda, DynamoDB, API Gateway) with custom defaults, standardized configuration, and organization-specific policies. Create L2 constructs to enforce consistency and reduce boilerplate across your infrastructure.
  - **patterns/** - L3 constructs that combine multiple resources into reusable architectural patterns (API + Lambda + DynamoDB, EventBridge + Lambda fanout). Create L3 constructs when you repeatedly deploy the same resource combinations with predictable relationships and configurations.
- **stacks/** - Stack definitions organized by deployment type:
  - **root/** - Independent CloudFormation stacks that can be deployed separately (ApiStack, DatabaseStack, FrontendStack). Create root stacks for independently deployable services or when you need flexibility to deploy/update components separately. Most common for microservices and multi-service architectures.
  - **nested/** - Child stacks embedded within root stacks, sharing the parent's deployment lifecycle. Create nested stacks when you want to organize complex infrastructure into logical modules (networking, compute, storage) while maintaining a single deployment unit, or when you need to reuse stack templates across multiple parent stacks.
- **utilities/** - CDK-specific helper functions that execute during synthesis (resource naming conventions, tag generators, ARN builders, reusable IAM policy statements). These utilities are for infrastructure code only and do not run in your deployed Lambda functions or applications.

### `packages/config`

Centralized configuration management system. Each app maintains its own config files that extend a `BaseConfig` with required properties (stage, project, awsAccountId, awsRegion, logLevel). The `ConfigController` utility class provides type-safe access to configuration values through a dynamic getter pattern.

**Base Configuration Requirements:**
All app configs must include:

- **stage** - Deployment stage (dev, test, prod)
- **project** - Project name
- **awsAccountId** - AWS Account ID for deployment (12-digit string)
- **awsRegion** - AWS Region for deployment
- **logLevel** - Logging level (DEBUG, INFO, WARN, ERROR)

**App-Specific Configuration:**
Apps extend the base config with custom properties specific to their needs (API URLs, table names, feature flags, etc.).

**ConfigController Usage:**

```typescript
const config = {
  stage: 'dev',
  project: 'my-app',
  awsAccountId: '123456789012',
  awsRegion: 'us-east-1',
  logLevel: 'DEBUG',
  apiUrl: 'https://api.example.com',
  customVar: 'value',
};

const configCtrl = new ConfigController(config);

// Access any config property
const stage = configCtrl.get('stage');
const apiUrl = configCtrl.get('apiUrl');
const customVar = configCtrl.get('customVar');
```

Configuration is passed down from the app's CDK entry point to all stacks and constructs, ensuring consistent configuration access throughout the infrastructure.

### `packages/constants`

Shared constants, enums, HTTP status codes, and error codes used across the monorepo. Eliminates magic strings and numbers—hardcoded literal values whose meaning isn't clear from context. For example, instead of scattering `"pending"` strings and `404` numbers throughout your code (which are prone to typos and hard to maintain), you import `ORDER_STATUS.PENDING` and `HTTP_STATUS.NOT_FOUND`. This provides autocomplete, type safety, centralized updates, and self-documenting code. Ensures consistency across all lambdas, apps, and services.

### `packages/errors`

Custom error classes and error handling utilities for consistent error management across applications. Includes API error responses, Lambda error handlers, and error formatting utilities.

### `packages/schemas`

Zod validation schemas for runtime data validation across lambdas and applications. These schemas validate data structure and types at runtime, catching errors before they cause problems. For example, a `CreateUserSchema` can validate incoming API requests in a Lambda handler (ensuring required fields exist and are properly formatted), validate form submissions in React (providing immediate feedback to users), and ensure database writes contain valid data. Shared schemas guarantee that frontend validation rules match backend validation rules, preventing inconsistencies between client and server.

### `packages/services`

Shared business logic and third-party service integrations. A service is a class or module with state, dependencies, or side effects—things that need initialization, hold configuration, or interact with external systems. Create services when you need reusable business logic that multiple lambdas or apps will use identically.

**When to create a service:**

- Wrapping AWS SDKs with common operations (DynamoDB queries, S3 uploads, SES emails)
- External API clients that need authentication, retry logic, or error handling
- Business logic with state (caching, connection pooling, rate limiting)
- Operations that require initialization or configuration
- When the same instance needs to be reused across multiple invocations (e.g., instantiated once outside Lambda handler and shared across warm starts)

**When NOT to create a service:**

- Pure functions with no dependencies (use `packages/utilities` instead)
- One-off logic used in a single lambda (keep it in the lambda)
- Simple wrappers that add no value (just use the SDK directly)

**Examples:**

- **database/** - Database service implementations for different data stores:
  - `DynamoDBService` - Wraps DynamoDB Document Client with typed methods like `getUser()`, `createOrder()`, `queryByStatus()` with built-in error handling and logging
  - `AthenaService` - Executes SQL queries against S3 data with automatic result polling, CSV parsing, and query result caching
  - `RDSService` - Connection pooling and query builders for RDS databases (if needed)
- **email/** - Email service implementations for different providers:
  - `SESService` - AWS SES integration with template loading, HTML rendering, retry logic, and bounce handling
  - `SendGridService` - Alternative email provider if SES doesn't meet requirements
- **payment/** - Payment processing services:
  - `StripeService` - Stripe API wrapper for creating customers, processing payments, managing subscriptions, and handling webhooks

### `packages/types`

Shared TypeScript interfaces, type definitions, and type utilities used across all packages and applications. Unlike Zod schemas (which validate data at runtime), types exist only at compile-time and are erased when TypeScript is compiled to JavaScript. They provide autocomplete, catch developer mistakes before deployment, and ensure type consistency across your codebase.

**When to create a type:**

- Data structures shared between frontend and backend (API request/response shapes, database models)
- Ensuring frontend sends data in the exact format backend expects
- Providing autocomplete and type checking across lambdas, apps, and CDK
- Domain models used throughout the system (User, Order, Product, etc.)

**Important distinction:**

- **Types** (`packages/types`) = Compile-time only, no runtime validation, prevents developer mistakes during coding
- **Schemas** (`packages/schemas`) = Runtime validation with Zod, validates actual data at runtime, catches bad input from users/APIs

**Examples:**

- `User` interface used in React components, Lambda handlers, and DynamoDB operations
- `CreateOrderRequest` type ensuring frontend POST requests match Lambda handler expectations
- `APIResponse<T>` generic type for consistent API response formatting
- `LambdaEvent` types for different event sources (API Gateway, SQS, EventBridge)

### `packages/utilities`

Pure, stateless helper functions with no dependencies or side effects. Utilities are simple functions that take inputs, perform a transformation or calculation, and return outputs—they don't maintain state, require initialization, or interact with external systems. Create utilities instead of services when you have reusable logic that's self-contained and doesn't need to persist across invocations.

**When to create a utility:**

- Pure functions with predictable outputs for given inputs
- No external dependencies or state management
- Simple, focused operations that can be called anywhere
- Functions that create and return new instances (not managing existing ones)

**Examples:**

- `getEnvironmentVariable(name: string, defaultValue?: string)` - Safely retrieves Lambda environment variables with optional defaults and type conversion
- `getLambdaLogger(context: Context, event: any)` - Creates a new Powertools Logger instance with appropriate log level, adds Lambda context, and logs the incoming event
- `formatDate(date: Date, format: string)` - Formats dates into human-readable strings
- `slugify(text: string)` - Converts text into URL-safe slugs
- `validateEmail(email: string)` - Validates email format
- `parseJSON<T>(json: string, fallback: T)` - Safely parses JSON with fallback values
