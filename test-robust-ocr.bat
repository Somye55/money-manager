@echo off
echo ========================================
echo Testing Robust OCR Implementation
echo ========================================
echo.
echo Key Improvements:
echo [x] Phone number pre-processing (removes entire number)
echo [x] Standalone amount detection (catches "1", "500", etc.)
echo [x] Multi-line merchant extraction
echo [x] Transaction ID filtering
echo [x] Hierarchical pattern matching
echo.

echo [1/4] Syncing Capacitor...
cd client
call npx cap sync android

echo.
echo [2/4] Building APK...
cd android
call gradlew assembleDebug

echo.
echo [3/4] Installing on device...
adb install -r app\build\outputs\apk\debug\app-debug.apk

echo.
echo [4/4] Starting log monitoring...
echo.
echo ========================================
echo ✅ App Installed - Ready to Test
echo ========================================
echo.
echo Test Steps:
echo 1. Open the app
echo 2. Share your payment screenshot
echo 3. Watch the logs below
echo.
echo Expected for your screenshot:
echo - "Removed phone numbers from text"
echo - "Found standalone amount: 1.0" (or 80000.0)
echo - "Found merchant after 'To': NISHA SHARMA"
echo - "Amount: 1.0, Merchant: NISHA SHARMA, Type: debit"
echo.
echo Key Fixes:
echo - Phone number "+9197581 34039" will be completely removed
echo - Won't detect "34039" or "9197581" as amount
echo - Will find the actual amount (1 or 80000)
echo.
echo Press any key to start monitoring...
pause >nul

echo.
echo Monitoring OCR logs (Ctrl+C to stop)...
echo.
adb logcat -c
adb logcat | findstr "OCRProcessor MainActivity"
