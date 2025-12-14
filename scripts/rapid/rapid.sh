#!/bin/bash

# Bootstrap Application Script
# Creates a new application in the apps directory with proper structure

# Get the workspace root (two levels up from this script)
WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APPS_DIR="${WORKSPACE_ROOT}/apps"

# Source helper functions
source "$(dirname "${BASH_SOURCE[0]}")/helpers/ui.sh"
source "$(dirname "${BASH_SOURCE[0]}")/helpers/validation.sh"
source "$(dirname "${BASH_SOURCE[0]}")/helpers/cloud.sh"
source "$(dirname "${BASH_SOURCE[0]}")/helpers/react.sh"

# Main script
print_header

# Ask for application type
ask_question "What type of application do you want to create?"
echo -e "  ${CYAN}1)${NC} Cloud Application (AWS CDK + optional React frontend)"
echo -e "  ${CYAN}2)${NC} CLI Application (TypeScript CLI tool)"
echo ""
read -p "$(echo -e "${ARROW} Enter your choice [1-2]: ")" app_type

case $app_type in
    1)
        APP_TYPE="cloud"
        print_info "Selected: Cloud Application"
        ;;
    2)
        APP_TYPE="cli"
        print_info "Selected: CLI Application"
        ;;
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""

# Ask for app name
while true; do
    ask_question "What is the name of your application?"
    print_info "Use lowercase letters, numbers, and hyphens only (e.g., 'my-awesome-app')"
    read -p "$(echo -e "${ARROW} App name: ")" app_name
    
    validate_app_name "$app_name"
    result=$?
    
    if [ $result -eq 1 ]; then
        print_error "Invalid app name. Use only lowercase letters, numbers, and hyphens."
    elif [ $result -eq 2 ]; then
        print_error "App '${app_name}' already exists!"
    else
        print_success "App name '${app_name}' is valid"
        break
    fi
done

echo ""

# Ask for app description
ask_question "Provide a brief description of your application:"
read -p "$(echo -e "${ARROW} Description: ")" app_description
print_success "Description set"

echo ""

# For cloud apps, ask about frontend and environments
INCLUDE_FRONTEND=false
if [ "$APP_TYPE" = "cloud" ]; then
    ask_question "Do you want to include a frontend?"
    read -p "$(echo -e "${ARROW} Include frontend? [y/N]: ")" include_frontend
    
    if [[ $include_frontend =~ ^[Yy]$ ]]; then
        INCLUDE_FRONTEND=true
        print_success "Will include frontend with Vite (you'll select the framework next)"
    else
        print_info "Skipping frontend"
    fi
    echo ""
    
    # Ask about environments
    ask_question "Do you want to use the default environments (dev, test, prod)?"
    read -p "$(echo -e "${ARROW} Use defaults? [Y/n]: ")" use_default_envs

    if [[ $use_default_envs =~ ^[Nn]$ ]]; then
        ask_question "Enter your custom environments (comma-separated, e.g., dev,qa,staging,prod):"
        read -p "$(echo -e "${ARROW} Environments: ")" custom_envs
        ENVIRONMENTS=${custom_envs}
        print_success "Custom environments set: ${ENVIRONMENTS}"
    else
        ENVIRONMENTS="dev,test,prod"
        print_success "Using default environments: dev, test, prod"
    fi
fi

echo ""
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${CYAN}  📋 Configuration Summary${NC}"
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "  ${WHITE}Type:${NC}         ${YELLOW}${APP_TYPE}${NC}"
echo -e "  ${WHITE}Name:${NC}         ${YELLOW}${app_name}${NC}"
echo -e "  ${WHITE}Description:${NC}  ${YELLOW}${app_description}${NC}"
if [ "$APP_TYPE" = "cloud" ]; then
    if [ "$INCLUDE_FRONTEND" = true ]; then
        echo -e "  ${WHITE}Frontend:${NC}     ${YELLOW}Yes (Vite)${NC}"
    else
        echo -e "  ${WHITE}Frontend:${NC}     ${YELLOW}No${NC}"
    fi
    echo -e "  ${WHITE}Environments:${NC} ${YELLOW}${ENVIRONMENTS}${NC}"
fi
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════${NC}"
echo ""

read -p "$(echo -e "${ARROW} Proceed with creation? [Y/n]: ")" confirm
if [[ $confirm =~ ^[Nn]$ ]]; then
    print_warning "Cancelled by user"
    exit 0
fi

echo ""
print_step "Creating application structure..."

# Create app directory
APP_DIR="${APPS_DIR}/${app_name}"
mkdir -p "${APP_DIR}"

