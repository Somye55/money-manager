# 🔧 HTTP Cleartext Traffic Fix

## Problem

Android is blocking HTTP connections to localhost server with error:

```
java.io.IOException: Cleartext HTTP traffic to 10.0.2.2 not permitted
```

## Root Cause

Even though we have `network_security_config.xml`, Android may still block cleartext traffic due to:

1. Config not properly applied in manifest
2. Android 9+ (API 28+) blocks cleartext by default
3. Build cache issues

## ✅ Solution Applied

### 1. Network Security Config (Already Set)

File: `client/android/app/src/main/res/xml/network_security_config.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">127.0.0.1</domain>
    </domain-config>
</network-security-config>
```

### 2. Manifest Configuration (Already Set)

File: `client/android/app/src/main/AndroidManifest.xml`

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

### 3. Additional Manifest Flag (NEW FIX)

Add `android:usesCleartextTraffic="true"` to application tag as backup.

## 🚀 Quick Fix Steps

### Step 1: Start Server

```bash
cd server
npm run dev
```

**Verify server is running:**

```bash
curl http://localhost:3000/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### Step 2: Clean Build Android App

```bash
cd client
npx cap sync android
cd android
./gradlew clean
./gradlew assembleDebug
```

### Step 3: Install & Test

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Step 4: Grant Overlay Permission

```bash
adb shell appops set com.moneymanager.app SYSTEM_ALERT_WINDOW allow
```

### Step 5: Test OCR

1. Open any payment app (Google Pay, PhonePe, etc.)
2. Take a screenshot of a transaction
3. Share screenshot → Money Manager
4. Should show popup with parsed amount

## 📋 Verification Checklist

- [ ] Server running on port 3000
- [ ] Server has GEMINI_API_KEY in .env
- [ ] `/health` endpoint responds
- [ ] Android app rebuilt with clean
- [ ] Overlay permission granted
- [ ] Share screenshot shows popup (not full app)
- [ ] Amount parsed correctly by Gemini

## 🐛 Troubleshooting

### Server Not Responding

```bash
# Check if server is running
curl http://localhost:3000/health

# Check server logs
cd server
npm run dev
# Look for "Server running on port 3000"
```

### Still Getting Cleartext Error

1. Make sure you did a clean build: `./gradlew clean`
2. Uninstall old app: `adb uninstall com.moneymanager.app`
3. Rebuild and reinstall
4. Check Android version (must be API 28+)

### Popup Not Showing

```bash
# Grant overlay permission
adb shell appops set com.moneymanager.app SYSTEM_ALERT_WINDOW allow

# Check logs
adb logcat | grep -E "OverlayService|OCRProcessor|MainActivity"
```

### Wrong Amount Parsed

- Check server logs for Gemini response
- Verify GEMINI_API_KEY is valid
- Test Gemini directly: `node test-gemini-ocr.js`

## 📱 Expected Behavior

When you share a payment screenshot:

1. ✅ App receives shared image
2. ✅ OCR extracts text from image
3. ✅ Text sent to server at `http://10.0.2.2:3000/api/ocr/parse`
4. ✅ Gemini AI parses amount, merchant, type
5. ✅ Popup shows with parsed data
6. ✅ User can save expense

## 🔍 Debug Commands

```bash
# Watch all relevant logs
adb logcat | grep -E "OCRProcessor|OverlayService|MainActivity|Gemini"

# Test server endpoint
curl -X POST http://localhost:3000/api/ocr/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"Paid Rs. 340.39 to Nisha Sharma"}'

# Check overlay permission
adb shell appops get com.moneymanager.app SYSTEM_ALERT_WINDOW
```

## ✨ What's Working Now

- ✅ OCR text extraction using ML Kit
- ✅ Gemini AI parsing (amount, merchant, type)
- ✅ Server endpoint at `/api/ocr/parse`
- ✅ Network security config for localhost
- ✅ Popup component for quick expense save
- ✅ Share intent handling

## 🎯 Next Steps

1. **Start server** (if not running)
2. **Clean rebuild** Android app
3. **Grant permissions**
4. **Test with real screenshot**
