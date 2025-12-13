# example-cli

Example cli application

## Installation

```bash
# From the workspace root
pnpm install

# Build the CLI
cd apps/example-cli
pnpm build
```

## Usage

```bash
# Run in development mode
pnpm dev

# After building
pnpm start

# Or use the binary directly
./example-cli --help
```

## Commands

- `example` - Example command that greets a user

## Development

Add new commands in `src/commands/` and register them in `src/cli.ts`.

## Structure

```
example-cli/
├── src/
│   ├── commands/     # CLI commands
│   ├── utils/        # Utility functions
│   ├── cli.ts        # CLI entry point
│   └── index.ts      # Main export
├── dist/             # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```
