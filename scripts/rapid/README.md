# RAPID Script Modular Structure

This directory contains the modular components of the RAPID application bootstrap script.

## Directory Structure

```
scripts/
└── rapid/
    ├── rapid.sh              # Main entry point script
    ├── README.md             # This file
    ├── helpers/              # Helper functions
    │   ├── ui.sh             # UI/display functions (colors, prompts)
    │   ├── validation.sh     # Input validation functions
    │   ├── cloud.sh          # Cloud app creation helpers
    │   └── react.sh          # React frontend setup helpers
    └── templates/            # File templates
        ├── cloud/            # CDK/Cloud app templates
        │   ├── app.ts        # CDK app entry point template
        │   ├── Stack.ts      # CDK stack template
        │   ├── types.ts      # TypeScript types template
        │   ├── cdk.json      # CDK configuration
        │   └── tsconfig.json # TypeScript config for CDK
        ├── cli/              # CLI app templates
        │   ├── cli.ts        # CLI entry point template
        │   ├── example.ts    # Example command template
        │   ├── index.ts      # Main export
        │   └── tsconfig.json # TypeScript config for CLI
        └── react/            # React frontend templates
            ├── mui/          # Material-UI templates
            │   ├── App.tsx
            │   ├── Home.tsx
            │   ├── About.tsx
            │   ├── Dashboard.tsx
            │   └── index.css
            ├── tailwind/     # Tailwind CSS templates
            │   ├── App.tsx
            │   ├── Home.tsx
            │   ├── About.tsx
            │   └── Dashboard.tsx
            ├── cloudscape/   # AWS Cloudscape (inline in react.sh)
            └── basic/        # Basic React templates
                ├── App.tsx
                ├── Home.tsx
                ├── About.tsx
                └── Dashboard.tsx
```

## Modifying Templates

### React Component Templates

To modify the React templates (MUI, Tailwind, Cloudscape, or Basic):

1. Navigate to `scripts/rapid/templates/react/<framework>/`
2. Edit the `.tsx` or `.css` files directly
3. Changes will be applied to newly generated apps

### CDK Templates

To modify CDK/Cloud app templates:

1. Navigate to `scripts/rapid/templates/cloud/`
2. Edit any of the template files:
   - `app.ts` - CDK app entry point
   - `Stack.ts` - CDK stack template
   - `types.ts` - TypeScript types
   - `cdk.json` - CDK configuration
   - `tsconfig.json` - TypeScript configuration
3. Use `__STACK_CLASS__` as a placeholder for the stack class name (will be replaced)

### CLI Templates

To modify CLI app templates:

1. Navigate to `scripts/rapid/templates/cli/`
2. Edit any of the template files:
   - `cli.ts` - CLI entry point
   - `example.ts` - Example command
   - `index.ts` - Main export
   - `tsconfig.json` - TypeScript configuration
3. Use `__APP_NAME__` and `__APP_DESCRIPTION__` as placeholders

### Helper Functions

Helper functions are organized by purpose:

- **ui.sh**: Modify colors, icons, or display messages
- **validation.sh**: Add or modify validation logic
- **cloud.sh**: Modify cloud app creation logic
- **react.sh**: Modify React setup and CSS framework installation

## Usage

Run the main script from the workspace root:

```bash
pnpm rapid
```

Or directly:

```bash
./scripts/rapid/rapid.sh
```

## Adding New Templates

1. Create a new directory under `templates/react/` for a new CSS framework
2. Add the template files (App.tsx, Home.tsx, About.tsx, Dashboard.tsx)
3. Update `helpers/react.sh` to add a new setup function
4. Add a new case in the CSS framework selection menu

## Template Placeholders

Templates use the following placeholders that are replaced during generation:

- `__STACK_CLASS__`: Replaced with PascalCase stack class name
- `__APP_NAME__`: Replaced with the app name
- `__APP_DESCRIPTION__`: Replaced with the app description
