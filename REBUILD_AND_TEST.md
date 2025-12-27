# Quick Rebuild and Test Guide

## After Making Changes to Notification Listener

### 1. Sync and Rebuild (Windows)

```bash
cd client
npx cap sync android
cd android
gradlew clean assembleDebug
```

### 2. Install on Device

```bash
# From client/android directory
adb install -r app/build/outputs/apk/debug/app-debug.apk

# Or use Android Studio:
# - Open client/android in Android Studio
# - Click Run button
```

### 3. Grant Permissions

#### Notification Access

1. Open Settings on your Android device
2. Go to Apps → Special app access → Notification access
3. Find "MoneyManager" and toggle it ON
4. You should see a toast message: "Money Manager: Notification monitoring active"

#### Display Over Other Apps

1. Open Settings
2. Go to Apps → MoneyManager → Display over other apps
3. Toggle it ON

### 4. Test the Listener

#### Option A: Use Test Script (Recommended)

```bash
# On Windows
test-notification-listener.bat

# On Linux/Mac
chmod +x test-notification-listener.sh
./test-notification-listener.sh
```

#### Option B: Manual Testing

1. Open the MoneyManager app
2. Go to Settings page
3. Check that both permissions show as granted
4. Click "Test Overlay" button - you should see a popup
5. Send a real transaction (e.g., send ₹1 to someone via Google Pay)
6. You should see:
   - A popup overlay on your screen
   - The notification logged in the app

#### Option C: Monitor Logs Manually

```bash
# Clear logs and start monitoring
adb logcat -c
adb logcat | findstr "NotificationListener OverlayService NotificationListenerPlugin"

# On Linux/Mac use grep instead:
adb logcat | grep -E "NotificationListener|OverlayService|NotificationListenerPlugin"
```

### 5. Expected Log Output

When a financial notification arrives, you should see:

```
NotificationListener: ========================================
NotificationListener: NEW NOTIFICATION RECEIVED
NotificationListener: Package: com.google.android.apps.nbu.paisa.user
NotificationListener: Title: Payment sent
NotificationListener: Text: You paid ₹100 to John
NotificationListener: Is Financial App: true
NotificationListener: >>> FINANCIAL APP DETECTED - Attempting to show overlay...
NotificationListener: Overlay permission granted: true
NotificationListener: Starting OverlayService...
NotificationListener: OverlayService started successfully
NotificationListener: Broadcast sent successfully
NotificationListener: ========================================
OverlayService: === OverlayService onStartCommand called ===
OverlayService: Received intent - Title: Payment sent, Text: You paid ₹100 to John
OverlayService: >>> OVERLAY VIEW ADDED SUCCESSFULLY <<<
```

### 6. Troubleshooting

#### No logs appearing

- Check device is connected: `adb devices`
- Verify app is installed: `adb shell pm list packages | findstr moneymanager`
- Ensure USB debugging is enabled

#### Service not connected

- Disable and re-enable notification access
- Restart the device
- Check battery optimization settings

#### Overlay not showing

- Verify "Display over other apps" permission
- Test with "Test Overlay" button first
- Check manufacturer-specific restrictions

#### JavaScript not receiving events

- Check browser console in the app
- Verify `startListening()` was called
- Look for errors in logcat

### 7. Common Issues

**Issue**: "LocalBroadcastManager not found"
**Fix**: Run `cd client/android && gradlew clean` and rebuild

**Issue**: Notifications detected but no popup
**Fix**: Check overlay permission and test with "Test Overlay" button

**Issue**: Popup shows but JavaScript doesn't receive event
**Fix**: Ensure app is in foreground or has background permissions

**Issue**: Service disconnects after a while
**Fix**: Disable battery optimization for MoneyManager app

### 8. Verify Complete Flow

Use this checklist to verify everything is working:

- [ ] App builds without errors
- [ ] App installs on device
- [ ] Notification access permission granted
- [ ] Overlay permission granted
- [ ] Toast shows "Notification monitoring active" on permission grant
- [ ] Test overlay button works
- [ ] Real financial notification triggers overlay
- [ ] Logs show complete flow from notification to overlay
- [ ] JavaScript receives notification event (check console)
- [ ] Category selection modal appears

### 9. Quick Commands Reference

```bash
# Rebuild
cd client && npx cap sync android && cd android && gradlew clean assembleDebug

# Install
adb install -r app/build/outputs/apk/debug/app-debug.apk

# Check permissions
adb shell settings get secure enabled_notification_listeners
adb shell appops get com.moneymanager.app SYSTEM_ALERT_WINDOW

# Monitor logs
adb logcat -c && adb logcat | findstr "NotificationListener OverlayService"

# Send test notification (requires root)
adb shell su -c "am broadcast -a com.moneymanager.app.NOTIFICATION_RECEIVED --es package com.test --es title 'Test' --es text 'Test notification'"
```

## Files Modified

1. `client/android/app/src/main/java/com/moneymanager/app/NotificationListener.java`

   - Added LocalBroadcastManager import
   - Added NOTIFICATION_BROADCAST constant
   - Added broadcastNotification() method
   - Call broadcast in onNotificationPosted()

2. `client/android/app/src/main/java/com/moneymanager/app/NotificationListenerPlugin.java`

   - Added BroadcastReceiver field
   - Added startListening() method
   - Added stopListening() method
   - Added cleanup in handleOnDestroy()

3. `client/src/lib/smsService.js`

   - Implemented startNotificationListener() with event listener
   - Implemented stopNotificationListener() with cleanup
   - Added proper permission checking methods

4. `client/android/app/build.gradle`

   - Added LocalBroadcastManager dependency

5. `client/src/context/SMSContext.jsx`
   - Added error handling in startLiveListener()
   - Added more detailed logging