if [ "$APP_TYPE" = "cloud" ]; then
    # Create cloud app structure
    print_step "Setting up cloud application..."
    
    # Create directories
    mkdir -p "${APP_DIR}/cdk/stacks"
    mkdir -p "${APP_DIR}/cdk/constructs"
    mkdir -p "${APP_DIR}/lambdas"
    
    if [ "$INCLUDE_FRONTEND" = true ]; then
        mkdir -p "${APP_DIR}/frontend"
    fi
    
    # Create package.json
    print_step "Creating package configuration..."
    create_cloud_package_json "${app_name}" "${app_description}" "${ENVIRONMENTS}" "${INCLUDE_FRONTEND}" "${APP_DIR}"
    print_success "Package.json created"
    
    # Create tsconfig.json
    cat > "${APP_DIR}/tsconfig.json" <<'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./cdk"
  },
  "include": ["cdk/**/*"],
  "exclude": ["node_modules", "dist", "lambdas", "frontend"]
}
EOF
    print_success "CDK tsconfig.json created"
    
    # Convert app name to PascalCase for class names (handles letters and numbers)
    PASCAL_CASE_NAME=$(echo "$app_name" | perl -pe 's/(^|-)([a-z0-9])/\U$2/g')
    
    # Create CDK app.ts from template
    print_step "Creating CDK application entry point..."
    sed "s/__STACK_CLASS__/${PASCAL_CASE_NAME}/g" "${WORKSPACE_ROOT}/scripts/rapid/templates/cloud/app.ts" | grep -v "@ts-nocheck" > "${APP_DIR}/cdk/app.ts"
    print_success "CDK entry point created"
    
    # Create CDK stack from template
    print_step "Creating CDK stack..."
    sed "s/__STACK_CLASS__/${PASCAL_CASE_NAME}/g" "${WORKSPACE_ROOT}/scripts/rapid/templates/cloud/Stack.ts" | grep -v "@ts-nocheck" > "${APP_DIR}/cdk/stacks/${PASCAL_CASE_NAME}Stack.ts"
    print_success "CDK stack created"
    
    # Create cdk.json from template
    cp "${WORKSPACE_ROOT}/scripts/rapid/templates/cloud/cdk.json" "${APP_DIR}/cdk.json"
    print_success "cdk.json created"
    
    # Create config files
    print_step "Creating configuration files..."
    cp "${WORKSPACE_ROOT}/scripts/rapid/templates/cloud/types.ts" "${APP_DIR}/cdk/types.ts"
    create_cloud_config "${app_name}" "${APP_DIR}" "${ENVIRONMENTS}"
    print_success "Configuration created with environments: ${ENVIRONMENTS}"
    
    # Create frontend app if needed
    if [ "$INCLUDE_FRONTEND" = true ]; then
        print_step "Initializing frontend application with Vite..."
        print_info "Vite will now ask you to select a framework and variant"
        cd "${APP_DIR}"
        pnpm create vite@latest frontend
        print_success "Frontend app initialized"
        
        # Check if React was selected by looking at package.json
        if grep -q '"react"' "${APP_DIR}/frontend/package.json" 2>/dev/null; then
            setup_react_frontend "${APP_DIR}" "${WORKSPACE_ROOT}"
        fi
        
        # Install frontend dependencies (outside of workspace)
        print_step "Installing frontend dependencies..."
        cd "${APP_DIR}/frontend"
        # Use npm instead of pnpm to avoid workspace issues
        npm install
        print_success "Frontend dependencies installed"
        cd "${WORKSPACE_ROOT}"
    fi
    
    # Create root README
    print_step "Creating documentation..."
    IFS=',' read -ra ENV_ARRAY <<< "$ENVIRONMENTS"
    
    cat > "${APP_DIR}/README.md" <<READMEEOF
# ${app_name}

${app_description}

## Structure

\`\`\`
${app_name}/
├── cdk/              # AWS CDK infrastructure
│   ├── app.ts        # CDK app entry point
│   ├── config.ts     # Environment configuration
│   ├── types.ts      # TypeScript type definitions
│   ├── stacks/       # CDK stacks
│   └── constructs/   # Reusable CDK constructs
├── lambdas/          # Lambda function handlers
READMEEOF
    
    if [ "$INCLUDE_FRONTEND" = true ]; then
        cat >> "${APP_DIR}/README.md" <<'EOF'
├── frontend/         # Frontend application
EOF
    fi
    
    cat >> "${APP_DIR}/README.md" <<READMEEOF2
└── README.md         # This file
\`\`\`

## Configuration

This application supports the following environments:
READMEEOF2
    
    for env in "${ENV_ARRAY[@]}"; do
        env=$(echo "$env" | xargs)
        echo "- ${env}" >> "${APP_DIR}/README.md"
    done
    
    cat >> "${APP_DIR}/README.md" <<READMEEOF3

Configuration is managed via the \`config.ts\` file using the \`ConfigController\`.

## Development

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- AWS CLI configured with appropriate credentials

### Installation

\`\`\`bash
# From the workspace root
pnpm install
\`\`\`

### CDK Commands

\`\`\`bash
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
\`\`\`

### Deploy to specific environment

\`\`\`bash
pnpm cdk deploy -c stage=prod
\`\`\`

READMEEOF3
    
    if [ "$INCLUDE_FRONTEND" = true ]; then
        cat >> "${APP_DIR}/README.md" <<'EOF'
### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm build
```

