# Notification Listener Fix

## Problem

Notifications were not being caught by the app even after granting all permissions. The issue was that the NotificationListener service was running but had no way to communicate with the JavaScript layer.

## Root Causes Identified

### 1. Missing Communication Bridge

- **Issue**: `NotificationListener.java` was logging notifications but never sending them to the app
- **Fix**: Added LocalBroadcastManager to broadcast notification events

### 2. No Event Listener in Plugin

- **Issue**: `NotificationListenerPlugin.java` had no mechanism to receive broadcasts and forward to JavaScript
- **Fix**: Added BroadcastReceiver registration and event emission using Capacitor's `notifyListeners()`

### 3. JavaScript Not Listening

- **Issue**: `smsService.js` had a stub implementation that did nothing
- **Fix**: Implemented proper event listener registration using Capacitor's `addListener()`

## Changes Made

### 1. NotificationListener.java

```java
// Added import
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

// Added constant
public static final String NOTIFICATION_BROADCAST = "com.moneymanager.app.NOTIFICATION_RECEIVED";

// Added method to broadcast notifications
private void broadcastNotification(String packageName, String title, String text) {
    Intent intent = new Intent(NOTIFICATION_BROADCAST);
    intent.putExtra("package", packageName);
    intent.putExtra("title", title);
    intent.putExtra("text", text);
    intent.putExtra("timestamp", System.currentTimeMillis());
    LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
}

// Call broadcast in onNotificationPosted
broadcastNotification(packageName, title, fullText);
```

### 2. NotificationListenerPlugin.java

```java
// Added imports
import android.content.BroadcastReceiver;
import android.content.IntentFilter;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

// Added fields
private BroadcastReceiver notificationReceiver;
private boolean isListening = false;

// Added methods
@PluginMethod
public void startListening(PluginCall call) {
    notificationReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            JSObject notification = new JSObject();
            notification.put("package", intent.getStringExtra("package"));
            notification.put("title", intent.getStringExtra("title"));
            notification.put("text", intent.getStringExtra("text"));
            notification.put("timestamp", intent.getLongExtra("timestamp", 0));

            notifyListeners("notificationReceived", notification);
        }
    };

    IntentFilter filter = new IntentFilter(NotificationListener.NOTIFICATION_BROADCAST);
    LocalBroadcastManager.getInstance(getContext()).registerReceiver(notificationReceiver, filter);
}

@PluginMethod
public void stopListening(PluginCall call) {
    // Unregister receiver
}
```

### 3. smsService.js

```javascript
async startNotificationListener(callback) {
    const NotificationListenerPlugin = (await import("./notificationPlugin")).default;

    // Register event listener
    await NotificationListenerPlugin.addListener("notificationReceived", (data) => {
        console.log("Notification event received:", data);
        if (callback) callback(data);
    });

    // Start listening
    await NotificationListenerPlugin.startListening();
}
```

### 4. build.gradle

```gradle
// Added dependency
implementation "androidx.localbroadcastmanager:localbroadcastmanager:1.1.0"
```

## Testing Steps

### 1. Rebuild the App

```bash
cd client
npx cap sync android
cd android
./gradlew clean
./gradlew assembleDebug
```

### 2. Install and Grant Permissions

1. Install the app on your device
2. Go to Settings → Apps → MoneyManager → Permissions
3. Enable "Display over other apps"
4. Go to Settings → Apps → Special app access → Notification access
5. Enable "MoneyManager"

### 3. Test Notification Detection

1. Open the app and go to Settings
2. Check that both permissions show as granted
3. Send a test notification from a financial app (e.g., send money via Google Pay)
4. You should see:
   - A popup overlay on screen
   - Console logs in logcat: `adb logcat | grep NotificationListener`
   - The notification data in the app

### 4. Check Logs

