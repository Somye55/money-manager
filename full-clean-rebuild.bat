@echo off
echo ========================================
echo Full Clean Rebuild - Fix Plugin Issue
echo ========================================
echo.

cd client

echo [1/6] Cleaning Android build...
cd android
call gradlew clean
if errorlevel 1 (
    echo WARNING: Gradle clean had issues, continuing...
)
cd ..

echo.
echo [2/6] Removing old build artifacts...
if exist dist rmdir /s /q dist
if exist android\app\build rmdir /s /q android\app\build

echo.
echo [3/6] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [4/6] Building React app...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [5/6] Syncing with Android (this may take a moment)...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Capacitor sync failed
    pause
    exit /b 1
)

echo.
echo [6/6] Opening Android Studio...
call npx cap open android

echo.
echo ========================================
echo Clean Build Complete!
echo ========================================
echo.
echo CRITICAL NEXT STEPS:
echo.
echo 1. In Android Studio:
echo    - Wait for Gradle sync to complete (bottom right)
echo    - Click Build ^> Clean Project
echo    - Click Build ^> Rebuild Project
echo    - Wait for rebuild to finish
echo.
echo 2. Uninstall old app from device:
echo    - Long press Money Manager icon
echo    - Click Uninstall
echo    - Confirm
echo.
echo 3. Install fresh build:
echo    - In Android Studio, click Run (green play button)
echo    - Wait for installation
echo.
echo 4. Test in DevTools:
echo    - edge://inspect/#devices
echo    - Click inspect on Money Manager
echo    - Run: window.Capacitor.Plugins.NotificationListenerPlugin.testOverlay()
echo.
echo This should fix the "plugin is not implemented" error!
echo.
pause
