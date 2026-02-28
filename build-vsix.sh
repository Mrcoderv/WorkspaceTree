#!/bin/bash

# WorkspaceTree VSIX Generator - One Click Build
# This script compiles the TypeScript extension and creates a ready-to-distribute VSIX package

set -e

echo "🚀 WorkspaceTree VSIX Generator"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Building extension...${NC}"
npm run compile

echo ""
echo -e "${BLUE}📦 Creating VSIX package...${NC}"
npx vsce package --no-update-package-json

echo ""
echo -e "${GREEN}✅ Success!${NC}"
echo ""

# Find the VSIX file
VSIX_FILE=$(ls -t workspace-tree-*.vsix 2>/dev/null | head -1)

if [ -n "$VSIX_FILE" ]; then
  FILE_SIZE=$(ls -lh "$VSIX_FILE" | awk '{print $5}')
  echo "📁 Package created: $VSIX_FILE ($FILE_SIZE)"
  echo ""
  echo "📋 Installation Instructions:"
  echo "   • Open VS Code"
  echo "   • Go to Extensions (Ctrl+Shift+X)"
  echo "   • Click '...' menu and select 'Install from VSIX...'"
  echo "   • Select $VSIX_FILE"
  echo ""
  echo "🚀 Ready to upload to VS Code Marketplace!"
else
  echo "❌ Error: VSIX file not found"
  exit 1
fi
