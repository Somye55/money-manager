@echo off
echo ========================================
echo 🔧 Rebuilding App with QuickExpense Page
echo ========================================
echo.

echo [1/5] Building React app...
cd client
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)
echo ✅ React app built

echo.
echo [2/5] Syncing Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Sync failed
    pause
    exit /b 1
)
echo ✅ Capacitor synced

echo.
echo [3/5] Building APK...
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo ❌ APK build failed
    pause
    exit /b 1
)
echo ✅ APK built

echo.
echo [4/5] Installing APK...
adb install -r app\build\outputs\apk\debug\app-debug.apk
if %errorlevel% neq 0 (
    echo ❌ Install failed
    pause
    exit /b 1
)
echo ✅ APK installed

echo.
echo [5/5] Starting server check...
cd ..\..\server
start cmd /k "npm run dev"
echo ✅ Server starting in new window

echo.
echo ========================================
echo ✅ ALL DONE!
echo ========================================
echo.
echo 📱 Test Steps:
echo 1. Make sure server is running (check new window)
echo 2. Open Google Pay or any payment app
echo 3. Take screenshot of a transaction
echo 4. Share screenshot to Money Manager
echo 5. App should open to QuickExpense page
echo 6. Review and save expense
echo.
echo 🐛 Watch logs:
echo   adb logcat ^| findstr "MainActivity OCRProcessor"
echo.
pause
