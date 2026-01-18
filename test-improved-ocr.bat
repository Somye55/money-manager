@echo off
echo ========================================
echo Testing Improved OCR Text Extraction
echo ========================================
echo.

echo Step 1: Building Android app with improved OCR...
cd client\android
call gradlew assembleDebug
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Installing app...
cd ..\..
adb install -r client\android\app\build\outputs\apk\debug\app-debug.apk
if %ERRORLEVEL% NEQ 0 (
    echo Install failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Starting app...
adb shell am start -n com.moneymanager.app/.MainActivity

echo.
echo Step 4: Monitoring OCR logs...
echo ========================================
echo Look for "OCR EXTRACTED TEXT (ORDERED BLOCKS)"
echo This should show text in proper reading order
echo ========================================
echo.
echo Press Ctrl+C to stop monitoring
echo.

adb logcat -c
adb logcat | findstr /C:"OCRProcessor" /C:"OCR EXTRACTED TEXT" /C:"Groq parsed"

pause
