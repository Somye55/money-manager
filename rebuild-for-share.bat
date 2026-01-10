@echo off
echo ========================================
echo Rebuilding Money Manager with Share Support
echo ========================================
echo.

echo [Step 1/5] Syncing Capacitor...
cd client
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Capacitor sync failed
    pause
    exit /b 1
)
echo ✓ Capacitor synced
echo.

echo [Step 2/5] Cleaning project...
cd android
call gradlew clean
if errorlevel 1 (
    echo ERROR: Clean failed
    cd ..\..
    pause
    exit /b 1
)
echo ✓ Project cleaned
echo.

echo [Step 3/5] Building APK...
call gradlew assembleDebug
if errorlevel 1 (
    echo ERROR: Build failed
    cd ..\..
    pause
    exit /b 1
)
echo ✓ APK built successfully
echo.

cd ..\..

echo [Step 4/5] Checking device connection...
adb devices
echo.

echo [Step 5/5] Uninstalling old app...
adb uninstall com.moneymanager.app
echo.

echo ========================================
echo Build Complete!
echo ========================================
echo.
echo APK Location: client\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo NEXT STEPS:
echo 1. Install the new APK:
echo    adb install client\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 2. Test share feature:
echo    - Open Google Pay
echo    - Tap Share on any transaction
echo    - Select Money Manager
echo.
echo ========================================
pause
