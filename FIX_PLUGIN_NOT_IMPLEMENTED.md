# Fix: "Plugin is not implemented on android"

## The Problem

You're getting: `"NotificationListenerPlugin" plugin is not implemented on android`

This means Capacitor can't find the plugin at runtime, even though it's registered in MainActivity. This is usually caused by:

1. Stale build cache
2. Plugin not properly synced
3. Old app version still installed

## Solution: Full Clean Rebuild

### Step 1: Run Full Clean Rebuild

```bash
full-clean-rebuild.bat
```

This will:

- Clean Android build cache
- Remove old artifacts
- Rebuild everything from scratch
- Sync with Capacitor
- Open Android Studio

### Step 2: Clean in Android Studio

**IMPORTANT:** Wait for Gradle sync to complete (bottom right corner shows progress)

Then:

1. Click **Build** → **Clean Project**
2. Wait for it to finish
3. Click **Build** → **Rebuild Project**
4. Wait for rebuild to complete (can take 2-5 minutes)

### Step 3: Uninstall Old App

On your Android device:

1. Long press the **Money Manager** app icon
2. Click **Uninstall** or drag to uninstall
3. Confirm uninstall

**Why?** The old app has the broken plugin registration. We need a fresh install.

### Step 4: Install Fresh Build

In Android Studio:

1. Make sure your device is selected in the dropdown
2. Click the green **Run** button (▶️)
3. Wait for installation (1-2 minutes)
4. App should launch automatically

### Step 5: Test Plugin

1. In Edge, go to `edge://inspect/#devices`
2. Find **Money Manager**
3. Click **inspect**
4. In console, paste:

```javascript
// Check if plugin is now available
console.log("Available plugins:", Object.keys(window.Capacitor.Plugins));

// Test the plugin
window.Capacitor.Plugins.NotificationListenerPlugin.testOverlay()
  .then((result) => {
    console.log("✅ SUCCESS! Overlay should appear on device");
    console.log("Result:", result);
  })
  .catch((error) => {
    console.error("❌ Still not working:", error);
  });
```

## Expected Result

After the clean rebuild and fresh install:

✅ Console shows: `Available plugins: [..., "NotificationListenerPlugin", ...]`
✅ No error when calling testOverlay()
✅ Overlay popup appears on your Android device
✅ Shows test notification with category dropdown

## If It Still Doesn't Work

### Check 1: Verify Plugin is in Build

In Android Studio, check the logcat:

```
adb logcat | findstr "Plugins registered"
```

Should show:

```
MainActivity: Plugins registered: SettingsHelper, NotificationListenerPlugin
```

### Check 2: Verify App Version

Make sure the new version is installed:

```javascript
// In DevTools console
console.log("App version:", window.Capacitor.getPlatform());
console.log("Plugins:", Object.keys(window.Capacitor.Plugins));
```

If NotificationListenerPlugin is NOT in the list, the old app is still installed.

### Check 3: Manual Uninstall via ADB

If uninstalling from device didn't work:

```bash
adb uninstall com.moneymanager.app
```

Then reinstall from Android Studio.

### Check 4: Check for Build Errors

In Android Studio, check the **Build** tab (bottom) for any errors during rebuild.

Common issues:

- Missing dependencies
- Gradle sync failed
- Java version mismatch

## Alternative: Test Without Full Rebuild

If you can't do a full rebuild right now, try this workaround:

### Option A: Test Manual Expense Entry

The fix I made for the overlay also applies to manual entry:

1. Open the app
2. Go to **Add Expense** page
3. Enter amount: 100
4. Enter description: Test
5. Select a category
6. Click "Add Expense"
7. Check if it saves successfully

This tests the same database flow!

### Option B: Test with Real Notification

1. Grant all permissions in Settings
2. Send yourself a payment message on WhatsApp:
   ```
   You spent Rs.100 at Test Restaurant
   ```
3. See if the React popup modal appears
4. Select category and save

This tests the notification parsing and React modal flow.

## Why This Happens

The "plugin is not implemented" error occurs when:

1. **Stale cache:** Android Studio cached the old build without the plugin
2. **Partial sync:** Capacitor sync didn't fully update the native code
3. **Old app:** The installed app is from an old build

The solution is always: **Clean everything and rebuild from scratch**

## Summary

1. Run `full-clean-rebuild.bat`
2. In Android Studio: Build → Clean Project → Rebuild Project
3. Uninstall old app from device
4. Install fresh build from Android Studio
5. Test in DevTools

This should fix the "plugin is not implemented" error! 🚀

## Still Having Issues?

If after following all steps the plugin still doesn't work:

1. **Check Android Studio logs:**

   - Look for plugin registration errors
   - Check for Java/Kotlin compilation errors

2. **Verify plugin file exists:**

   ```
   client/android/app/src/main/java/com/moneymanager/app/NotificationListenerPlugin.java
   ```

3. **Check package name matches:**

   - In NotificationListenerPlugin.java: `package com.moneymanager.app;`
   - In MainActivity.java: `package com.moneymanager.app;`
   - In capacitor.config.json: `"appId": "com.moneymanager.app"`

4. **Try a different device/emulator:**
   - Sometimes device-specific issues occur
   - Test on Android emulator if available

Let me know the results after the clean rebuild!
