@echo off
echo ========================================
echo Notification Listener Debug Script
echo ========================================
echo.

echo Step 1: Checking if device is connected...
adb devices | findstr "device" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] No device connected!
    echo Please connect your Android device with USB debugging enabled.
    pause
    exit /b 1
)
echo [OK] Device connected
echo.

echo Step 2: Checking if app is installed...
adb shell pm list packages | findstr "com.moneymanager.app" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] App not installed!
    echo Please install the app first.
    pause
    exit /b 1
)
echo [OK] App is installed
echo.

echo Step 3: Checking Notification Listener permission...
adb shell settings get secure enabled_notification_listeners > temp_check.txt
findstr "com.moneymanager.app" temp_check.txt >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Notification Listener permission NOT GRANTED!
    echo.
    echo Please grant permission:
    echo 1. Go to Settings on your phone
    echo 2. Apps -^> Special app access -^> Notification access
    echo 3. Enable "MoneyManager"
    echo.
    del temp_check.txt
    pause
    exit /b 1
) else (
    echo [OK] Notification Listener permission granted
)
del temp_check.txt
echo.

echo Step 4: Checking Overlay permission...
adb shell appops get com.moneymanager.app SYSTEM_ALERT_WINDOW > temp_overlay.txt
findstr "allow" temp_overlay.txt >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Overlay permission NOT GRANTED!
    echo.
    echo Please grant permission:
    echo 1. Go to Settings on your phone
    echo 2. Apps -^> MoneyManager -^> Display over other apps
    echo 3. Toggle it ON
    echo.
    del temp_overlay.txt
    pause
    exit /b 1
) else (
    echo [OK] Overlay permission granted
)
del temp_overlay.txt
echo.

echo Step 5: Checking if NotificationListener service is running...
adb shell dumpsys notification_listener | findstr "com.moneymanager.app" >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Service might not be running
    echo Try toggling the permission off and on again
) else (
    echo [OK] Service appears to be registered
)
echo.

echo Step 6: Testing overlay directly...
echo Sending test overlay command...
adb shell am start-foreground-service -n com.moneymanager.app/.OverlayService --es title "Debug Test" --es text "If you see this popup, overlay works!" --es package "com.test"
echo.
echo Did you see a popup on your phone?
echo If YES: Overlay works, issue is with notification detection
echo If NO: Overlay permission or service issue
echo.
pause

echo.
echo Step 7: Clearing logcat and starting live monitoring...
echo.
echo Now send a WhatsApp message or any notification from a financial app
echo Watch the logs below to see what happens...
echo.
echo Press Ctrl+C to stop monitoring
echo.
echo ========================================
echo.

adb logcat -c
adb logcat -s NotificationListener:D OverlayService:D NotificationListenerPlugin:D AndroidRuntime:E
