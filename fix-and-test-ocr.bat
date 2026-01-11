@echo off
echo ========================================
echo 🔧 OCR Cleartext Fix - Complete Rebuild
echo ========================================
echo.

echo [1/6] Checking server status...
curl -s http://localhost:3000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Server not running!
    echo.
    echo Please start server in another terminal:
    echo   cd server
    echo   npm run dev
    echo.
    pause
    exit /b 1
)
echo ✅ Server is running

echo.
echo [2/6] Syncing Capacitor...
cd client
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Capacitor sync failed
    pause
    exit /b 1
)
echo ✅ Capacitor synced

echo.
echo [3/6] Clean build...
cd android
call gradlew clean
if %errorlevel% neq 0 (
    echo ❌ Clean failed
    pause
    exit /b 1
)
echo ✅ Cleaned

echo.
echo [4/6] Building APK...
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)
echo ✅ Built successfully

echo.
echo [5/6] Installing APK...
adb install -r app\build\outputs\apk\debug\app-debug.apk
if %errorlevel% neq 0 (
    echo ❌ Install failed
    pause
    exit /b 1
)
echo ✅ Installed

echo.
echo [6/6] Granting overlay permission...
adb shell appops set com.moneymanager.app SYSTEM_ALERT_WINDOW allow
echo ✅ Permission granted

echo.
echo ========================================
echo ✅ ALL DONE! Ready to test
echo ========================================
echo.
echo 📱 Test Steps:
echo 1. Open Google Pay or any payment app
echo 2. Take a screenshot of a transaction
echo 3. Share screenshot to Money Manager
echo 4. Popup should appear with parsed amount
echo.
echo 🐛 Watch logs:
echo   adb logcat ^| findstr "OCRProcessor OverlayService MainActivity"
echo.
pause
