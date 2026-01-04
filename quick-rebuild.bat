@echo off
echo ========================================
echo Quick Rebuild - Plugin Fix
echo ========================================
echo.

cd client

echo [1/3] Building React app...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [2/3] Syncing with Android...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Sync failed
    pause
    exit /b 1
)

echo.
echo [3/3] Done!
echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo 1. In Android Studio, click Run (green play button)
echo 2. Wait for app to install
echo 3. In Edge DevTools, refresh the page
echo 4. Try: window.NotificationListenerPlugin.testOverlay()
echo.
echo OR try: window.Capacitor.Plugins.NotificationListenerPlugin.testOverlay()
echo.
pause
