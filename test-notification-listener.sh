#!/bin/bash

# Notification Listener Test Script
# This script helps verify that the notification listener is working correctly

echo "=================================="
echo "Notification Listener Test Script"
echo "=================================="
echo ""

# Check if device is connected
echo "1. Checking for connected Android device..."
adb devices | grep -w "device" > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ No Android device connected"
    echo "   Please connect your device and enable USB debugging"
    exit 1
fi
echo "✓ Device connected"
echo ""

# Check if app is installed
echo "2. Checking if MoneyManager app is installed..."
adb shell pm list packages | grep "com.moneymanager.app" > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ MoneyManager app not installed"
    echo "   Please install the app first"
    exit 1
fi
echo "✓ App installed"
echo ""

# Check notification listener permission
echo "3. Checking notification listener permission..."
ENABLED_LISTENERS=$(adb shell settings get secure enabled_notification_listeners)
echo "$ENABLED_LISTENERS" | grep "com.moneymanager.app" > /dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Notification listener permission NOT granted"
    echo "   Please enable it in: Settings → Apps → Special app access → Notification access"
else
    echo "✓ Notification listener permission granted"
fi
echo ""

# Check overlay permission
echo "4. Checking overlay permission..."
OVERLAY_PERM=$(adb shell appops get com.moneymanager.app SYSTEM_ALERT_WINDOW)
echo "$OVERLAY_PERM" | grep "allow" > /dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Overlay permission NOT granted"
    echo "   Please enable it in: Settings → Apps → MoneyManager → Display over other apps"
else
    echo "✓ Overlay permission granted"
fi
echo ""

# Start monitoring logs
echo "5. Starting log monitor..."
echo "   Watching for notification events..."
echo "   Send a test notification from a financial app (Google Pay, Paytm, etc.)"
echo "   Press Ctrl+C to stop"
echo ""
echo "=================================="
echo ""

adb logcat -c  # Clear existing logs
adb logcat | grep -E "NotificationListener|OverlayService|NotificationListenerPlugin" --color=always
