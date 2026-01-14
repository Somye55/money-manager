@echo off
echo ========================================
echo   Installing Money Manager App
echo ========================================
echo.
echo Make sure your phone is connected via USB with USB debugging enabled.
echo.
pause

cd client\android
echo.
echo Installing app...
adb install -r app\build\outputs\apk\debug\app-debug.apk

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ App Installed Successfully!
    echo ========================================
    echo.
    echo What's New:
    echo - Fixed OCR text extraction order
    echo - Amount now captured from top of screenshot
    echo - Better text sorting (top-to-bottom, left-to-right)
    echo.
    echo Test by sharing a Google Pay screenshot!
    echo.
) else (
    echo.
    echo ========================================
    echo   ❌ Installation Failed!
    echo ========================================
    echo.
    echo Make sure:
    echo 1. Your phone is connected via USB
    echo 2. USB debugging is enabled
    echo 3. You've authorized this computer on your phone
    echo.
    echo Or manually install from:
    echo client\android\app\build\outputs\apk\debug\app-debug.apk
    echo.
)

pause
