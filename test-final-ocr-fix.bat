@echo off
echo ========================================
echo Final OCR Fix - Testing
echo ========================================
echo.
echo Improvements:
echo 1. Image preprocessing (contrast, scaling)
echo 2. Better phone number filtering
echo 3. Improved pattern matching
echo 4. Better context detection
echo.

echo [1/4] Syncing...
cd client
call npx cap sync android >nul 2>&1

echo [2/4] Building...
cd android
call gradlew assembleDebug >nul 2>&1

echo [3/4] Installing...
adb install -r app\build\outputs\apk\debug\app-debug.apk >nul 2>&1

echo [4/4] Ready to test!
echo.
echo ========================================
echo ✅ App Installed
echo ========================================
echo.
echo Test Steps:
echo 1. Open the app
echo 2. Share your payment screenshot
echo 3. Watch the logs below
echo.
echo Expected:
echo - "Image preprocessed for better OCR"
echo - "OCR EXTRACTED TEXT: ...80,000..." or "...80000..."
echo - "Skipping phone number: 9197581"
echo - "Final extracted amount: 80000.0"
echo.
echo Press any key to start monitoring logs...
pause >nul

echo.
echo Monitoring logs (Ctrl+C to stop)...
echo.
adb logcat -c
adb logcat | findstr "OCRProcessor MainActivity"
