#!/bin/bash

echo "Installing Banking System Frontend Dependencies..."
echo

echo "Installing Shell Application Dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing shell dependencies"
    exit 1
fi

echo
echo "Installing Account Microfrontend Dependencies..."
cd account-mfe
npm install
if [ $? -ne 0 ]; then
    echo "Error installing account-mfe dependencies"
    exit 1
fi

cd ../..

echo
echo "All frontend dependencies installed successfully!"
echo
echo "To start the applications:"
echo "1. Shell Application: cd frontend && npm start"
echo "2. Account MFE: cd frontend/account-mfe && npm start"
echo 