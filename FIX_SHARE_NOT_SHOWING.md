# Fix: App Not Showing in Share Menu

## Problem

Money Manager doesn't appear in the share menu when sharing from Google Pay.

## Root Cause

The intent filters were added to AndroidManifest.xml, but the app needs to be rebuilt and reinstalled for Android to recognize them.

## Solution

### Step 1: Sync Capacitor

```bash
cd client
npx cap sync android
```

### Step 2: Clean Build

```bash
cd android
./gradlew clean
```

Or on Windows:

```bash
cd android
gradlew.bat clean
```

### Step 3: Rebuild in Android Studio

1. Open Android Studio
2. Click **Build** → **Clean Project**
3. Wait for it to complete
4. Click **Build** → **Rebuild Project**
5. Wait for build to complete

### Step 4: Uninstall Old App

**Important**: You must uninstall the old version first!

On device:

- Settings → Apps → Money Manager → Uninstall

Or via ADB:

```bash
adb uninstall com.moneymanager.app
```

### Step 5: Install New Build

In Android Studio:

- Click **Run** (green play button)
- Or use: `adb install app/build/outputs/apk/debug/app-debug.apk`

### Step 6: Test

1. Open Google Pay
2. Go to any transaction
3. Tap **Share** button
4. Look for **Money Manager** in the list
5. Tap it to test

## Verification Checklist

- [ ] Capacitor synced
- [ ] Project cleaned
- [ ] Project rebuilt
- [ ] Old app uninstalled
- [ ] New app installed
- [ ] App appears in share menu
- [ ] Share works correctly

## Alternative: Quick Rebuild Script

Create `rebuild-for-share.bat`:

```batch
@echo off
echo Rebuilding app with share support...
cd client
call npx cap sync android
cd android
call gradlew clean assembleDebug
echo.
echo Build complete! Now:
echo 1. Uninstall old app from device
echo 2. Install: adb install app/build/outputs/apk/debug/app-debug.apk
echo 3. Test share from Google Pay
pause
```

## Troubleshooting

### Still Not Showing?

#### Check 1: Verify Intent Filters

```bash
# Extract and check AndroidManifest.xml from APK
adb shell dumpsys package com.moneymanager.app | grep -A 20 "Activity"
```

Should show:

```
action: android.intent.action.SEND
type: image/*
```

#### Check 2: Clear Android Cache

```bash
# Clear package manager cache
adb shell pm clear com.android.providers.media
```

Then restart device.

#### Check 3: Verify Package Name

In `AndroidManifest.xml`, ensure:

```xml
package="com.moneymanager.app"
```

#### Check 4: Check Android Version

Share intents work on Android 5.0+ (API 21+)

```bash
adb shell getprop ro.build.version.sdk
```

Should be ≥ 21

### Debug Commands

#### List all apps that handle image sharing:

```bash
adb shell pm query-activities -a android.intent.action.SEND -t image/*
```

Your app should appear in this list.

#### Check if app is installed:

```bash
adb shell pm list packages | grep moneymanager
```

Should show: `package:com.moneymanager.app`

#### View app info:

```bash
adb shell dumpsys package com.moneymanager.app
```

Look for the SEND intent filter in the output.

## Common Mistakes

### ❌ Mistake 1: Not Uninstalling Old App

**Problem**: Android caches intent filters
**Solution**: Always uninstall before reinstalling

### ❌ Mistake 2: Not Syncing Capacitor

**Problem**: Changes not copied to Android project
**Solution**: Run `npx cap sync android`

### ❌ Mistake 3: Not Cleaning Build

**Problem**: Old build artifacts remain
**Solution**: Run `gradlew clean`

### ❌ Mistake 4: Installing Over Old Version

**Problem**: Intent filters not updated
**Solution**: Uninstall first, then install

## Expected Result

After following these steps, when you:

1. Open Google Pay
2. Tap Share on any transaction
3. You should see **Money Manager** in the share menu
4. Tapping it should open Money Manager
5. A popup should appear with the expense details

## If It Still Doesn't Work

### Last Resort: Complete Clean Install

```bash
# 1. Uninstall completely
adb uninstall com.moneymanager.app

# 2. Clear all caches
adb shell pm clear com.android.providers.media

# 3. Restart device
adb reboot

# 4. After reboot, sync and build
cd client
npx cap sync android
cd android
./gradlew clean assembleDebug

# 5. Install fresh
adb install app/build/outputs/apk/debug/app-debug.apk

# 6. Test immediately
```

## Success Indicators

✅ App appears in share menu
✅ Tapping opens Money Manager
✅ Popup appears with expense data
✅ Amount is extracted correctly
✅ Merchant name is shown
✅ Category selection works
✅ Expense saves successfully

## Next Steps

Once the app appears in share menu:

1. Test with different payment apps
2. Test with different transaction types
3. Verify OCR accuracy
4. Check popup functionality
5. Confirm expense saves correctly

---

**Most Important**: Uninstall the old app before installing the new one!
