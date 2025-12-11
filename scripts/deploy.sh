#!/bin/bash
# Deploy script example
# This script would orchestrate deployment across environments

set -e

ENVIRONMENT=${1:-dev}

echo "Deploying to $ENVIRONMENT environment..."

# Build all packages
echo "Building packages..."
pnpm build

# Run tests
echo "Running tests..."
pnpm test

# Deploy CDK stacks
echo "Deploying infrastructure..."
# cd apps/your-app && cdk deploy --all

echo "Deployment to $ENVIRONMENT complete!"
