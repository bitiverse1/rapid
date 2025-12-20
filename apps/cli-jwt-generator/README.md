# cli-jwt-generator

A command-line tool for generating JWT tokens with support for multiple signing algorithms.

## Features

- 🔐 Support for multiple JWT algorithms (HS256, HS384, HS512, RS256, RS384, RS512, ES256, ES384, ES512)
- 🔑 Automatic key generation (symmetric and asymmetric)
- 📝 Customizable JWT payload templates
- 💾 Option to save tokens to files
- 🎨 Beautiful colored terminal output

## Installation

```bash
# From the workspace root
pnpm install

# Build the CLI
cd apps/cli-jwt-generator
pnpm build
```

## Usage

### 1. Initialize Configuration

First, run with `--init` or `-i` to set up your JWT configuration:

```bash
pnpm dev --init
# or after building:
pnpm start -i
```

This will:
- Prompt you to select a signing algorithm
- Generate the appropriate keys (secret key for HS* algorithms, public/private key pair for RS*/ES* algorithms)
- Create a default JWT header and payload
- Save everything to `.jwt-config/` directory

### 2. Customize Payload (Optional)

Edit `.jwt-config/header.json` to customize the JWT header:

```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

Edit `.jwt-config/payload.json` to customize your JWT claims:

```json
{
  "iss": "your-issuer",
  "sub": "1234567890",
  "aud": "your-audience",
  "exp": 1766208835,
  "iat": 1766205235,
  "nbf": 1766205235,
  "jti": "unique-token-id"
}
```

**Standard JWT Claims:**
- `iss` - Issuer (who created the token)
- `sub` - Subject (user or entity ID)
- `aud` - Audience (who the token is for)
- `exp` - Expiration time (Unix timestamp)
- `iat` - Issued at (Unix timestamp)
- `nbf` - Not valid before (Unix timestamp)
- `jti` - Unique token ID

### 3. Generate JWT Token

Generate a JWT token using your configuration:

```bash
pnpm dev --generate
# or short form:
pnpm dev -g
```

To save the token to a file:

```bash
pnpm dev -g -o token.txt
# or
pnpm dev --generate --output token.txt
```

### 4. Validate JWT Token

Validate a JWT token:

```bash
# Validate token directly
pnpm dev -v -t "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."

# Validate token from file
pnpm dev -v -f token.txt

# Or long form
pnpm dev --validate --file token.txt
```

## Commands

All commands use flat flags instead of subcommands:

### `-i, --init`
Initialize JWT configuration with algorithm selection and key generation.

**Example:**
```bash
pnpm dev -i
```

### `-g, --generate`
Generate a JWT token using the configured template.

**Options:**
- `-o, --output <file>` - Save the JWT token to a file

**Examples:**
```bash
pnpm dev -g
pnpm dev -g -o token.txt
```

### `-v, --validate`
Validate a JWT token and check its time-based claims.

**Options:**
- `-t, --token <token>` - JWT token string to validate
- `-f, --file <file>` - File path containing the JWT token

**Examples:**
```bash
pnpm dev -v -t "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
pnpm dev -v -f token.txt
```

## Supported Algorithms

- **HS256, HS384, HS512** - HMAC with SHA (symmetric)
- **RS256, RS384, RS512** - RSA with SHA (asymmetric)
- **ES256, ES384, ES512** - ECDSA with SHA (asymmetric)

## Configuration Files

All configuration files are stored in `.jwt-config/`:
- `header.json` - JWT header with algorithm and type
- `payload.json` - JWT payload/claims (iss, sub, aud, exp, iat, nbf, jti)
- `keys/secret.key` - Symmetric key (for HS* algorithms)
- `keys/private.key` - Private key (for RS*/ES* algorithms)
- `keys/public.key` - Public key (for RS*/ES* algorithms)

## Example Output

```
🔑 Generating JWT Token

Algorithm: HS256
Payload: {
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}

✓ Token generated successfully!

JWT Token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

────────────────────────────────────────────────────────────
Token Details:
Header: {
  "alg": "HS256",
  "typ": "JWT"
}
Payload: {
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
────────────────────────────────────────────────────────────
```

## Development

Add new commands in `src/commands/` and register them in `src/cli.ts`.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

The test suite includes:
- Symmetric key (HS256) token generation and validation
- Asymmetric key (RS256) token generation and validation
- Time-based claim validation (exp, iat, nbf)
- Token structure verification
- Error handling for invalid/expired tokens

## Structure

```
cli-jwt-generator/
├── src/
│   ├── commands/     # CLI commands
│   │   ├── init.ts      # Initialize JWT config
│   │   └── generate.ts  # Generate JWT tokens
│   ├── utils/        # Utility functions
│   ├── cli.ts        # CLI entry point
│   └── index.ts      # Main export
├── dist/             # Compiled output
├── .jwt-config/      # Generated configuration (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```
