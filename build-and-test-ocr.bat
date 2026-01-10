@echo off
echo ========================================
echo OCR Screenshot Detection - Build & Test
echo ========================================
echo.

cd client

echo [1/5] Syncing Capacitor...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Capacitor sync failed
    pause
    exit /b 1
)
echo.

echo [2/5] Opening Android Studio...
echo Please build and install the app from Android Studio
call npx cap open android
echo.

echo [3/5] Waiting for build to complete...
echo Press any key after you've installed the app on your device...
pause
echo.

echo [4/5] Checking device connection...
adb devices
echo.

echo [5/5] Starting log monitoring...
echo.
echo ========================================
echo Monitoring OCR logs...
echo Take a screenshot of a payment to test!
echo Press Ctrl+C to stop
echo ========================================
echo.

adb logcat -c
adb logcat | findstr /C:"ScreenshotListener" /C:"OCRProcessor" /C:"OverlayService"
