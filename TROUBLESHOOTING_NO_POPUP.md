# Troubleshooting: No Popup Showing for Notifications

## Quick Diagnosis

Run this command to diagnose the issue:

```bash
debug-notification-listener.bat
```

This will check all permissions and start monitoring logs in real-time.

## Step-by-Step Debugging

### Step 1: Verify App Was Rebuilt After Changes

**CRITICAL**: The changes won't work unless you rebuild and reinstall the app!

```bash
cd client
npx cap sync android
cd android
gradlew clean
gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

**Check**: Look for "Success" message after install

---

### Step 2: Verify Notification Listener Permission

```bash
adb shell settings get secure enabled_notification_listeners
```

**Expected**: Should contain `com.moneymanager.app`

**If NOT granted**:

1. Open Settings on your phone
2. Go to: Apps → Special app access → Notification access
3. Find "MoneyManager" and toggle it ON
4. You should see a toast: "Money Manager: Notification monitoring active"

**Alternative path** (varies by manufacturer):

- Samsung: Settings → Apps → MoneyManager → Permissions → Notification access
- Xiaomi: Settings → Notifications → App notifications → MoneyManager
- OnePlus: Settings → Apps → Special access → Notification access

---

### Step 3: Verify Overlay Permission

```bash
adb shell appops get com.moneymanager.app SYSTEM_ALERT_WINDOW
```

**Expected**: Should show `allow`

**If NOT granted**:

1. Open Settings on your phone
2. Go to: Apps → MoneyManager → Display over other apps
3. Toggle it ON

**Alternative path**:

- Settings → Apps → Special app access → Display over other apps → MoneyManager

---

### Step 4: Test Overlay Directly

This tests if the overlay can show at all (bypassing notification detection):

```bash
adb shell am start-foreground-service -n com.moneymanager.app/.OverlayService --es title "Test Popup" --es text "If you see this, overlay works!" --es package "com.test"
```

**Expected**: You should see a popup on your phone screen

**If popup shows**: Overlay works! Issue is with notification detection (go to Step 5)
**If NO popup**: Overlay permission issue or service crash (check Step 3 again)

---

### Step 5: Check if Service is Connected

```bash
adb logcat -c
adb logcat -s NotificationListener:D | findstr "CONNECTED"
```

Then toggle the notification permission OFF and ON again in settings.

**Expected**: Should see: `NotificationListener: === NotificationListener CONNECTED - Service is now active! ===`

**If NOT connected**:

- Restart the app
- Restart the phone
- Check battery optimization settings (disable for MoneyManager)

---

### Step 6: Monitor Logs While Sending Notification

Clear logs and start monitoring:

```bash
adb logcat -c
adb logcat -s NotificationListener:D OverlayService:D
```

Now send a WhatsApp message or notification from any app.

**Expected logs**:

```
NotificationListener: >>> onNotificationPosted() called <<<
NotificationListener: Package name: com.whatsapp
NotificationListener: ========================================
NotificationListener: NEW NOTIFICATION RECEIVED
NotificationListener: Package: com.whatsapp
NotificationListener: Title: John
NotificationListener: Text: Hello there
NotificationListener: Is Financial App: true
NotificationListener: >>> FINANCIAL APP DETECTED - Attempting to show overlay...
NotificationListener: Overlay permission granted: true
NotificationListener: Starting OverlayService...
NotificationListener: OverlayService started successfully
OverlayService: === OverlayService onStartCommand called ===
OverlayService: >>> OVERLAY VIEW ADDED SUCCESSFULLY <<<
```

---

## Common Issues and Solutions

### Issue 1: No logs appearing at all

**Symptom**: No "onNotificationPosted" logs when notification arrives

**Possible causes**:

1. Service not connected
2. Permission not granted
3. App not rebuilt after changes

**Solution**:

```bash
# Check if service is registered
adb shell dumpsys notification_listener

# Should show: com.moneymanager.app/.NotificationListener

# If not shown, toggle permission off and on
```

---

### Issue 2: Logs show notification but "Not a financial app"

**Symptom**: Logs show notification received but says "Not a financial app, skipping"

**Check the package name** in logs. If it's WhatsApp, it should be `com.whatsapp`

**Solution**: The `isFinancialApp()` method might not recognize the package. Check the package name and add it:

```java
private boolean isFinancialApp(String packageName) {
    if (packageName == null) return false;
    String pkg = packageName.toLowerCase();

    // Add more package names here
    return pkg.contains("whatsapp") ||
           pkg.contains("paytm") ||
           pkg.contains("phonepe") ||
           // ... etc
}
```

---

### Issue 3: "Financial app detected" but no overlay

**Symptom**: Logs show "FINANCIAL APP DETECTED" but no overlay appears

**Check for**:

1. "Overlay permission granted: false" → Grant overlay permission
2. "ERROR starting OverlayService" → Check error message
3. No OverlayService logs → Service might be crashing

**Solution**:

```bash
# Check for crashes
adb logcat -s AndroidRuntime:E

