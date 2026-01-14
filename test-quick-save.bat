@echo off
echo ========================================
echo Testing Quick Save Feature
echo ========================================
echo.

echo Step 1: Checking if device is connected...
adb devices
echo.

echo Step 2: Rebuilding Android app...
cd client\android
call gradlew clean assembleDebug
cd ..\..
echo.

echo Step 3: Installing app on device...
adb install -r client\android\app\build\outputs\apk\debug\app-debug.apk
echo.

echo Step 4: Starting logcat to monitor Quick Save...
echo Watch for these logs:
echo   - "Navigating to QuickSave"
echo   - "OCR data stored in sessionStorage"
echo   - "Found OCR data in window/sessionStorage"
echo.
echo Press Ctrl+C to stop monitoring
echo.
adb logcat -c
adb logcat | findstr /i "MainActivity OCRProcessor QuickSave"
