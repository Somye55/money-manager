# 🚀 Quick Start: Android + Groq

> Get your Android app working with Groq AI in 3 steps

## ⚡ Super Quick Setup

### Step 1: Start Server (30 seconds)

```bash
# Double-click this file:
start-server-and-test.bat

# OR manually:
cd server
npm run dev
```

### Step 2: Test Server (30 seconds)

```bash
# Double-click this file:
test-server-connection.bat

# Should see JSON responses
```

### Step 3: Run Android App (1 minute)

```bash
# In Android Studio, click Run ▶️
# Share a screenshot from Google Pay
# Check it works!
```

## 📱 Device-Specific Setup

### For Emulator (Default) ✅

**No changes needed!** Just:

1. Start server
2. Run app
3. Test

### For Physical Device 📱

1. Get your IP: `ipconfig`
2. Edit `client/android/app/build.gradle` line 20:
   ```gradle
   buildConfigField "String", "SERVER_URL", "\"http://YOUR_IP:3000\""
   ```
3. Rebuild: `cd client && npm run build && npx cap sync android`
4. Ensure same WiFi

## 🐛 Not Working?

### "Connection timeout"

- ✅ Start server: `cd server && npm run dev`
- ✅ Test: `curl http://localhost:3000/health`
- ✅ Check firewall allows port 3000

### Physical device can't connect

- ✅ Get IP: `ipconfig`
- ✅ Update `build.gradle` with your IP
- ✅ Rebuild app
- ✅ Same WiFi network

## 📚 Full Documentation

- **[ANDROID_GROQ_SETUP.md](ANDROID_GROQ_SETUP.md)** - Complete guide
- **[BUILD_AND_TEST_GROQ.md](BUILD_AND_TEST_GROQ.md)** - Build instructions
- **[CONFIGURE_SERVER_URL.md](CONFIGURE_SERVER_URL.md)** - URL configuration

## ✅ Success Check

You'll see in Android logs:

```
🤖 Calling Groq server for AI parsing...
✅ Groq server response received
✅ Groq parsed - Amount: 500.0, Merchant: Zomato, Type: debit
```

---

**Current Issue:** Server not running or not reachable
**Solution:** Run `start-server-and-test.bat`

🚀 **Let's go!**
