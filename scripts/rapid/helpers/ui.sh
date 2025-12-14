#!/bin/bash

# UI Helper Functions for Rapid Script

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
