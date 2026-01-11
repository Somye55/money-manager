# 🚀 START HERE - OCR Cleartext Fix

## 🎯 The Problem

Your Android app was getting this error:

```
java.io.IOException: Cleartext HTTP traffic to 10.0.2.2 not permitted
```

This prevented the app from connecting to your local development server for Gemini AI parsing.

## ✅ The Fix

Added `android:usesCleartextTraffic="true"` to AndroidManifest.xml to allow HTTP connections to localhost during development.

## 🏃 Quick Start (3 Steps)

### Step 1: Start Server

Open a terminal and run:

```bash
cd server
npm run dev
```

You should see:

```
Server running on port 3000
```

**Keep this terminal open!**

### Step 2: Test Server (Optional but Recommended)

Open another terminal:

```bash
node test-server-ocr.js
```

Expected output:

```
✅ Response:
{
  "success": true,
  "data": {
    "amount": 34039,
    "merchant": "Nisha Sharma",
    "type": "debit",
    "confidence": 95
  }
}
✅ Amount parsed correctly!
```

### Step 3: Rebuild & Install App

Run the automated script:

```bash
fix-and-test-ocr.bat
```

This will:

1. Check server is running
2. Sync Capacitor
3. Clean build
4. Build APK
5. Install on device
6. Grant overlay permission

**OR manually:**

```bash
cd client
npx cap sync android
cd android
gradlew clean
gradlew assembleDebug
adb install -r app\build\outputs\apk\debug\app-debug.apk
adb shell appops set com.moneymanager.app SYSTEM_ALERT_WINDOW allow
```

## 🧪 Test It!

1. Open Google Pay, PhonePe, or any payment app
2. Take a screenshot of a transaction
3. Share the screenshot → Select "Money Manager"
4. **Popup should appear** with:
   - Parsed amount
   - Merchant name
   - Category selector
   - Save button

## 🐛 Troubleshooting

### Server Not Running

```bash
cd server
npm run dev
```

### Server Running But Not Responding

```bash
curl http://localhost:3000/health
```

Should return: `{"status":"ok","timestamp":"..."}`

If not, check:

- Is port 3000 already in use?
- Is GEMINI_API_KEY in server/.env?

### App Still Shows Error

1. Make sure you did a **clean build**: `gradlew clean`
2. Uninstall old app: `adb uninstall com.moneymanager.app`
3. Rebuild and reinstall
4. Check logs: `adb logcat | findstr "OCRProcessor"`

### Popup Not Showing

```bash
# Grant overlay permission
adb shell appops set com.moneymanager.app SYSTEM_ALERT_WINDOW allow

# Verify
adb shell appops get com.moneymanager.app SYSTEM_ALERT_WINDOW
# Should show: SYSTEM_ALERT_WINDOW: allow
```

### Wrong Amount Parsed

- Check server logs for Gemini response
- Verify GEMINI_API_KEY is valid
- Test with: `node test-server-ocr.js`

## 📊 Watch Logs

```bash
adb logcat | findstr "OCRProcessor OverlayService MainActivity"
```

Expected logs:

```
D OCRProcessor: OCR extracted text: To Nisha Sharma...
D OCRProcessor: 🤖 Attempting Gemini API call...
D OCRProcessor: Connecting to: http://10.0.2.2:3000/api/ocr/parse
D OCRProcessor: Response code: 200
D OCRProcessor: ✅ Gemini parsed - Amount: 34039.0
I OverlayService: ✅ Overlay permission granted
I OverlayService: 📱 Showing expense popup overlay
```

## 🎉 What's Working Now

- ✅ **OCR**: ML Kit extracts text from screenshots
- ✅ **AI Parsing**: Gemini 1.5 Flash parses amount, merchant, type
- ✅ **Network**: HTTP cleartext allowed for localhost
- ✅ **Server**: Express endpoint at `/api/ocr/parse`
- ✅ **UI**: Popup overlay for quick expense save
- ✅ **Share**: Intent handling for image sharing

## 📁 Key Files

- `client/android/app/src/main/AndroidManifest.xml` - Cleartext flag added
- `client/android/app/src/main/res/xml/network_security_config.xml` - Network config
- `client/android/app/src/main/java/com/moneymanager/app/OCRProcessor.java` - OCR logic
- `server/src/index.js` - Server with `/api/ocr/parse` endpoint
- `server/src/services/geminiParser.js` - Gemini AI integration
- `server/.env` - Contains GEMINI_API_KEY

## 🔥 Ready to Test?

1. **Server running?** ✅
2. **App rebuilt?** ✅
3. **Permission granted?** ✅

**Go share a payment screenshot!** 🚀

---

## 📚 More Documentation

- `HTTP_CLEARTEXT_FIX.md` - Detailed fix explanation
- `README_GEMINI_INTEGRATION.md` - Gemini AI setup
- `README_OCR_FEATURE.md` - OCR feature overview
- `READY_TO_TEST.md` - Testing guide
