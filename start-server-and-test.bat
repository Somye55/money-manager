@echo off
echo ========================================
echo Starting Groq Server for Android Testing
echo ========================================
echo.

cd server

echo 1. Checking if server dependencies are installed...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo 2. Starting server on port 3000...
echo Server will be accessible at:
echo   - Emulator: http://10.0.2.2:3000
echo   - Physical Device: http://YOUR_IP:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
