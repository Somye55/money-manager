# 🚀 Build & Test Groq Integration

> Complete guide to build and test the Groq-powered Money Manager app

## ✅ Prerequisites

- [x] Node.js 18+ installed
- [x] Android Studio installed
- [x] Groq API key obtained
- [x] Server configured with API key

## 🎯 Quick Build & Test (5 Minutes)

### Step 1: Configure API Key (30 seconds)

```bash
# Open server/.env and add:
GROQ_API_KEY=gsk_your_key_here
```

### Step 2: Test Server (1 minute)

```bash
# Terminal 1: Start server
cd server
npm run dev

# Terminal 2: Test Groq
npm run test:groq
```

**Expected output:**

```
🧪 Testing Groq OCR Parser

📝 Test: Google Pay Payment
✅ Success:
   Amount: ₹500
   Merchant: Zomato
   Type: debit
   Confidence: 95%

✨ Testing complete!
```

### Step 3: Build Android (2 minutes)

```bash
cd client
npm run build
npx cap sync android
```

### Step 4: Run in Android Studio (1 minute)

1. Open `client/android` in Android Studio
2. Wait for Gradle sync
3. Click Run ▶️
4. Select emulator or device

### Step 5: Test Screenshot (30 seconds)

1. Open a payment app (or use a screenshot)
2. Take screenshot
3. Overlay should appear with parsed data
4. Check logs for: `✅ Groq parsed`

## 📋 Detailed Build Instructions

### Server Setup

#### 1. Install Dependencies

```bash
cd server
npm install
```

#### 2. Configure Environment

```bash
# Create/edit server/.env
GROQ_API_KEY=gsk_your_key_here
DATABASE_URL=your_database_url
PORT=3000
```

#### 3. Start Server

```bash
npm run dev
```

**Verify:**

```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Android Build

#### 1. Install Dependencies

```bash
cd client
npm install
```

#### 2. Build Web Assets

```bash
npm run build
```

#### 3. Sync with Android

```bash
npx cap sync android
```

#### 4. Open in Android Studio

```bash
npx cap open android
```

#### 5. Build & Run

- Click "Run" ▶️ in Android Studio
- Select emulator or device
- Wait for build to complete

## 🧪 Testing Guide

### Test 1: Server Health Check

```bash
curl http://localhost:3000/health
```

**Expected:**

```json
{ "status": "ok", "timestamp": "2025-01-14T..." }
```

### Test 2: Groq API Endpoint

```bash
curl -X POST http://localhost:3000/api/ocr/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"Paid ₹500 to Zomato"}'
```

**Expected:**

```json
{
  "success": true,
  "data": {
    "amount": 500,
    "merchant": "Zomato",
    "type": "debit",
    "confidence": 95
  }
}
```

### Test 3: Test Script

```bash
npm run test:groq
```

**Expected:** All 4 test cases pass with ✅

### Test 4: Android Emulator

1. Start server: `cd server && npm run dev`
2. Run app in emulator
3. Take screenshot of payment app
4. Verify overlay appears
5. Check logcat for Groq logs

**Expected logs:**

```
🤖 Calling Groq server for AI parsing...
Connecting to: http://10.0.2.2:3000/api/ocr/parse
✅ Groq server response received
✅ Groq parsed - Amount: 500.0, Merchant: Zomato, Type: debit
```

### Test 5: Physical Device

1. Get your IP: `ipconfig` or `ifconfig`
2. Update `SERVER_URL` in `build.gradle`
3. Rebuild: `npm run build && npx cap sync android`
4. Run on device
5. Test screenshot

## 🔍 Verification Checklist

### Server

- [ ] Dependencies installed (`npm install`)
- [ ] API key in `.env`
- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] Test script passes

### Android

- [ ] Dependencies installed (`npm install`)
- [ ] Web assets built (`npm run build`)
- [ ] Capacitor synced (`npx cap sync android`)
- [ ] Gradle sync successful
- [ ] App builds without errors
- [ ] App runs on emulator/device

### Integration

- [ ] Server accessible from Android
- [ ] Screenshot triggers OCR
- [ ] Text sent to server
- [ ] Groq parses successfully
- [ ] Overlay shows correct data
- [ ] Expense saves to database

## 🐛 Common Build Issues

### Issue: "Cannot find symbol: SERVER_URL"

**Cause:** build.gradle not synced

**Fix:**

```bash
cd client
npx cap sync android
# In Android Studio: File → Sync Project with Gradle Files
```

### Issue: "groq-sdk not found"

**Cause:** Dependencies not installed

**Fix:**

```bash
cd server
npm install
```

### Issue: "Port 3000 already in use"

**Cause:** Another process using port 3000

**Fix:**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: Gradle sync fails

**Cause:** Android SDK issues

**Fix:**

1. Open Android Studio
2. File → Invalidate Caches → Invalidate and Restart
3. Tools → SDK Manager → Install missing components

### Issue: "Connection refused" on device

**Cause:** Wrong SERVER_URL

**Fix:**

1. Get your IP: `ipconfig` or `ifconfig`
2. Update `SERVER_URL` in `build.gradle`
3. Rebuild app

## 📊 Build Times

| Step              | Time  | Notes           |
| ----------------- | ----- | --------------- |
| Server install    | ~30s  | First time only |
| Client install    | ~2min | First time only |
| Web build         | ~30s  | Each time       |
| Capacitor sync    | ~10s  | Each time       |
| Gradle sync       | ~1min | First time      |
| Android build     | ~2min | First time      |
| Incremental build | ~30s  | After changes   |

**Total first build:** ~6 minutes
**Incremental builds:** ~1 minute

## 🎯 Test Scenarios

### Scenario 1: Google Pay Payment

```
Screenshot: "Paid ₹500 to Zomato"
Expected: amount=500, merchant="Zomato", type="debit"
```

### Scenario 2: PhonePe Transfer

```
Screenshot: "You sent ₹1,250 to Rahul Kumar"
Expected: amount=1250, merchant="Rahul Kumar", type="debit"
```

### Scenario 3: Paytm Refund

```
Screenshot: "Refund received ₹350 from Amazon Pay"
Expected: amount=350, merchant="Amazon Pay", type="credit"
```

### Scenario 4: Bank SMS

```
Screenshot: "Rs.2500 debited from A/c XX1234 at SWIGGY"
Expected: amount=2500, merchant="SWIGGY", type="debit"
```

### Scenario 5: Server Offline

```
Stop server
Take screenshot
Expected: Local fallback parser used, overlay still appears
```

## 📱 Device-Specific Setup

### Android Emulator (Default)

```gradle
buildConfigField "String", "SERVER_URL", "\"http://10.0.2.2:3000\""
```

- No changes needed
- Just start server and run

### Physical Device

```gradle
buildConfigField "String", "SERVER_URL", "\"http://YOUR_IP:3000\""
```

- Replace YOUR_IP with computer's IP
- Ensure same WiFi network
- Rebuild app

### Production

```gradle
buildConfigField "String", "SERVER_URL", "\"https://api.yourdomain.com\""
```

- Deploy server to cloud
- Use HTTPS
- Add authentication

## 🚀 Quick Commands Reference

### Server

```bash
# Install
cd server && npm install

