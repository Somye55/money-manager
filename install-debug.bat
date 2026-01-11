@echo off
echo ========================================
echo Building and Installing Debug APK
echo ========================================
echo.
echo Make sure your phone is connected via USB
echo with USB debugging enabled
echo.
pause

cd client

echo Step 1: Syncing Capacitor...
call npx cap sync android

echo.
echo Step 2: Building and Installing...
call npx cap run android

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo The app is now installed on your device
echo Test by sharing a payment screenshot!
echo.
pause
