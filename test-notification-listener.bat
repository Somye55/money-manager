@echo off
REM Notification Listener Test Script for Windows
REM This script helps verify that the notification listener is working correctly

echo ==================================
echo Notification Listener Test Script
echo ==================================
echo.

REM Check if device is connected
echo 1. Checking for connected Android device...
adb devices | findstr "device" >nul 2>&1
if errorlevel 1 (
    echo X No Android device connected
    echo    Please connect your device and enable USB debugging
    exit /b 1
)
echo √ Device connected
echo.

REM Check if app is installed
echo 2. Checking if MoneyManager app is installed...
adb shell pm list packages | findstr "com.moneymanager.app" >nul 2>&1
if errorlevel 1 (
    echo X MoneyManager app not installed
    echo    Please install the app first
    exit /b 1
)
echo √ App installed
echo.

REM Check notification listener permission
echo 3. Checking notification listener permission...
adb shell settings get secure enabled_notification_listeners > temp_listeners.txt
findstr "com.moneymanager.app" temp_listeners.txt >nul 2>&1
if errorlevel 1 (
    echo ! Notification listener permission NOT granted
    echo    Please enable it in: Settings - Apps - Special app access - Notification access
) else (
    echo √ Notification listener permission granted
)
del temp_listeners.txt
echo.

REM Check overlay permission
echo 4. Checking overlay permission...
adb shell appops get com.moneymanager.app SYSTEM_ALERT_WINDOW > temp_overlay.txt
findstr "allow" temp_overlay.txt >nul 2>&1
if errorlevel 1 (
    echo ! Overlay permission NOT granted
    echo    Please enable it in: Settings - Apps - MoneyManager - Display over other apps
) else (
    echo √ Overlay permission granted
)
del temp_overlay.txt
echo.

REM Start monitoring logs
echo 5. Starting log monitor...
echo    Watching for notification events...
echo    Send a test notification from a financial app (Google Pay, Paytm, etc.)
echo    Press Ctrl+C to stop
echo.
echo ==================================
echo.

adb logcat -c
adb logcat | findstr "NotificationListener OverlayService NotificationListenerPlugin"
