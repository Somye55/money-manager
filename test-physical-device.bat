@echo off
echo ========================================
echo Physical Device OCR Testing Setup
echo ========================================
echo.
echo Your Computer IP: 10.5.48.113
echo Server will run on: http://10.5.48.113:3000
echo.
echo IMPORTANT: Make sure your phone and computer are on the SAME WiFi network!
echo.
echo ========================================
echo Step 1: Starting OCR Server
echo ========================================
echo.

cd server

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing server dependencies...
    call npm install
    echo.
)

:: Start the server in a new window
start "OCR Server" cmd /k "npm run dev"

echo Server starting in new window...
timeout /t 3 /nobreak >nul

cd ..

echo.
echo ========================================
echo Step 2: Rebuilding Android App
echo ========================================
echo.

cd client

echo Cleaning previous build...
call npx cap sync android
echo.

echo Building Android app with physical device configuration...
cd android
call gradlew assembleDebug
cd ..

echo.
echo ========================================
echo Step 3: Installing on Device
echo ========================================
echo.

echo Make sure your phone is connected via USB with USB debugging enabled
echo.
pause

call npx cap run android

echo.
echo ========================================
echo Testing Instructions:
echo ========================================
echo.
echo 1. Make sure your phone is connected to WiFi: %COMPUTERNAME%
echo 2. Open Google Pay or any payment app
echo 3. Take a screenshot of a transaction
echo 4. Share the screenshot with Money Manager
echo 5. The app should open and extract the transaction details
echo.
echo If it doesn't work:
echo - Check if server is running (look for the OCR Server window)
echo - Verify both devices are on the same WiFi
echo - Check Windows Firewall isn't blocking port 3000
echo.
echo ========================================
echo Server Logs
echo ========================================
echo Check the "OCR Server" window for connection logs
echo.
pause
