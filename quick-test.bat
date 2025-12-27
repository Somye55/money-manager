@echo off
echo ==========================================
echo Quick Notification Listener Test
echo ==========================================
echo.

echo [1/5] Checking device connection...
adb devices | findstr "device" >nul 2>&1
if errorlevel 1 (
    echo [FAIL] No device connected
    pause
    exit /b 1
)
echo [PASS] Device connected
echo.

echo [2/5] Checking notification permission...
adb shell settings get secure enabled_notification_listeners | findstr "com.moneymanager.app" >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Notification permission NOT granted
    echo.
    echo ACTION REQUIRED:
    echo 1. Open Settings on your phone
    echo 2. Go to: Apps -^> Special app access -^> Notification access
    echo 3. Enable "MoneyManager"
    echo.
    pause
    exit /b 1
)
echo [PASS] Notification permission granted
echo.

echo [3/5] Checking overlay permission...
adb shell appops get com.moneymanager.app SYSTEM_ALERT_WINDOW | findstr "allow" >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Overlay permission NOT granted
    echo.
    echo ACTION REQUIRED:
    echo 1. Open Settings on your phone
    echo 2. Go to: Apps -^> MoneyManager -^> Display over other apps
    echo 3. Toggle it ON
    echo.
    pause
    exit /b 1
)
echo [PASS] Overlay permission granted
echo.

echo [4/5] Testing overlay directly...
echo Sending test overlay command...
adb shell am start-foreground-service -n com.moneymanager.app/.OverlayService --es title "TEST POPUP" --es text "If you see this popup on your phone, the overlay is working!" --es package "com.test"
echo.
echo LOOK AT YOUR PHONE NOW!
echo.
echo Did you see a popup?
set /p POPUP_SEEN="Type Y if you saw the popup, N if not: "
echo.

if /i "%POPUP_SEEN%"=="Y" (
    echo [PASS] Overlay is working!
    echo.
    echo The issue is with notification detection.
    echo Let's check if the service receives notifications...
) else (
    echo [FAIL] Overlay not working
    echo.
    echo Possible issues:
    echo - Overlay permission not actually granted
    echo - OverlayService is crashing
    echo - Device manufacturer restrictions
    echo.
    echo Check logs for errors:
    adb logcat -d -s OverlayService:* AndroidRuntime:E
    pause
    exit /b 1
)
echo.

echo [5/5] Monitoring for notifications...
echo.
echo Now send a WhatsApp message or any notification
echo Watch the output below...
echo.
echo Press Ctrl+C when done
echo.
echo ==========================================
echo.

adb logcat -c
adb logcat -s NotificationListener:D OverlayService:D AndroidRuntime:E
