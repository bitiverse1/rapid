# Example Applications

This directory would contain your deployable applications. Each app should be self-contained with its own package.json and infrastructure.

Example structure:
```
apps/
├── user-management/
│   ├── package.json
│   ├── cdk/
│   │   ├── bin/
│   │   │   └── app.ts
│   │   └── lib/
│   │       └── user-stack.ts
│   └── frontend/
│       ├── package.json
│       └── src/
│           └── index.tsx
```

Each app can:
- Import lambdas from `lambdas/`
- Use constructs from `@rapid/cdk`
- Consume config from `@rapid/config`
- Leverage all shared packages
