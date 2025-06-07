#!/bin/bash

echo ""
echo "========================================"
echo "  Starting Account MFE Development Server"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "Node.js version:"
node --version

echo ""
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo ""
echo "Starting development server..."
echo ""
echo "Account MFE will be available at: http://localhost:3001"
echo "Integration test page: http://localhost:3001/accounts/test"
echo ""
echo "Make sure your backend account service is running on http://localhost:8081"
echo ""

npm start 