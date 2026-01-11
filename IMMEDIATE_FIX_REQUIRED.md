# 🚨 CLEARTEXT HTTP TRAFFIC FIX

## Problem Identified

```
java.io.IOException: Cleartext HTTP traffic to 10.0.2.2 not permitted
```

Android is blocking HTTP connections to your localhost development server.

## ✅ Fixes Applied

### 1. Added Cleartext Traffic Flag

Updated `AndroidManifest.xml` with:

```xml
android:usesCleartextTraffic="true"
```

### 2. Network Security Config (Already Present)

File: `client/android/app/src/main/res/xml/network_security_config.xml`

- Allows cleartext traffic to 10.0.2.2 (emulator localhost)
- Allows cleartext traffic to localhost and 127.0.0.1

### 3. Server Configuration Verified

- Server endpoint: `/api/ocr/parse`
- Gemini API key: ✅ Present in `server/.env`
- Port: 3000

## 🚀 QUICK FIX - Run This Script

```bash
fix-and-test-ocr.bat
```

This will:

1. ✅ Check server is running
2. ✅ Sync Capacitor
3. ✅ Clean build
4. ✅ Build APK
5. ✅ Install on device
6. ✅ Grant overlay permission

## 📋 Manual Steps (If Script Fails)

### Step 1: Start Server

```bash
cd server
npm run dev
```

**Verify:**

```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}
```

**Test OCR endpoint:**

```bash
node test-server-ocr.js
# Should parse amount: 34039
```

### Step 2: Clean Rebuild Android

```bash
cd client
npx cap sync android
cd android
gradlew clean
gradlew assembleDebug
```

### Step 3: Install & Grant Permission

```bash
adb install -r app\build\outputs\apk\debug\app-debug.apk
adb shell appops set com.moneymanager.app SYSTEM_ALERT_WINDOW allow
```

### Step 4: Test

1. Open Google Pay or any payment app
2. Take screenshot of transaction
3. Share to Money Manager
4. Popup should appear with parsed amount

## 🐛 Watch Logs

```bash
adb logcat | findstr "OCRProcessor OverlayService MainActivity Gemini"
```

## ✅ Expected Log Output

```
D OCRProcessor: OCR extracted text: To Nisha Sharma...
D OCRProcessor: 🤖 Attempting Gemini API call...
D OCRProcessor: Connecting to: http://10.0.2.2:3000/api/ocr/parse
D OCRProcessor: Response code: 200
D OCRProcessor: ✅ Gemini parsed - Amount: 34039.0, Merchant: Nisha Sharma
I OverlayService: ✅ Overlay permission granted
I OverlayService: 📱 Showing expense popup overlay
```

## 🎯 What Changed

1. **Manifest**: Added `android:usesCleartextTraffic="true"` as backup
2. **Network Config**: Already allows 10.0.2.2 cleartext traffic
3. **Server**: Gemini integration working correctly
4. **OCR**: ML Kit extracts text → Gemini parses amount

## 📚 Documentation

- Full details: `HTTP_CLEARTEXT_FIX.md`
- Gemini setup: `README_GEMINI_INTEGRATION.md`
- OCR feature: `README_OCR_FEATURE.md`
