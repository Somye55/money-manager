# 📱 Android + Groq Setup Guide

> Complete guide to get Groq AI working on your Android device

## 🎯 Current Issue

Your Android app is timing out when connecting to the Groq server:

```
❌ Connection timeout: Server took too long to respond
🔧 Using local fallback parser
```

## ✅ Solution Steps

### Step 1: Start the Server (2 minutes)

**Option A: Using the batch file (Easiest)**

```bash
# Double-click this file:
start-server-and-test.bat
```

**Option B: Manual start**

```bash
cd server
npm run dev
```

You should see:

```
Server running on port 3000
```

### Step 2: Test Server is Working (30 seconds)

**Option A: Using the test script**

```bash
# Double-click this file:
test-server-connection.bat
```

**Option B: Manual test**

```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}

curl -X POST http://localhost:3000/api/ocr/parse ^
  -H "Content-Type: application/json" ^
  -d "{\"text\":\"Paid Rs.500 to Zomato\"}"
# Should return: {"success":true,"data":{...}}
```

### Step 3: Configure for Your Device

#### For Android Emulator (Default) ✅

No changes needed! The app is already configured:

```gradle
buildConfigField "String", "SERVER_URL", "\"http://10.0.2.2:3000\""
```

Just make sure:

1. Server is running: `cd server && npm run dev`
2. Emulator is running
3. Test the app

#### For Physical Android Device 📱

You need to use your computer's IP address.

**Step 3a: Find Your IP Address**

```bash
# Run this command:
ipconfig

# Look for "IPv4 Address" under your WiFi adapter
# Example: 192.168.1.100
```

**Step 3b: Update build.gradle**

Open `client/android/app/build.gradle` and change line 20:

```gradle
// FROM (emulator):
buildConfigField "String", "SERVER_URL", "\"http://10.0.2.2:3000\""

// TO (your IP):
buildConfigField "String", "SERVER_URL", "\"http://192.168.1.100:3000\""
//                                              ^^^^^^^^^^^^^^
//                                              Replace with YOUR IP
```

**Step 3c: Rebuild the App**

```bash
cd client
npm run build
npx cap sync android
```

**Step 3d: Ensure Same Network**

- ✅ Computer and phone on same WiFi
- ✅ Firewall allows port 3000
- ✅ Server is running

### Step 4: Test on Android

1. **Start server**: `cd server && npm run dev`
2. **Run app** in Android Studio
3. **Share a screenshot** from Google Pay or any payment app
4. **Check logs** for:
   ```
   🤖 Calling Groq server for AI parsing...
   Connecting to: http://10.0.2.2:3000/api/ocr/parse
   ✅ Groq server response received
   ✅ Groq parsed - Amount: 500.0, Merchant: Zomato, Type: debit
   ```

## 🐛 Troubleshooting

### Issue: "Connection timeout"

**Symptoms:**

```
❌ Connection timeout: Server took too long to respond
🔧 Using local fallback parser
```

**Causes & Fixes:**

1. **Server not running**

   ```bash
   # Start it:
   cd server
   npm run dev
   ```

2. **Wrong URL for physical device**

   - Get your IP: `ipconfig`
   - Update `build.gradle` with your IP
   - Rebuild: `cd client && npm run build && npx cap sync android`

3. **Firewall blocking**

   ```bash
   # Windows: Allow port 3000
   # Or temporarily disable firewall for testing
   ```

4. **Different WiFi networks**
   - Ensure phone and computer on same WiFi

### Issue: "Groq API not configured"

**Fix:**

```bash
# Check server/.env has:
GROQ_API_KEY=gsk_your_key_here

# Restart server
cd server
npm run dev
```

### Issue: Server starts but app still times out

**Debug steps:**

1. **Test server from computer:**

   ```bash
   curl http://localhost:3000/health
   ```

2. **Test from phone browser:**

   - Open browser on phone
   - Visit: `http://YOUR_IP:3000/health`
   - Should show: `{"status":"ok",...}`

3. **Check Android logs:**
   ```
   Look for: "Connecting to: http://..."
   ```

## 📊 Expected Flow

### Successful Connection:

```
1. User shares screenshot
2. ML Kit extracts text (500ms)
3. Android sends to server
4. Server calls Groq API (300-500ms)
5. Server returns parsed data
6. Overlay shows result
```

### Failed Connection (Fallback):

```
1. User shares screenshot
2. ML Kit extracts text (500ms)
3. Android tries server (timeout after 10s)
4. Falls back to local parser
5. Overlay shows result (less accurate)
```

## 🎯 Quick Checklist

- [ ] Server running: `cd server && npm run dev`
- [ ] Server accessible: `curl http://localhost:3000/health`
- [ ] Groq API key in `server/.env`
- [ ] Correct SERVER_URL in `build.gradle`
- [ ] App rebuilt after URL change
- [ ] Same WiFi network (physical device)
- [ ] Firewall allows port 3000

## 💡 Pro Tips

### Tip 1: Keep Server Running

Leave the server running in a terminal while testing:

```bash
cd server
npm run dev
# Leave this terminal open
```

### Tip 2: Test Server First

Before testing on Android, verify server works:

```bash
npm run test:groq
```

### Tip 3: Check Logs

Android Studio logcat shows connection attempts:

```
Filter: "OCRProcessor"
Look for: "Connecting to:" and "Groq parsed"
```

### Tip 4: Use Emulator for Development

Emulator is easier - no IP configuration needed!

## 🚀 Quick Start Commands

### For Emulator:

```bash
# Terminal 1: Start server
cd server
npm run dev

# Terminal 2: Build and run
cd client
npm run build
npx cap sync android
# Open in Android Studio and run
```

### For Physical Device:

```bash
# 1. Get your IP
ipconfig

# 2. Update build.gradle with your IP

# 3. Start server
cd server
npm run dev

# 4. Build and run
cd client
npm run build
npx cap sync android
# Open in Android Studio and run
```

## 📝 Configuration Files

### server/.env

```env
GROQ_API_KEY=gsk_your_key_here
PORT=3000
```

### client/android/app/build.gradle

```gradle
// For emulator:
buildConfigField "String", "SERVER_URL", "\"http://10.0.2.2:3000\""

// For physical device:
buildConfigField "String", "SERVER_URL", "\"http://YOUR_IP:3000\""
```

## ✅ Success Indicators

You'll know it's working when you see:

1. **Server logs:**

   ```
   ✅ Groq parsed expense: { amount: 500, merchant: 'Zomato', type: 'debit' }
   ```

2. **Android logs:**

   ```
   🤖 Calling Groq server for AI parsing...
   ✅ Groq server response received
   ✅ Groq parsed - Amount: 500.0, Merchant: Zomato, Type: debit
   ```

3. **App behavior:**
   - Overlay appears quickly (< 2 seconds)
   - Accurate amount and merchant
   - No "fallback parser" messages

## 🎉 Summary

**Current Status:** Server configured, app ready
**What You Need:** Start server and test

**For Emulator:**

1. `cd server && npm run dev`
2. Run app in Android Studio
3. Share screenshot

**For Physical Device:**

1. Get IP: `ipconfig`
2. Update `build.gradle`
3. Rebuild app
4. Start server
5. Test

---

**Next Action:** Run `start-server-and-test.bat` and test the app!

🚀 **Ready to go!**
