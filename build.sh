#!/bin/bash

# build.sh - Build script for ccported.github.io TypeScript compilation
# This script compiles TypeScript files to JavaScript and generates documentation

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print with timestamp
log() {
  echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
  echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

warn() {
  echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  error "npm is not installed. Please install Node.js and npm first."
  exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  log "Installing dependencies..."
  npm install
fi

# Compile TypeScript
log "Compiling TypeScript..."
npm run build

# Check if compilation was successful
if [ $? -eq 0 ]; then
  log "TypeScript compilation completed successfully."
else
  error "TypeScript compilation failed."
  exit 1
fi

# Generate documentation if --docs flag is provided
if [[ "$*" == *"--docs"* ]]; then
  log "Generating documentation..."
  npm run docs
  
  if [ $? -eq 0 ]; then
    log "Documentation generated successfully."
  else
    error "Documentation generation failed."
    exit 1
  fi
fi

# Copy compiled JS files to their original locations
log "Copying compiled JavaScript files to their original locations..."
cp -r dist/static/* static/

log "Build completed successfully!"
