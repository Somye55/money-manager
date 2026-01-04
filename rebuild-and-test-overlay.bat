@echo off
echo ========================================
echo Rebuilding App with Overlay Fix
echo ========================================
echo.

cd client

echo [1/5] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/5] Building React app...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [3/5] Syncing with Android...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Capacitor sync failed
    pause
    exit /b 1
)

echo.
echo [4/5] Opening Android Studio...
call npx cap open android

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo NEXT STEPS:
echo 1. In Android Studio, click Run (green play button)
echo 2. Wait for app to install on device
echo 3. Grant permissions:
echo    - Notification Listener Access
echo    - Display over other apps
echo 4. Test the overlay:
echo    - Connect device via USB
echo    - Open Chrome: chrome://inspect
echo    - Click "inspect" on your device
echo    - In console, run: window.NotificationListenerPlugin.testOverlay()
echo 5. Select category and click "Save Expense"
echo 6. Check dashboard - expense should appear!
echo.
echo DEBUGGING:
echo - Check console for: "✅ Expense saved from overlay successfully"
echo - Check logcat: adb logcat -s OverlayService NotificationListenerPlugin
echo.
pause