```bash
# Filter for notification listener logs
adb logcat | grep -E "NotificationListener|OverlayService|NotificationListenerPlugin"

# Expected output when notification arrives:
# NotificationListener: NEW NOTIFICATION RECEIVED
# NotificationListener: Package: com.google.android.apps.nbu.paisa.user
# NotificationListener: >>> FINANCIAL APP DETECTED
# NotificationListener: Broadcast sent successfully
# NotificationListenerPlugin: Notification received in plugin
# OverlayService: Overlay view added successfully
```

## Common Issues and Solutions

### Issue 1: Service Not Connected

**Symptom**: Logs show "NotificationListener DISCONNECTED"
**Solution**:

- Disable and re-enable notification access in settings
- Restart the device
- Check if battery optimization is killing the service

### Issue 2: No Broadcasts Received

**Symptom**: Notifications logged but plugin doesn't receive them
**Solution**:

- Ensure LocalBroadcastManager dependency is added
- Verify `startListening()` is called from JavaScript
- Check that the app is in foreground or has background permissions

### Issue 3: Overlay Not Showing

**Symptom**: Logs show overlay attempted but nothing appears
**Solution**:

- Verify "Display over other apps" permission is granted
- Check if device has special overlay restrictions (some manufacturers)
- Test with the "Test Overlay" button in settings

### Issue 4: Events Not Reaching JavaScript

**Symptom**: Plugin receives broadcasts but JavaScript callback not called
**Solution**:

- Ensure `addListener()` is called before `startListening()`
- Check that the event name matches: "notificationReceived"
- Verify the callback function is properly defined

## Architecture Flow

```
1. Financial App → Sends Notification
2. Android System → Delivers to NotificationListenerService
3. NotificationListener.java → onNotificationPosted()
   ├─ Logs notification details
   ├─ Shows overlay popup (OverlayService)
   └─ Broadcasts via LocalBroadcastManager
4. NotificationListenerPlugin.java → BroadcastReceiver.onReceive()
   └─ Calls notifyListeners("notificationReceived", data)
5. Capacitor Bridge → Forwards to JavaScript
6. smsService.js → Event listener receives data
7. SMSContext.jsx → Callback processes notification
   └─ Shows category selection modal
```

## Battery Optimization Considerations

Some devices may kill the NotificationListener service to save battery. To prevent this:

1. **Disable Battery Optimization** (optional):
   - Settings → Apps → MoneyManager → Battery → Unrestricted
2. **Keep App in Recent Apps**: Don't swipe away the app from recent apps

3. **Manufacturer-Specific Settings**:
   - **Xiaomi/MIUI**: Settings → Battery & performance → Manage apps battery usage → MoneyManager → No restrictions
   - **Huawei/EMUI**: Settings → Battery → App launch → MoneyManager → Manage manually → Enable all
   - **Samsung**: Settings → Device care → Battery → App power management → MoneyManager → Unrestricted
   - **OnePlus**: Settings → Battery → Battery optimization → MoneyManager → Don't optimize

## Verification Checklist

- [ ] LocalBroadcastManager dependency added to build.gradle
- [ ] NotificationListener broadcasts events
- [ ] NotificationListenerPlugin registers BroadcastReceiver
- [ ] Plugin calls notifyListeners() with event data
- [ ] JavaScript calls addListener() before startListening()
- [ ] SMSContext properly handles notification events
- [ ] Both permissions granted (Notification Access + Display Over Apps)
- [ ] App rebuilt and reinstalled after changes
- [ ] Logs show complete flow from notification to JavaScript

## Next Steps

If notifications are still not being caught:

1. **Enable verbose logging**: Add more Log.d() statements throughout the flow
2. **Test with known apps**: Use Google Pay or Paytm to send test transactions
3. **Check Android version**: Some features may behave differently on Android 12+
4. **Review manufacturer restrictions**: Some OEMs heavily restrict background services
5. **Consider alternative approaches**: Use AccessibilityService as fallback (requires different permission)
