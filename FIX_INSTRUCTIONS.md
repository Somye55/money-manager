# Instructions to Fix Notification Popup Issue

## IMPORTANT: You MUST rebuild the app first!

The code changes won't take effect until you rebuild and reinstall the app.

## Step 1: Rebuild the App

Open a command prompt in your project root and run:

```bash
cd client
npx cap sync android
cd android
gradlew clean
gradlew assembleDebug
```

Wait for the build to complete (may take 2-5 minutes).

## Step 2: Install on Your Device

Make sure your phone is connected via USB with USB debugging enabled, then:

```bash
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

You should see "Success" message.

## Step 3: Run Quick Test

```bash
quick-test.bat
```

This will:

1. Check if device is connected ✓
2. Check notification permission ✓
3. Check overlay permission ✓
4. Test overlay directly (you should see a popup!)
5. Monitor logs for real notifications

## Step 4: Grant Permissions (if needed)

### Notification Access Permission:

1. Open **Settings** on your phone
2. Go to **Apps** → **Special app access** → **Notification access**
3. Find **MoneyManager** and toggle it **ON**
4. You should see a toast message: "Money Manager: Notification monitoring active"

### Display Over Other Apps Permission:

1. Open **Settings** on your phone
2. Go to **Apps** → **MoneyManager** → **Display over other apps**
3. Toggle it **ON**

## Step 5: Test with Real Notification

1. Keep the command prompt open (running quick-test.bat)
2. Send yourself a WhatsApp message
3. Watch the logs in the command prompt

### What You Should See:

```
NotificationListener: >>> onNotificationPosted() called <<<
NotificationListener: Package name: com.whatsapp
NotificationListener: ========================================
NotificationListener: NEW NOTIFICATION RECEIVED
NotificationListener: Package: com.whatsapp
NotificationListener: Title: Contact Name
NotificationListener: Text: Message content
NotificationListener: Is Financial App: true
NotificationListener: >>> FINANCIAL APP DETECTED - Attempting to show overlay...
NotificationListener: Overlay permission granted: true
NotificationListener: Starting OverlayService...
NotificationListener: OverlayService started successfully
OverlayService: === OverlayService onStartCommand called ===
OverlayService: >>> OVERLAY VIEW ADDED SUCCESSFULLY <<<
```

**AND** you should see a popup on your phone screen!

## Troubleshooting

### If you see NO logs at all:

**Problem**: Service is not receiving notifications

**Solution**:

1. Toggle notification permission OFF then ON again
2. Restart the app
3. Check: `adb shell dumpsys notification_listener | findstr "moneymanager"`

### If logs show "Not a financial app":

**Problem**: Package name not recognized

**Check the package name** in the logs. For WhatsApp it should be `com.whatsapp`.

If it's different, you need to add it to the code. Let me know the package name.

### If logs show "Financial app detected" but NO popup:

**Problem**: Overlay permission or service issue

**Solution**:

1. Run the test overlay command:
   ```bash
   adb shell am start-foreground-service -n com.moneymanager.app/.OverlayService --es title "Test" --es text "Test popup" --es package "test"
   ```
2. If this shows a popup: The issue is with notification detection
3. If this does NOT show a popup: Overlay permission issue

### If overlay shows once then stops:

**Problem**: Service being killed or battery optimization

**Solution**:

1. Go to Settings → Battery → Battery optimization
2. Find MoneyManager
3. Select "Don't optimize"

## Manufacturer-Specific Settings

### Xiaomi/MIUI:

- Settings → Permissions → Autostart → Enable for MoneyManager
- Settings → Battery → Manage apps battery usage → MoneyManager → No restrictions

### Samsung:

- Settings → Battery → Background usage limits → Remove MoneyManager from sleeping apps

### Huawei:

- Settings → Battery → App launch → MoneyManager → Manage manually → Enable all

### OnePlus:

- Settings → Battery → Battery optimization → MoneyManager → Don't optimize

## Still Not Working?

Run the full debug script:

```bash
debug-notification-listener.bat
```

This will give you detailed diagnostic information.

Then provide me with:

1. The full log output
2. Your Android version
3. Your phone manufacturer/model
4. Whether the test overlay command works

## Quick Commands Reference

```bash
# Rebuild and install
cd client && npx cap sync android && cd android && gradlew clean assembleDebug && adb install -r app\build\outputs\apk\debug\app-debug.apk

# Quick test
quick-test.bat

# Full debug
debug-notification-listener.bat

# Test overlay directly
adb shell am start-foreground-service -n com.moneymanager.app/.OverlayService --es title "Test" --es text "Test" --es package "test"

# Monitor logs
adb logcat -c && adb logcat -s NotificationListener:D OverlayService:D

# Check permissions
adb shell settings get secure enabled_notification_listeners
adb shell appops get com.moneymanager.app SYSTEM_ALERT_WINDOW
```

## Expected Timeline

- Rebuild: 2-5 minutes
- Install: 10-30 seconds
- Grant permissions: 1-2 minutes
- Test: Immediate

Total: ~5-10 minutes

## Success Criteria

✓ App builds without errors
✓ App installs successfully
✓ Both permissions granted
✓ Test overlay shows popup
✓ Logs show "onNotificationPosted() called" for real notifications
✓ Logs show "FINANCIAL APP DETECTED"
✓ Logs show "OVERLAY VIEW ADDED SUCCESSFULLY"
✓ Popup appears on phone screen for real notifications

---

**Start with Step 1 (rebuild) and work through each step. The quick-test.bat script will guide you through the rest!**
