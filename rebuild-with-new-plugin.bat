@echo off
echo ========================================
echo Rebuilding with Test Notification Feature
echo ========================================
echo.

cd client

echo [1/4] Building web assets...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [2/4] Syncing Capacitor...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Capacitor sync failed
    pause
    exit /b 1
)

echo.
echo [3/4] Cleaning Android build...
cd android
call gradlew clean
cd ..

echo.
echo [4/4] Opening Android Studio...
call npx cap open android

echo.
echo ========================================
echo NEXT STEPS:
echo 1. In Android Studio, click Build -^> Rebuild Project
echo 2. Run the app on your device
echo 3. Go to Settings -^> Test Notification Popup
echo 4. Click "Send Test Notification"
echo 5. Watch for the notification and popup!
echo ========================================
pause
