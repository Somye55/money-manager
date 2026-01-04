# Plugin Not Found - Fix Guide

## Problem

You're on Android (`Platform: android`, `Is Native: true`) but the plugin shows as `false`. This means the plugin isn't exposed to the window object for testing.

## Solution Applied

I've updated `client/src/main.jsx` to expose the plugin to `window` for testing purposes.

## Steps to Fix

### 1. Rebuild the App

Run this command:

```bash
quick-rebuild.bat
```

Or manually:

```bash
cd client
npm run build
npx cap sync android
```

### 2. Reinstall on Device

In Android Studio:

- Click the green Run button (▶️)
- Wait for app to install and launch

### 3. Reconnect DevTools

In Edge:

- Go to `edge://inspect/#devices`
- Find "Money Manager"
- Click "inspect"
- **Important:** Refresh the DevTools page if it was already open

### 4. Test Plugin Access

Paste this in the console:

```javascript
// Method 1: Try window
window.NotificationListenerPlugin.testOverlay();

// Method 2: Try Capacitor.Plugins
window.Capacitor.Plugins.NotificationListenerPlugin.testOverlay();

// Method 3: Check what's available
console.log("Available plugins:", Object.keys(window.Capacitor.Plugins));
```

## Alternative: Use Capacitor.Plugins Directly

If the plugin still isn't on `window`, you can access it via Capacitor:

```javascript
// Set it manually
window.NotificationListenerPlugin =
  window.Capacitor.Plugins.NotificationListenerPlugin;

// Then test
window.NotificationListenerPlugin.testOverlay();
```

## Diagnostic Script

Paste this to diagnose the issue:

```javascript
(async function () {
  console.log("=== DIAGNOSTIC ===");

  // Check platform
  console.log("Platform:", window.Capacitor?.getPlatform());
  console.log("Is Native:", window.Capacitor?.isNativePlatform());

  // Check available plugins
  if (window.Capacitor?.Plugins) {
    const plugins = Object.keys(window.Capacitor.Plugins);
    console.log("Available plugins:", plugins);

    // Check if our plugin is there
    if (plugins.includes("NotificationListenerPlugin")) {
      console.log("✅ NotificationListenerPlugin found in Capacitor.Plugins");

      // Expose it to window
      window.NotificationListenerPlugin =
        window.Capacitor.Plugins.NotificationListenerPlugin;
      console.log("✅ Exposed to window.NotificationListenerPlugin");

      // Test it
      try {
        const result =
          await window.NotificationListenerPlugin.getPermissionStatus();
        console.log("✅ Plugin works! Permission status:", result);

        console.log("\n=== READY TO TEST ===");
        console.log("Run: window.NotificationListenerPlugin.testOverlay()");
      } catch (e) {
        console.error("❌ Plugin error:", e);
      }
    } else {
      console.error("❌ NotificationListenerPlugin not found");
      console.log("Available plugins:", plugins);
    }
  } else {
    console.error("❌ Capacitor.Plugins not available");
  }
})();
```

## If Plugin Still Not Found

### Check 1: Verify Plugin is Registered

In Android Studio, check `MainActivity.java`:

```java
registerPlugin(NotificationListenerPlugin.class);
```

Should be present in `onCreate()` method.

### Check 2: Check Android Logs

Run this command:

```bash
adb logcat | findstr "NotificationListenerPlugin"
```

Look for:

- "Plugin registered: NotificationListenerPlugin"
- Any error messages

### Check 3: Clean Build

```bash
cd client/android
gradlew clean
cd ..
npm run build
npx cap sync android
```

Then reinstall the app.

### Check 4: Check Package Name

In DevTools console:

```javascript
console.log("Package:", window.Capacitor?.getPlatform());
console.log("Plugins:", window.Capacitor?.Plugins);
```

## Quick Test Without Plugin Variable

You can test directly without assigning to window:

```javascript
// Test overlay directly
window.Capacitor.Plugins.NotificationListenerPlugin.testOverlay()
  .then((result) => console.log("✅ Success:", result))
  .catch((error) => console.error("❌ Error:", error));

// Check permissions
window.Capacitor.Plugins.NotificationListenerPlugin.getPermissionStatus()
  .then((result) => console.log("Permissions:", result))
  .catch((error) => console.error("Error:", error));
```

## Expected Output After Fix

After rebuilding and reinstalling, you should see:

```
=== DIAGNOSTIC ===
Platform: android
Is Native: true
Available plugins: ["App", "Browser", "Capacitor", "Device", "NotificationListenerPlugin", "SettingsHelper", ...]
✅ NotificationListenerPlugin found in Capacitor.Plugins
✅ Exposed to window.NotificationListenerPlugin
✅ Plugin works! Permission status: {notificationAccess: true, overlayPermission: true, allGranted: true}

=== READY TO TEST ===
Run: window.NotificationListenerPlugin.testOverlay()
```

## Test the Overlay

Once the plugin is accessible:

```javascript
// Test overlay
window.NotificationListenerPlugin.testOverlay();
```

You should see:

- ✅ Overlay popup appears on device
- ✅ Shows test notification
- ✅ Has category dropdown
- ✅ Has "Save Expense" button

## Still Having Issues?

If the plugin still doesn't work after rebuilding:

1. **Check if app is actually updated:**

   - Uninstall the app from device
   - Reinstall from Android Studio
   - Check app version/build number

2. **Check Android logs:**

   ```bash
   adb logcat -s MainActivity NotificationListenerPlugin
   ```

3. **Try a different approach:**

   - Use the Settings page in the app
   - Test with a real notification instead
   - Check if manual expense entry works

4. **Verify build:**
   ```bash
   cd client
   npm run build
   # Check if build succeeded
   dir dist
   ```

## Summary

The fix is simple:

1. Run `quick-rebuild.bat`
2. Reinstall app in Android Studio
3. Refresh DevTools
4. Try: `window.Capacitor.Plugins.NotificationListenerPlugin.testOverlay()`

The plugin should now be accessible! 🚀
