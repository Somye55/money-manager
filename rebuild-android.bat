@echo off
echo ========================================
echo Rebuilding Android App with Plugins
echo ========================================

cd client

echo.
echo [1/4] Syncing Capacitor...
call npx cap sync android

echo.
echo [2/4] Cleaning Android build...
cd android
call gradlew clean

echo.
echo [3/4] Building Android app...
call gradlew assembleDebug

echo.
echo [4/4] Installing on device...
call gradlew installDebug

echo.
echo ========================================
echo Build complete! The app should now recognize the SettingsHelper plugin.
echo ========================================
pause
