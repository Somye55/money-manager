# Screenshot Monitoring Not Working - Fix Guide

## Issue

Took a screenshot in GPay but nothing happened. No popup appeared.

## Root Cause Analysis

From the logs:

```
2026-01-19 19:26:27.934 NotificationListener D Skipping notification from unselected app: com.miui.screenshot
```

**The ScreenshotListenerService is NOT running!**

There are NO logs from ScreenshotListener in your output, which means:

1. The service was never started, OR
2. Screenshot monitoring is disabled in settings

## Solution

### Step 1: Enable Screenshot Monitoring

1. **Open the Money Manager app**

2. **Go to Settings → Automation**

3. **Scroll down to "Screenshot Monitoring" section**

4. **Grant Storage Permission** (if not already granted):
   - Tap "Grant Permission"
   - Allow "Photos and media" or "Storage" access
   - Return to app

5. **Enable Screenshot Monitoring**:
   - Toggle the switch to **ON**
   - You should see status change to "✓ Enabled"
   - A toast notification should confirm activation

6. **Verify Service Started**:
   - Check logcat for: `Screenshot listener service started (enabled in settings)`
   - You should also see: `ScreenshotListenerService created`

### Step 2: Verify Permissions

Run the debug script:

```bash
debug-screenshot-monitoring.bat
```

This will show:

- Whether screenshot monitoring is enabled in SharedPreferences
- If ScreenshotListenerService is running
- Storage permission status
- Recent ScreenshotListener logs

### Step 3: Test Again

1. **Take a screenshot of a GPay payment**
2. **Watch logcat for these messages**:

   ```
   ScreenshotListener: MediaStore change detected
   ScreenshotListener: Screenshot monitoring enabled: true
   ScreenshotListener: New screenshot detected: content://...
   ScreenshotListener: Processing screenshot with OCR...
   OCRProcessor: ✅ Extracted X text blocks
   OCRProcessor: 🤖 Calling Groq server for AI parsing...
   OCRProcessor: ✅ Groq parsed - Amount: X, Merchant: Y
   OverlayService: Overlay service started for screenshot expense
   ```

3. **Popup should appear within 3-5 seconds**

## Expected Logs When Working

### On App Launch (if enabled):

```
MainActivity: Screenshot listener service started (enabled in settings)
ScreenshotListener: ScreenshotListenerService created
ScreenshotListener: Screenshot observer registered successfully
ScreenshotListener: ScreenshotListenerService started
```

### When Screenshot Taken:

```
ScreenshotListener: MediaStore change detected: content://media/external/images/media
ScreenshotListener: Screenshot monitoring enabled: true
ScreenshotListener: Found screenshot: /storage/emulated/0/DCIM/Screenshots/Screenshot_20260119_192627.png
ScreenshotListener: New screenshot detected: content://media/external/images/media/12345
ScreenshotListener: Processing screenshot with OCR...
OCRProcessor: 🚀 OCRProcessor initialized with Groq AI parsing
OCRProcessor: Processing image from URI
OCRProcessor: ✅ Extracted 15 text blocks in reading order
OCRProcessor: 🔧 Enhancing text with currency symbols...
OCRProcessor: 🤖 Calling Groq server for AI parsing...
OCRProcessor: Response code: 200
OCRProcessor: ✅ Groq server response received
OCRProcessor: ✅ Groq parsed - Amount: 500.0, Merchant: Google Pay, Type: debit
ScreenshotListener: OCR Success - Amount: 500.0, Merchant: Google Pay
ScreenshotListener: Overlay service started for screenshot expense
OverlayService: === OverlayService CREATED ===
OverlayService: === showOverlay called ===
```

## Troubleshooting

### Issue 1: "Screenshot monitoring disabled in settings"

**Solution**: Enable it in Settings → Automation → Screenshot Monitoring

### Issue 2: No "Screenshot Monitoring" section in settings

**Solution**:

1. Rebuild the app: `npm run build && npx cap sync android`
2. Reinstall the app
3. Check again

### Issue 3: Permission denied

**Solution**:

1. Go to Android Settings → Apps → Money Manager → Permissions
2. Enable "Photos and media" or "Storage"
3. Return to app and toggle screenshot monitoring OFF then ON

### Issue 4: Service not starting

**Solution**:

1. Force close the app completely
2. Reopen the app
3. Go to Settings → Automation
4. Toggle screenshot monitoring OFF
5. Wait 2 seconds
6. Toggle it back ON
7. Check logcat for service start message

### Issue 5: Popup not appearing (but service is running)

**Solution**:

1. Check overlay permission:
   - Settings → Apps → Money Manager
   - "Display over other apps" must be ON
2. Check logcat for: "No overlay permission, cannot show popup"
3. If missing, enable it and try again

## Quick Test

After enabling screenshot monitoring:

1. **Take a test screenshot** of anything (home screen is fine)
2. **Check logcat immediately**:
   ```bash
   adb logcat | grep -E "ScreenshotListener|OCRProcessor|OverlayService"
   ```
3. **You should see logs within 1-2 seconds**
4. **If no logs appear**: Service is not running, go back to Step 1

## Manual Service Start (Debug)

If you want to manually start the service for testing:

```bash
adb shell am startservice com.moneymanager.app/.ScreenshotListenerService
```

Then check logs:

```bash
adb logcat | grep ScreenshotListener
```

## Verify Settings Storage

Check if the setting is stored:

```bash
adb shell "run-as com.moneymanager.app cat /data/data/com.moneymanager.app/shared_prefs/app_settings.xml"
```

Look for:

```xml
<boolean name="screenshot_monitoring_enabled" value="true" />
```

If it's `false` or missing, the feature is disabled.

## Summary

**The issue is simple**: Screenshot monitoring is not enabled in your app settings.

**The fix is simple**:

1. Open app → Settings → Automation
2. Enable Screenshot Monitoring
3. Take a screenshot
4. Popup will appear

**After enabling, you should see these logs when taking a screenshot**:

- ScreenshotListener: MediaStore change detected
- ScreenshotListener: Screenshot monitoring enabled: true
- ScreenshotListener: Processing screenshot with OCR...
- OCRProcessor: ✅ Groq parsed - Amount: X
- OverlayService: Overlay service started

If you still don't see these logs after enabling, run `debug-screenshot-monitoring.bat` and share the output.
