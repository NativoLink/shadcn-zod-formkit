#!/bin/bash

echo "🚀 Testing New Features - shadcn-zod-formkit"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Build the library
echo -e "${BLUE}📦 Step 1: Building the library...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Build failed. Please check the errors above.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""

# Step 2: Start the example
echo -e "${BLUE}🎯 Step 2: Starting the example app...${NC}"
echo -e "${YELLOW}📝 The app will open at http://localhost:3000${NC}"
echo -e "${YELLOW}📝 Look for the '✨ New Features' tab${NC}"
echo ""
echo -e "${GREEN}Press Ctrl+C to stop the server${NC}"
echo ""

cd example && npm run dev
