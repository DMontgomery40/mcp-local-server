#!/bin/bash

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
  git init
  git remote add origin https://github.com/DMontgomery40/mcp-local-server.git
fi

# Add all files
git add .

# Commit
git commit -m "Initial commit: BirdNet-Pi MCP server implementation

- Added BirdNet-Pi data integration
- Added visualization capabilities
- Added reporting functionality
- Added setup scripts
- Added comprehensive documentation"

# Push to main branch
git push -u origin main