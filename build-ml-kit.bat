@echo off
echo ========================================
echo Building with ML Kit Entity Extraction
echo ========================================
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
echo [2/4] Cleaning Android build...
cd android
call gradlew clean
if errorlevel 1 (
    echo ERROR: Clean failed
    pause
    exit /b 1
)

echo.
echo [3/4] Building APK...
call gradlew assembleDebug
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [4/4] Installing on device...
adb install -r app\build\outputs\apk\debug\app-debug.apk
if errorlevel 1 (
    echo ERROR: Installation failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Build Complete - ML Kit Active
echo ========================================
echo.
echo Features:
echo - Offline OCR parsing
echo - Zero cost
echo - Instant processing
echo - Unlimited usage
echo.
echo Test by sharing a payment screenshot!
echo.
pause
