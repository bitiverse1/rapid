#!/bin/bash

# Validation Helper Functions for Rapid Script

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
