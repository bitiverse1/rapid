#!/bin/bash

# Bootstrap Application Script
# Creates a new application in the apps directory with proper structure

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Icons
CHECKMARK="${GREEN}✓${NC}"
CROSS="${RED}✗${NC}"
ARROW="${CYAN}➜${NC}"
STAR="${YELLOW}★${NC}"

# Get the workspace root (parent of scripts directory)
WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APPS_DIR="${WORKSPACE_ROOT}/apps"

# Helper functions
print_header() {
    echo ""
    echo -e "${BOLD}${MAGENTA}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${MAGENTA}  🚀 RAPID Application Bootstrap${NC}"
    echo -e "${BOLD}${MAGENTA}═══════════════════════════════════════════════════════${NC}"
    echo ""
}

print_step() {
    echo -e "${ARROW} ${BOLD}${WHITE}$1${NC}"
}

print_success() {
    echo -e "${CHECKMARK} ${GREEN}$1${NC}"
}

print_error() {
    echo -e "${CROSS} ${RED}$1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ${NC}  ${CYAN}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC}  ${YELLOW}$1${NC}"
}

ask_question() {
    echo -e "${STAR} ${BOLD}${WHITE}$1${NC}"
}

# Validate app name
validate_app_name() {
    local name=$1
    if [[ ! $name =~ ^[a-z0-9-]+$ ]]; then
        return 1
    fi
    if [ -d "${APPS_DIR}/${name}" ]; then
        return 2
    fi
    return 0
}

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
    
    # Create package.json with environment-specific scripts
    print_step "Creating package configuration..."
    
    # Parse environments for script generation
    IFS=',' read -ra ENV_ARRAY <<< "$ENVIRONMENTS"
    
    # Use Node.js to generate package.json with proper JSON formatting
    node -e "
    const envs = '${ENVIRONMENTS}'.split(',').map(e => e.trim());
    const scripts = {
      'build': 'tsc',
      'watch': 'tsc --watch',
      'clean': 'rm -rf dist',
      'cdk': 'cdk'
    };
    
    envs.forEach(env => {
      scripts[\`deploy:\${env}\`] = \`cdk deploy -c stage=\${env}\`;
      scripts[\`synth:\${env}\`] = \`cdk synth -c stage=\${env}\`;
      scripts[\`diff:\${env}\`] = \`cdk diff -c stage=\${env}\`;
      scripts[\`destroy:\${env}\`] = \`cdk destroy -c stage=\${env}\`;
    });
    
    // Add dev script if frontend is included
    if (${INCLUDE_FRONTEND}) {
      scripts['dev'] = 'npm --prefix frontend run dev';
    }
    
    const pkg = {
      name: '@rapid/${app_name}',
      version: '1.0.0',
      description: '${app_description}',
      main: 'dist/cdk/app.js',
      types: 'dist/cdk/app.d.ts',
      scripts,
      dependencies: {
        '@rapid/cdk': 'workspace:*',
        '@rapid/config': 'workspace:*',
        '@rapid/constants': 'workspace:*',
        '@rapid/types': 'workspace:*',
        'aws-cdk-lib': '^2.161.1',
        'constructs': '^10.0.0'
      },
      devDependencies: {
        '@types/node': '^22.10.1',
        'aws-cdk': '^2.161.1',
        'typescript': '^5.7.2'
      }
    };
    
    console.log(JSON.stringify(pkg, null, 2));
    " > "${APP_DIR}/package.json"
    
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
    
    # Create CDK bin file
    print_step "Creating CDK application entry point..."
    cat > "${APP_DIR}/cdk/app.ts" <<'EOF'
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { getConfig } from '@rapid/config';
import { PASCAL_CASE_NAMEStack } from './stacks/PASCAL_CASE_NAMEStack';
import { configs } from './config';

const app = new cdk.App();

// Get stage from context or default to 'dev'
const stage = (app.node.tryGetContext('stage') as string | undefined) || 'dev';

// Get configuration controller for the stage
const configCtrl = getConfig(configs, stage);

new PASCAL_CASE_NAMEStack(app, `PASCAL_CASE_NAMEStack-${configCtrl.get('stage')}`, {
  env: {
    account: configCtrl.get('awsAccountId'),
    region: configCtrl.get('awsRegion'),
  },
  configCtrl,
  tags: {
    Project: configCtrl.get('project'),
    Environment: configCtrl.get('stage'),
    ...Object.fromEntries(configCtrl.get('tags')?.map(tag => [tag.key, tag.value]) || []),
  },
});

app.synth();
EOF
    sed -i '' "s/PASCAL_CASE_NAME/${PASCAL_CASE_NAME}/g" "${APP_DIR}/cdk/app.ts"
    print_success "CDK entry point created"
    
    # Create CDK stack
    print_step "Creating CDK stack..."
    cat > "${APP_DIR}/cdk/stacks/${PASCAL_CASE_NAME}Stack.ts" <<'EOF'
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import type { ConfigController } from '@rapid/config';
import type { AppConfig } from '../types';

export interface PASCAL_CASE_NAMEStackProps extends cdk.StackProps {
  configCtrl: ConfigController<AppConfig>;
}

export class PASCAL_CASE_NAMEStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PASCAL_CASE_NAMEStackProps) {
    super(scope, id, props);

    const { configCtrl } = props;

    // TODO: Add your AWS resources here
    
    // Example: Output the stage
    new cdk.CfnOutput(this, 'Stage', {
      value: configCtrl.get('stage'),
      description: 'Deployment stage',
    });
  }
}
EOF
    sed -i '' "s/PASCAL_CASE_NAME/${PASCAL_CASE_NAME}/g" "${APP_DIR}/cdk/stacks/${PASCAL_CASE_NAME}Stack.ts"
    print_success "CDK stack created"
    
    # Create cdk.json (this is a large file, keeping it as-is)
    cat > "${APP_DIR}/cdk.json" <<'EOF'
{
  "app": "npx ts-node cdk/app.ts",
  "watch": {
    "include": ["**"],
    "exclude": [
      "README.md",
      "cdk*.json",
      "**/*.d.ts",
      "**/*.js",
      "tsconfig.json",
      "package*.json",
      "yarn.lock",
      "node_modules",
      "dist"
    ]
  },
  "context": {
    "@aws-cdk/aws-lambda:recognizeLayerVersion": true,
    "@aws-cdk/core:checkSecretUsage": true,
    "@aws-cdk/core:target-partitions": ["aws"],
    "@aws-cdk-containers/ecs-service-extensions:enableDefaultLogDriver": true,
    "@aws-cdk/aws-ec2:uniqueImdsv2TemplateName": true,
    "@aws-cdk/aws-ecs:arnFormatIncludesClusterName": true,
    "@aws-cdk/aws-iam:minimizePolicies": true,
    "@aws-cdk/core:validateSnapshotRemovalPolicy": true,
    "@aws-cdk/aws-codepipeline:crossAccountKeyAliasStackSafeResourceName": true,
    "@aws-cdk/aws-s3:createDefaultLoggingPolicy": true,
    "@aws-cdk/aws-sns-subscriptions:restrictSqsDescryption": true,
    "@aws-cdk/aws-apigateway:disableCloudWatchRole": true,
    "@aws-cdk/core:enablePartitionLiterals": true,
    "@aws-cdk/aws-events:eventsTargetQueueSameAccount": true,
    "@aws-cdk/aws-iam:standardizedServicePrincipals": true,
    "@aws-cdk/aws-ecs:disableExplicitDeploymentControllerForCircuitBreaker": true,
    "@aws-cdk/aws-iam:importedRoleStackSafeDefaultPolicyName": true,
    "@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy": true,
    "@aws-cdk/aws-route53-patters:useCertificate": true,
    "@aws-cdk/customresources:installLatestAwsSdkDefault": false,
    "@aws-cdk/aws-rds:databaseProxyUniqueResourceName": true,
    "@aws-cdk/aws-codedeploy:removeAlarmsFromDeploymentGroup": true,
    "@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId": true,
    "@aws-cdk/aws-ec2:launchTemplateDefaultUserData": true,
    "@aws-cdk/aws-secretsmanager:useAttachedSecretResourcePolicyForSecretTargetAttachments": true,
    "@aws-cdk/aws-redshift:columnId": true,
    "@aws-cdk/aws-stepfunctions-tasks:enableEmrServicePolicyV2": true,
    "@aws-cdk/aws-ec2:restrictDefaultSecurityGroup": true,
    "@aws-cdk/aws-apigateway:requestValidatorUniqueId": true,
    "@aws-cdk/aws-kms:aliasNameRef": true,
    "@aws-cdk/aws-autoscaling:generateLaunchTemplateInsteadOfLaunchConfig": true,
    "@aws-cdk/core:includePrefixInUniqueNameGeneration": true,
    "@aws-cdk/aws-efs:denyAnonymousAccess": true,
    "@aws-cdk/aws-opensearchservice:enableOpensearchMultiAzWithStandby": true,
    "@aws-cdk/aws-lambda-nodejs:useLatestRuntimeVersion": true,
    "@aws-cdk/aws-efs:mountTargetOrderInsensitiveLogicalId": true,
    "@aws-cdk/aws-rds:auroraClusterChangeScopeOfInstanceParameterGroupWithEachParameters": true,
    "@aws-cdk/aws-appsync:useArnForSourceApiAssociationIdentifier": true,
    "@aws-cdk/aws-rds:preventRenderingDeprecatedCredentials": true,
    "@aws-cdk/aws-codepipeline-actions:useNewDefaultBranchForCodeCommitSource": true,
    "@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction": true,
    "@aws-cdk/aws-codepipeline:crossAccountKeysDefaultValueToFalse": true,
    "@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2": true,
    "@aws-cdk/aws-kms:reduceCrossAccountRegionPolicyScope": true,
    "@aws-cdk/aws-eks:nodegroupNameAttribute": true,
    "@aws-cdk/aws-ec2:ebsDefaultGp3Volume": true,
    "@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm": true,
    "@aws-cdk/custom-resources:logApiResponseDataPropertyTrueDefault": false,
    "@aws-cdk/aws-s3:keepNotificationInImportedBucket": false
  }
}
EOF
    print_success "cdk.json created"
    
    # Create config structure
    print_step "Creating configuration files..."
    
    # Create config types
    cat > "${APP_DIR}/cdk/types.ts" <<'EOF'
import type { BaseConfig } from '@rapid/config';

export interface AppConfig extends BaseConfig {
  // Add your app-specific configuration here
}
EOF
    print_success "Config types created"
    
    # Parse environments and create config
    IFS=',' read -ra ENV_ARRAY <<< "$ENVIRONMENTS"
    
    # Start config file
    cat > "${APP_DIR}/cdk/config.ts" <<'EOF'
import { AWS_REGIONS, LOG_LEVELS } from '@rapid/constants';
import type { AppConfig } from './types';

export const configs: Record<string, AppConfig> = {
EOF
    
    # Add each environment
    for env in "${ENV_ARRAY[@]}"; do
        env=$(echo "$env" | xargs) # trim whitespace
        cat >> "${APP_DIR}/cdk/config.ts" <<CONFIGEOF
  ${env}: {
    stage: '${env}',
    project: '${app_name}',
    awsAccountId: '012345678901',
    awsRegion: AWS_REGIONS.US_WEST_2,
    logLevel: LOG_LEVELS.INFO,
    tags: [
      { key: 'Application', value: '${app_name}' },
      { key: 'ManagedBy', value: 'CDK' },
    ],
  },
CONFIGEOF
    done
    
    # Finish config file
    cat >> "${APP_DIR}/cdk/config.ts" <<'EOF'
};
EOF
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
            print_step "Setting up React Router and folder structure..."
            cd "${APP_DIR}/frontend"
            
            # Install React Router
            npm install react-router-dom
            
            # Create folder structure
            mkdir -p src/components src/context src/pages
            
            echo ""
            ask_question "Which CSS framework would you like to use with React?"
            echo -e "  ${CYAN}1)${NC} None (plain CSS)"
            echo -e "  ${CYAN}2)${NC} Material-UI (MUI) ${YELLOW}[default]${NC}"
            echo -e "  ${CYAN}3)${NC} Tailwind CSS"
            echo -e "  ${CYAN}4)${NC} AWS Cloudscape"
            echo ""
            read -p "$(echo -e "${ARROW} Enter your choice [1-4, default=2]: ")" css_choice
            css_choice=${css_choice:-2}
            
            case $css_choice in
                2)
                    print_step "Installing Material-UI..."
                    npm install @mui/material @emotion/react @emotion/styled
                    
                    # Add CSS for full-screen layout
                    cat > src/index.css <<'MUICSS'
html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}
MUICSS
                    
                    # Create MUI example pages
                    cat > src/pages/Home.tsx <<'MUIHOME'
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Your App
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Built with React, Material-UI, and React Router
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" component={Link} to="/about" sx={{ mr: 2 }}>
            About
          </Button>
          <Button variant="outlined" component={Link} to="/dashboard">
            Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
MUIHOME

                    cat > src/pages/About.tsx <<'MUIABOUT'
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" paragraph>
          This is a sample application built with React, Material-UI, and React Router.
        </Typography>
        <Typography variant="body1" paragraph>
          Material-UI provides a comprehensive set of UI components that follow Google's Material Design guidelines.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" component={Link} to="/">
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
MUIABOUT

                    cat > src/pages/Dashboard.tsx <<'MUIDASH'
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Card 1
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This is a sample card component
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Card 2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Another sample card component
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Card 3
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yet another sample card
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" component={Link} to="/">
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
MUIDASH

                    # Create App.tsx with MUI
                    cat > src/App.tsx <<'MUIAPP'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                My App
              </Typography>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/about">
                About
              </Button>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
            </Toolbar>
          </AppBar>
          <Box sx={{ flexGrow: 1, bgcolor: 'background.default', overflow: 'auto' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
MUIAPP
                    print_success "Material-UI installed and configured with example pages"
                    ;;
                3)
                    print_step "Installing Tailwind CSS..."
                    npm install -D tailwindcss postcss autoprefixer
                    npx tailwindcss init -p
                    
                    # Configure Tailwind
                    cat > tailwind.config.js <<'TAILWINDEOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
TAILWINDEOF
                    
                    # Add Tailwind directives to CSS
                    cat > src/index.css <<'TAILWINDCSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}
TAILWINDCSS

                    # Create Tailwind example pages
                    cat > src/pages/Home.tsx <<'TAILWINDHOME'
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to Your App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Built with React, Tailwind CSS, and React Router
        </p>
        <div className="space-x-4">
          <Link
            to="/about"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            About
          </Link>
          <Link
            to="/dashboard"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
TAILWINDHOME

                    cat > src/pages/About.tsx <<'TAILWINDABOUT'
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About</h1>
        <p className="text-gray-700 mb-4">
          This is a sample application built with React, Tailwind CSS, and React Router.
        </p>
        <p className="text-gray-700 mb-6">
          Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
TAILWINDABOUT

                    cat > src/pages/Dashboard.tsx <<'TAILWINDDASH'
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Card 1</h2>
          <p className="text-gray-600 mb-4">This is a sample card component</p>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Learn More →
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Card 2</h2>
          <p className="text-gray-600 mb-4">Another sample card component</p>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Learn More →
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Card 3</h2>
          <p className="text-gray-600 mb-4">Yet another sample card</p>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Learn More →
          </button>
        </div>
      </div>
      <Link
        to="/"
        className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
TAILWINDDASH

                    # Create App.tsx with Tailwind
                    cat > src/App.tsx <<'TAILWINDAPP'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="text-2xl font-bold text-blue-600">My App</div>
              <div className="space-x-6">
                <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
                  Home
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">
                  About
                </Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex-grow overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
TAILWINDAPP
                    print_success "Tailwind CSS installed and configured with example pages"
                    ;;
                4)
                    print_step "Installing AWS Cloudscape..."
                    npm install @cloudscape-design/components @cloudscape-design/global-styles
                    
                    # Create Cloudscape example pages
                    cat > src/pages/Home.tsx <<'CLOUDSCAPEHOME'
import { Container, Header, SpaceBetween, Button, Box } from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <Container
      header={
        <Header variant="h1">
          Welcome to Your App
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Box variant="p">
          Built with React, AWS Cloudscape Design System, and React Router
        </Box>
        <SpaceBetween direction="horizontal" size="xs">
          <Button variant="primary" onClick={() => navigate('/about')}>
            About
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </SpaceBetween>
      </SpaceBetween>
    </Container>
  );
}
CLOUDSCAPEHOME

                    cat > src/pages/About.tsx <<'CLOUDSCAPEABOUT'
import { Container, Header, SpaceBetween, Button, Box } from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();
  
  return (
    <Container
      header={
        <Header variant="h1">
          About
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Box variant="p">
          This is a sample application built with React, AWS Cloudscape Design System, and React Router.
        </Box>
        <Box variant="p">
          Cloudscape is an open-source design system for building intuitive, engaging, and inclusive user experiences at scale.
        </Box>
        <Button onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </SpaceBetween>
    </Container>
  );
}
CLOUDSCAPEABOUT

                    cat > src/pages/Dashboard.tsx <<'CLOUDSCAPEDASH'
import { Container, Header, SpaceBetween, Button, Cards, Box } from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const items = [
    { name: 'Card 1', description: 'This is a sample card component' },
    { name: 'Card 2', description: 'Another sample card component' },
    { name: 'Card 3', description: 'Yet another sample card' },
  ];
  
  return (
    <SpaceBetween size="l">
      <Header variant="h1">Dashboard</Header>
      <Cards
        cardDefinition={{
          header: item => item.name,
          sections: [
            {
              id: 'description',
              content: item => item.description,
            },
          ],
        }}
        items={items}
        cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 3 }]}
      />
      <Button onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </SpaceBetween>
  );
}
CLOUDSCAPEDASH

                    # Create App.tsx with Cloudscape
                    cat > src/App.tsx <<'CLOUDSCAPEAPP'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AppLayout, TopNavigation, SpaceBetween } from '@cloudscape-design/components';
import '@cloudscape-design/global-styles/index.css';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';

function Navigation() {
  const navigate = useNavigate();
  
  return (
    <TopNavigation
      identity={{
        href: '/',
        title: 'My App',
        onFollow: (e) => {
          e.preventDefault();
          navigate('/');
        },
      }}
      utilities={[
        {
          type: 'button',
          text: 'Home',
          onClick: () => navigate('/'),
        },
        {
          type: 'button',
          text: 'About',
          onClick: () => navigate('/about'),
        },
        {
          type: 'button',
          text: 'Dashboard',
          onClick: () => navigate('/dashboard'),
        },
      ]}
    />
  );
}

function AppContent() {
  return (
    <>
      <Navigation />
      <AppLayout
        navigationHide
        toolsHide
        content={
          <SpaceBetween size="l">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </SpaceBetween>
        }
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
CLOUDSCAPEAPP
                    print_success "AWS Cloudscape installed and configured with example pages"
                    ;;
                *)
                    print_info "Skipping CSS framework installation"
                    
                    # Create basic pages without CSS framework
                    cat > src/pages/Home.tsx <<'BASICHOME'
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Your App</h1>
      <p>Built with React and React Router</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/about" style={{ marginRight: '1rem' }}>About</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}
BASICHOME

                    cat > src/pages/About.tsx <<'BASICABOUT'
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>About</h1>
      <p>This is a sample application built with React and React Router.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}
BASICABOUT

                    cat > src/pages/Dashboard.tsx <<'BASICDASH'
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
          <h2>Card 1</h2>
          <p>This is a sample card component</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
          <h2>Card 2</h2>
          <p>Another sample card component</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
          <h2>Card 3</h2>
          <p>Yet another sample card</p>
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}
BASICDASH

                    # Create App.tsx without CSS framework
                    cat > src/App.tsx <<'BASICAPP'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', backgroundColor: '#f8f9fa' }}>
          <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none', color: '#007bff' }}>Home</Link>
          <Link to="/about" style={{ marginRight: '1rem', textDecoration: 'none', color: '#007bff' }}>About</Link>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>Dashboard</Link>
        </nav>
        <div style={{ flexGrow: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
BASICAPP
                    print_success "React Router configured with basic example pages"
                    ;;
            esac
            
            print_success "React setup complete with routing and folder structure"
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
pnpm cdk deploy -c environment=prod
\`\`\`

READMEEOF3
    
    if [ "$INCLUDE_FRONTEND" = true ]; then
        cat >> "${APP_DIR}/README.md" <<'EOF'
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

EOF
    fi
    
    print_success "Documentation created"
    
else
    # Create CLI app structure
    print_step "Setting up CLI application..."
    
    mkdir -p "${APP_DIR}/src/commands"
    mkdir -p "${APP_DIR}/src/utils"
    
    # Create package.json
    print_step "Creating package configuration..."
    cat > "${APP_DIR}/package.json" <<'EOF'
{
  "name": "@rapid/APP_NAME",
  "version": "1.0.0",
  "description": "APP_DESCRIPTION",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
    "APP_NAME": "./dist/cli.js"
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
    sed -i '' "s/APP_NAME/${app_name}/g" "${APP_DIR}/package.json"
    sed -i '' "s/APP_DESCRIPTION/${app_description}/g" "${APP_DIR}/package.json"
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
    cat > "${APP_DIR}/src/cli.ts" <<'EOF'
#!/usr/bin/env node
import { Command } from 'commander';
import { exampleCommand } from './commands/example';

const program = new Command();

program
  .name('APP_NAME')
  .description('APP_DESCRIPTION')
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
    sed -i '' "s/APP_NAME/${app_name}/g" "${APP_DIR}/src/cli.ts"
    sed -i '' "s/APP_DESCRIPTION/${app_description}/g" "${APP_DIR}/src/cli.ts"
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
        echo -e "  ${CYAN}4.${NC} cd frontend && pnpm dev"
    fi
else
    echo -e "  ${CYAN}2.${NC} pnpm build"
    echo -e "  ${CYAN}3.${NC} pnpm dev"
fi
echo ""
print_success "Happy coding! 🚀"
echo ""
