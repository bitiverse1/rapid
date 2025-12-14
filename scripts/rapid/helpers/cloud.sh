#!/bin/bash

# Cloud App Helper Functions for Rapid Script

create_cloud_package_json() {
    local app_name=$1
    local app_description=$2
    local environments=$3
    local include_frontend=$4
    local app_dir=$5
    
    # Use Node.js to generate package.json with proper JSON formatting
    node -e "
    const envs = '${environments}'.split(',').map(e => e.trim());
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
    if (${include_frontend}) {
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
    " > "${app_dir}/package.json"
}

create_cloud_config() {
    local app_name=$1
    local app_dir=$2
    local environments=$3
    
    IFS=',' read -ra ENV_ARRAY <<< "$environments"
    
    # Start config file
    cat > "${app_dir}/cdk/config.ts" <<'EOF'
import { AWS_REGIONS, LOG_LEVELS } from '@rapid/constants';
import type { AppConfig } from './types';

export const configs: Record<string, AppConfig> = {
EOF
    
    # Add each environment
    for env in "${ENV_ARRAY[@]}"; do
        env=$(echo "$env" | xargs) # trim whitespace
        cat >> "${app_dir}/cdk/config.ts" <<CONFIGEOF
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
    cat >> "${app_dir}/cdk/config.ts" <<'EOF'
};
EOF
}
