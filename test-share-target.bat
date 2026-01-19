@echo off
echo ========================================
echo Building and Testing Share Target Plugin
echo ========================================
echo.

cd client

echo [1/4] Building React app...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Syncing Capacitor...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Capacitor sync failed!
    pause
    exit /b 1
)

echo.
echo [3/4] Building Android APK...
cd android
call gradlew.bat assembleDebug
if errorlevel 1 (
    echo ERROR: Android build failed!
    cd ..
    pause
    exit /b 1
)

echo.
echo [4/4] Installing on device...
call gradlew.bat installDebug
if errorlevel 1 (
    echo ERROR: Installation failed!
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo ✅ Build and Install Complete!
echo ========================================
echo.
echo TEST INSTRUCTIONS:
echo 1. Open Google Pay or PhonePe
echo 2. Find a transaction screenshot
echo 3. Tap Share button
echo 4. Select "Money Manager" app
echo 5. App should open DIRECTLY to Quick Save page (no dashboard flash)
echo.
echo The Share Target plugin will intercept the share intent
echo and navigate directly to /quick-save before any other page loads.
echo.
pause
