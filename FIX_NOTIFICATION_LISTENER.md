# Fix Notification Listener Not Connected

## Problem

The logs show:

```
Service created but not connected - Android may have unbound it
Notification listener connected: false, created: true
```

This means:

- ✅ Permission is granted
- ✅ Service is created
- ❌ Android hasn't bound the service (not connected)

## Solution: Force Android to Rebind

### Method 1: Toggle Permission (Recommended)

1. Open Android Settings
2. Go to: **Settings → Apps → Special app access → Notification access**
3. Find **Money Manager** and toggle it **OFF**
4. Wait 2 seconds
5. Toggle it back **ON**
6. Return to the app

This forces Android to rebind the notification listener service.

### Method 2: Restart the App

1. Force stop the app completely
2. Clear from recent apps
3. Reopen the app

### Method 3: Reboot Device

If the above don't work:

1. Restart your Android device
2. Open the app after reboot

## Why This Happens

Android can unbind notification listener services for various reasons:

- Battery optimization
- Memory pressure
- System updates
- App updates
- Service crashes

The app has reconnection logic, but sometimes Android needs a manual permission toggle to rebind.

## Verify It's Working

After toggling the permission, check the logs:

```bash
adb logcat | findstr "NotificationListener CONNECTED"
```

You should see:

```
NotificationListener CONNECTED - Service is now active!
```

## Test the Popup

Once connected:

1. Go to Settings → Automation
2. Click "Test Popup" button
3. You should see the overlay popup

Or send a test notification with the format:

```
Paid Rs.100.00 to John (2026:01:04 13:30:00)
```

The popup should appear automatically.
