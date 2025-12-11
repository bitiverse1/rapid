# Test Suite

This directory contains integration and E2E tests for shared packages.

App-specific and Lambda-specific tests should live in their respective directories.

## Structure

```
tests/
├── unit/
│   ├── utilities.test.ts
│   └── services.test.ts
├── integration/
│   └── dynamodb-integration.test.ts
└── e2e/
    └── api-workflow.test.ts
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```
