@echo off
echo Installing Banking System Frontend Dependencies...
echo.

echo Installing Shell Application Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing shell dependencies
    pause
    exit /b 1
)

echo.
echo Installing Account Microfrontend Dependencies...
cd account-mfe
call npm install
if %errorlevel% neq 0 (
    echo Error installing account-mfe dependencies
    pause
    exit /b 1
)

cd ..
cd ..

echo.
echo All frontend dependencies installed successfully!
echo.
echo To start the applications:
echo 1. Shell Application: cd frontend && npm start
echo 2. Account MFE: cd frontend/account-mfe && npm start
echo.
pause 