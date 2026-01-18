@echo off
echo ========================================
echo OCR Reliability Test Script
echo ========================================
echo.

echo Step 1: Rebuilding Android app with OCR improvements...
cd client
call npm run build:android
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Installing app on device...
cd android
call gradlew installDebug
if %errorlevel% neq 0 (
    echo ERROR: Installation failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Starting logcat monitoring...
echo.
echo ========================================
echo MONITORING OCR LOGS
echo ========================================
echo Look for these indicators:
echo   - "ENHANCED TEXT" = Currency symbols added
echo   - "Found amount with currency symbol" = High confidence
echo   - "Groq parsed expense" = AI parser success
echo.
echo Press Ctrl+C to stop monitoring
echo ========================================
echo.

adb logcat -c
adb logcat | findstr /C:"OCRProcessor" /C:"GroqParser" /C:"GeminiParser"
