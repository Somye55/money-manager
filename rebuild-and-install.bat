@echo off
echo ==========================================
echo Rebuild and Install MoneyManager App
echo ==========================================
echo.

echo Step 1: Syncing Capacitor...
cd client
call npx cap sync android
if errorlevel 1 (
    echo [ERROR] Capacitor sync failed
    pause
    exit /b 1
)
echo [OK] Capacitor synced
echo.

echo Step 2: Cleaning previous build...
cd android
call gradlew clean
if errorlevel 1 (
    echo [ERROR] Clean failed
    pause
    exit /b 1
)
echo [OK] Clean completed
echo.

echo Step 3: Building APK (this may take 2-5 minutes)...
call gradlew assembleDebug
if errorlevel 1 (
    echo [ERROR] Build failed
    echo Check the error messages above
    pause
    exit /b 1
)
echo [OK] Build completed successfully
echo.

echo Step 4: Checking for connected device...
adb devices | findstr "device" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] No device connected
    echo Please connect your Android device with USB debugging enabled
    pause
    exit /b 1
)
echo [OK] Device connected
echo.

echo Step 5: Installing APK...
adb install -r app\build\outputs\apk\debug\app-debug.apk
if errorlevel 1 (
    echo [ERROR] Installation failed
    pause
    exit /b 1
)
echo [OK] App installed successfully
echo.

echo ==========================================
echo SUCCESS! App rebuilt and installed
echo ==========================================
echo.
echo Next steps:
echo 1. Open the app on your phone
echo 2. Grant permissions if prompted
echo 3. Run: quick-test.bat
echo.
pause