# Start dev
npm run dev

# Test Groq
npm run test:groq

# Start production
npm start
```

### Client

```bash
# Install
cd client && npm install

# Build
npm run build

# Sync
npx cap sync android

# Open Android Studio
npx cap open android
```

### Combined

```bash
# Full rebuild
cd client && npm run build && npx cap sync android

# Start everything
cd server && npm run dev &
cd client && npx cap open android
```

## ✅ Success Indicators

### Server Running

```
✅ Server running on port 3000
✅ curl http://localhost:3000/health returns OK
✅ npm run test:groq passes all tests
```

### Android Built

```
✅ Gradle sync successful
✅ No build errors
✅ App installs on device/emulator
```

### Integration Working

```
✅ Screenshot triggers OCR
✅ Logs show "Groq parsed"
✅ Overlay appears with data
✅ Expense saves correctly
```

## 🎉 Final Checklist

- [ ] Groq API key added to `server/.env`
- [ ] Server starts: `cd server && npm run dev`
- [ ] Test passes: `npm run test:groq`
- [ ] Web built: `cd client && npm run build`
- [ ] Android synced: `npx cap sync android`
- [ ] App runs in Android Studio
- [ ] Screenshot test successful
- [ ] Logs show Groq parsing
- [ ] Overlay displays correctly
- [ ] Expense saves to database

## 🎯 Next Steps

### Immediate

1. ✅ Complete build
2. ✅ Test on emulator
3. ✅ Verify Groq parsing
4. ✅ Test expense saving

### Optional

- [ ] Test on physical device
- [ ] Try different payment apps
- [ ] Test offline fallback
- [ ] Monitor Groq usage

### Production

- [ ] Deploy server to cloud
- [ ] Update SERVER_URL
- [ ] Add authentication
- [ ] Enable HTTPS

---

**Status:** Ready to build and test!
**Time Required:** 5-10 minutes
**Difficulty:** Easy

**Next Action:** Run `cd server && npm run dev` and `npm run test:groq`!

🚀 **Let's build it!**
