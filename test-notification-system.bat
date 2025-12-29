@echo off
echo ========================================
echo Testing Notification Listener System
echo ========================================

echo.
echo 1. Building and installing the app...
cd client
call npm run build
cd android
call ./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk

echo.
echo 2. Starting the app...
adb shell am start -n com.moneymanager.app/.MainActivity

echo.
echo 3. Waiting for services to initialize...
timeout /t 10

echo.
echo 4. Checking service status...
adb logcat -c
adb shell am start -n com.moneymanager.app/.MainActivity
timeout /t 5

echo.
echo 5. Monitoring logs for 30 seconds...
echo Look for:
echo - "NotificationListener CONNECTED"
echo - "BackgroundService CREATED"
echo - "Notification listener connected: true"
echo.
echo Press Ctrl+C to stop monitoring
adb logcat -s BackgroundService:D NotificationListener:D MainActivity:D

echo.
echo ========================================
echo Test completed. Check the logs above for:
echo - Service creation and connection status
echo - Any error messages
echo - Connection monitoring results
echo ========================================
pause