# Test overlay directly
adb shell am start-foreground-service -n com.moneymanager.app/.OverlayService --es title "Test" --es text "Test" --es package "test"
```

---

### Issue 4: Overlay shows for test but not for real notifications

**Symptom**: Test overlay works, but real notifications don't trigger it

**Possible causes**:

1. Notification arrives when screen is off
2. App is being killed by battery optimization
3. Notification doesn't match financial app criteria

**Solution**:

```bash
# Disable battery optimization
adb shell dumpsys deviceidle whitelist +com.moneymanager.app

# Or manually:
# Settings → Battery → Battery optimization → MoneyManager → Don't optimize
```

---

### Issue 5: Works once then stops

**Symptom**: First notification shows popup, then subsequent ones don't

**Possible causes**:

1. Service being killed
2. Overlay not being removed properly
3. Memory issue

**Solution**: Add this to NotificationListener.java:

```java
@Override
public void onNotificationPosted(StatusBarNotification sbn) {
    // At the very start, add:
    Log.d(TAG, ">>> onNotificationPosted() called at " + System.currentTimeMillis());

    // Rest of code...
}
```

This helps identify if the service stops receiving notifications.

---

## Manufacturer-Specific Issues

### Xiaomi/MIUI

- **Autostart**: Settings → Permissions → Autostart → Enable for MoneyManager
- **Battery**: Settings → Battery → Manage apps battery usage → MoneyManager → No restrictions
- **Notifications**: Settings → Notifications → MoneyManager → Enable all

### Huawei/EMUI

- **Protected apps**: Settings → Battery → App launch → MoneyManager → Manage manually → Enable all
- **Notification panel**: Settings → Notification panel & status bar → Notification center → MoneyManager

### Samsung

- **Sleeping apps**: Settings → Battery → Background usage limits → Remove MoneyManager from sleeping apps
- **Notification access**: Settings → Apps → MoneyManager → Notifications → Allow notification access

### OnePlus/OxygenOS

- **Battery optimization**: Settings → Battery → Battery optimization → MoneyManager → Don't optimize
- **Advanced optimization**: Settings → Battery → Advanced optimization → Disable for MoneyManager

---

## Nuclear Option: Complete Reset

If nothing works, try this complete reset:

```bash
# 1. Uninstall app completely
adb uninstall com.moneymanager.app

# 2. Clean build
cd client/android
gradlew clean
gradlew assembleDebug

# 3. Reinstall
adb install app/build/outputs/apk/debug/app-debug.apk

# 4. Grant permissions
# - Notification access
# - Display over other apps
# - Disable battery optimization

# 5. Restart phone

# 6. Test
adb logcat -c
adb logcat -s NotificationListener:D OverlayService:D
```

---

## Verification Checklist

Before asking for more help, verify:

- [ ] App was rebuilt after code changes (`gradlew clean assembleDebug`)
- [ ] App was reinstalled (`adb install -r`)
- [ ] Notification access permission granted (check with adb command)
- [ ] Overlay permission granted (check with adb command)
- [ ] Service shows as connected in logs
- [ ] Test overlay command works
- [ ] Logs show "onNotificationPosted() called" when notification arrives
- [ ] Package name is recognized as financial app
- [ ] No errors in logcat
- [ ] Battery optimization disabled
- [ ] Phone not in power saving mode

---

## Getting Help

If still not working, provide:

1. **Full logcat output**:

   ```bash
   adb logcat -d > logcat.txt
   ```

2. **Permission status**:

   ```bash
   adb shell settings get secure enabled_notification_listeners
   adb shell appops get com.moneymanager.app SYSTEM_ALERT_WINDOW
   ```

3. **Service status**:

   ```bash
   adb shell dumpsys notification_listener | findstr "moneymanager"
   ```

4. **Android version**:

   ```bash
   adb shell getprop ro.build.version.release
   ```

5. **Device manufacturer**:
   ```bash
   adb shell getprop ro.product.manufacturer
   ```

This information will help diagnose the specific issue.
