# Quick Fix: Enable Share Feature

## The Problem

App not showing in Google Pay share menu.

## The Solution (3 Steps)

### 1. Run the Rebuild Script

```bash
rebuild-for-share.bat
```

This will:

- Sync Capacitor
- Clean project
- Build new APK
- Uninstall old app

### 2. Install New APK

```bash
adb install client\android\app\build\outputs\apk\debug\app-debug.apk
```

### 3. Test It

1. Open Google Pay
2. Tap Share on any transaction
3. Look for "Money Manager"
4. Tap it!

---

## Manual Steps (If Script Fails)

### Step 1: Sync

```bash
cd client
npx cap sync android
```

### Step 2: Uninstall Old App

```bash
adb uninstall com.moneymanager.app
```

### Step 3: Build & Install

```bash
cd android
gradlew clean assembleDebug
cd ..\..
adb install client\android\app\build\outputs\apk\debug\app-debug.apk
```

### Step 4: Test

Open Google Pay → Share → Money Manager

---

## Why This Happens

Android caches intent filters. When you add new intent filters (like SEND for sharing), you must:

1. **Uninstall** the old app (clears cache)
2. **Rebuild** the app (includes new filters)
3. **Install** fresh (registers new filters)

Simply installing over the old version won't work!

---

## Verify It Worked

### Check 1: App in Share Menu

Open Google Pay → Share → Should see "Money Manager"

### Check 2: Share Works

Tap Money Manager → Popup should appear

### Check 3: OCR Works

Popup should show amount and merchant

---

## Still Not Working?

### Try This:

```bash
# Complete clean install
adb uninstall com.moneymanager.app
adb reboot
# Wait for device to restart
cd client
npx cap sync android
cd android
gradlew clean assembleDebug
cd ..\..
adb install client\android\app\build\outputs\apk\debug\app-debug.apk
```

### Check Logs:

```bash
adb logcat | findstr "MainActivity"
```

Then share from Google Pay and watch the logs.

---

## Success!

When it works, you'll see:

1. ✅ "Money Manager" in share menu
2. ✅ App opens when tapped
3. ✅ Popup shows with expense data
4. ✅ Amount and merchant extracted
5. ✅ Can save expense

---

**Quick Command**: `rebuild-for-share.bat` then `adb install client\android\app\build\outputs\apk\debug\app-debug.apk`