EOF
    fi
    
    print_success "Documentation created"
    
else
    # Create CLI app structure (keeping existing implementation)
    print_step "Setting up CLI application..."
    
    mkdir -p "${APP_DIR}/src/commands"
    mkdir -p "${APP_DIR}/src/utils"
    
    # Create package.json
    print_step "Creating package configuration..."
    cat > "${APP_DIR}/package.json" <<EOF
{
  "name": "@rapid/${app_name}",
  "version": "1.0.0",
  "description": "${app_description}",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
    "${app_name}": "./dist/cli.js"
  },
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "clean": "rm -rf dist",
    "dev": "ts-node src/cli.ts",
    "start": "node dist/cli.js"
  },
  "dependencies": {
    "@rapid/constants": "workspace:*",
    "@rapid/errors": "workspace:*",
    "@rapid/types": "workspace:*",
    "@rapid/utilities": "workspace:*",
    "commander": "^12.1.0",
    "chalk": "^4.1.2",
    "inquirer": "^8.2.6"
  },
  "devDependencies": {
    "@types/inquirer": "^9.0.7",
    "@types/node": "^22.10.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.2"
  }
}
EOF
    print_success "Package.json created"
    
    # Create tsconfig.json
    cat > "${APP_DIR}/tsconfig.json" <<'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
    print_success "tsconfig.json created"
    
    # Create CLI entry point
    print_step "Creating CLI entry point..."
    cat > "${APP_DIR}/src/cli.ts" <<EOF
#!/usr/bin/env node
import { Command } from 'commander';
import { exampleCommand } from './commands/example';

const program = new Command();

program
  .name('${app_name}')
  .description('${app_description}')
  .version('1.0.0');

// Register commands
program.addCommand(exampleCommand);

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
EOF
    print_success "CLI entry point created"
    
    # Create example command
    print_step "Creating example command..."
    cat > "${APP_DIR}/src/commands/example.ts" <<'EOF'
import { delay } from '@rapid/utilities';
import chalk from 'chalk';
import { Command } from 'commander';

interface ExampleOptions {
  name: string;
}

// Simulate an async operation (e.g., API call, file I/O, etc.)
async function simulateAsyncOperation(name: string): Promise<string> {
  await delay(1000);
  return `Hello, ${name}!`;
}

export const exampleCommand = new Command('example')
  .description('Example command')
  .option('-n, --name <name>', 'Name to greet', 'World')
  .action(async (options: ExampleOptions) => {
    console.log(chalk.blue('Processing...'));
    const message = await simulateAsyncOperation(options.name);
    console.log(chalk.green(message));
  });
EOF
    print_success "Example command created"
    
    # Create index file
    cat > "${APP_DIR}/src/index.ts" <<'EOF'
export * from './cli';
EOF
    
    # Create README
    print_step "Creating documentation..."
    cat > "${APP_DIR}/README.md" <<READMEEOF
# ${app_name}

${app_description}

## Installation

\`\`\`bash
# From the workspace root
pnpm install

# Build the CLI
cd apps/${app_name}
pnpm build
\`\`\`

## Usage

\`\`\`bash
# Run in development mode
pnpm dev

# After building
pnpm start

# Or use the binary directly
./${app_name} --help
\`\`\`

## Commands

- \`example\` - Example command that greets a user

## Development

Add new commands in \`src/commands/\` and register them in \`src/cli.ts\`.

## Structure

\`\`\`
${app_name}/
├── src/
│   ├── commands/     # CLI commands
│   ├── utils/        # Utility functions
│   ├── cli.ts        # CLI entry point
│   └── index.ts      # Main export
├── dist/             # Compiled output
├── package.json
├── tsconfig.json
└── README.md
\`\`\`
READMEEOF
    print_success "Documentation created"
fi

echo ""
print_step "Installing dependencies..."
cd "${WORKSPACE_ROOT}"
pnpm install
print_success "Dependencies installed"

echo ""
print_step "Running lint:fix to ensure code quality..."
pnpm lint:fix
print_success "Linting completed"

echo ""
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}  ✨ Application created successfully! ✨${NC}"
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
print_info "Location: ${APP_DIR}"
echo ""
print_step "Next steps:"
echo -e "  ${CYAN}1.${NC} cd apps/${app_name}"
if [ "$APP_TYPE" = "cloud" ]; then
    echo -e "  ${CYAN}2.${NC} pnpm build"
    echo -e "  ${CYAN}3.${NC} pnpm synth"
    if [ "$INCLUDE_FRONTEND" = true ]; then
        echo -e "  ${CYAN}4.${NC} cd frontend && npm run dev"
    fi
else
    echo -e "  ${CYAN}2.${NC} pnpm build"
    echo -e "  ${CYAN}3.${NC} pnpm dev"
fi
echo ""
print_success "Happy coding! 🚀"
echo ""
