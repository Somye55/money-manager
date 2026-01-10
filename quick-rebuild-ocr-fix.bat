@echo off
echo ========================================
echo Quick Rebuild - OCR Amount Parsing Fix
echo ========================================
echo.

echo [1/4] Building Android APK...
cd client\android
call gradlew assembleDebug
if errorlevel 1 (
    echo ERROR: Build failed
    cd ..\..
    pause
    exit /b 1
)
echo ✓ APK built
echo.

cd ..\..

echo [2/4] Uninstalling old app...
adb uninstall com.moneymanager.app
echo.

echo [3/4] Installing new APK...
adb install client\android\app\build\outputs\apk\debug\app-debug.apk
if errorlevel 1 (
    echo ERROR: Installation failed
    pause
    exit /b 1
)
echo ✓ App installed
echo.

echo [4/4] Starting log monitor...
echo.
echo ========================================
echo Monitoring OCR logs...
echo Share a GPay transaction now!
echo Press Ctrl+C to stop
echo ========================================
echo.

adb logcat -c
adb logcat | findstr /C:"MainActivity" /C:"OCRProcessor" /C:"OverlayService"
