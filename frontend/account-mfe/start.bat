@echo off
echo.
echo ========================================
echo   Starting Account MFE Development Server
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version

echo.
echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Starting development server...
echo.
echo Account MFE will be available at: http://localhost:3001
echo Integration test page: http://localhost:3001/accounts/test
echo.
echo Make sure your backend account service is running on http://localhost:8081
echo.

call npm start 