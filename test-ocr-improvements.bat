@echo off
echo ========================================
echo Testing OCR Improvements
echo ========================================
echo.

echo Improvements Made:
echo - Better regex patterns for Indian number formats
echo - Smart filtering of phone numbers and transaction IDs
echo - Improved merchant name extraction
echo - Better logging for debugging
echo.

echo [1/4] Syncing Capacitor...
cd client
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Capacitor sync failed
    pause
    exit /b 1
)

echo.
echo [2/4] Building APK...
cd android
call gradlew assembleDebug
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [3/4] Installing on device...
adb install -r app\build\outputs\apk\debug\app-debug.apk
if errorlevel 1 (
    echo ERROR: Installation failed
    pause
    exit /b 1
)

echo.
echo [4/4] Starting log monitoring...
echo.
echo ========================================
echo ✅ App Installed - Monitoring Logs
echo ========================================
echo.
echo Now:
echo 1. Open the app
echo 2. Share a payment screenshot
echo 3. Watch the logs below
echo.
echo Look for:
echo - "OCR EXTRACTED TEXT:" (full text)
echo - "Pattern X found amount:" (regex matches)
echo - "Final extracted amount:" (result)
echo - "Found merchant:" (merchant name)
echo.
echo Press Ctrl+C to stop monitoring
echo.
pause

adb logcat -c
adb logcat | findstr "OCRProcessor MainActivity"
