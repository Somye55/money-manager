@echo off
echo ========================================
echo Screenshot Monitoring Debug
echo ========================================
echo.

echo Checking if screenshot monitoring is enabled...
adb shell "run-as com.moneymanager.app cat /data/data/com.moneymanager.app/shared_prefs/app_settings.xml"
echo.

echo ========================================
echo Checking if ScreenshotListenerService is running...
adb shell "ps -A | grep com.moneymanager.app"
echo.

echo ========================================
echo Checking storage permissions...
adb shell "dumpsys package com.moneymanager.app | grep -A 5 'granted=true'"
echo.

echo ========================================
echo Recent logs from ScreenshotListener...
adb logcat -d | grep "ScreenshotListener"
echo.

echo ========================================
echo To enable screenshot monitoring:
echo 1. Open app
echo 2. Go to Settings -^> Automation
echo 3. Scroll to Screenshot Monitoring section
echo 4. Tap "Grant Permission" if needed
echo 5. Toggle ON the switch
echo ========================================
pause
