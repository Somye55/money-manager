# 🔧 Configure Server URL for Android

> Setup guide for connecting Android app to Groq server

## 📱 Default Configuration

The app is configured for **Android Emulator** by default:

```gradle
buildConfigField "String", "SERVER_URL", "\"http://10.0.2.2:3000\""
```

**Note:** `10.0.2.2` is the special IP that emulators use to access `localhost` on your computer.

## 🎯 Configuration Options

### Option 1: Android Emulator (Default) ✅

**No changes needed!** Just start the server and run the app.

```bash
# Terminal 1: Start server
cd server
npm run dev

# Terminal 2: Build and run
cd client
npm run build
npx cap sync android
# Open in Android Studio and run on emulator
```

### Option 2: Physical Device 📱

If testing on a real phone, you need to use your computer's IP address.

#### Step 1: Find Your Computer's IP

**Windows:**

```bash
ipconfig
# Look for "IPv4 Address" under your WiFi adapter
# Example: 192.168.1.100
```

**Mac/Linux:**

```bash
ifconfig
# Look for "inet" under en0 (WiFi)
# Example: 192.168.1.100
```

#### Step 2: Update build.gradle

Open `client/android/app/build.gradle` and change:

```gradle
// FROM (emulator):
buildConfigField "String", "SERVER_URL", "\"http://10.0.2.2:3000\""

// TO (physical device):
buildConfigField "String", "SERVER_URL", "\"http://192.168.1.100:3000\""
//                                              ^^^^^^^^^^^^^^
//                                              Your computer's IP
```

#### Step 3: Rebuild App

```bash
cd client
npm run build
npx cap sync android
# Open in Android Studio and run on device
```

#### Step 4: Ensure Same Network

- ✅ Computer and phone on same WiFi
- ✅ Firewall allows port 3000
- ✅ Server is running

### Option 3: Production Server 🌐

When deploying to production:

```gradle
buildConfigField "String", "SERVER_URL", "\"https://your-domain.com\""
```

**Important:** Use HTTPS in production!

## 🧪 Testing Connection

### Test 1: Server Running

```bash
cd server
npm run dev

# Should see:
# Server running on port 3000
```

### Test 2: Server Accessible

**From computer:**

```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}
```

**From phone (if using physical device):**

```bash
# Open browser on phone and visit:
http://YOUR_IP:3000/health
# Should show: {"status":"ok",...}
```

### Test 3: Android Logs

Run the app and take a screenshot. Check logcat:

**Success:**

```
🤖 Calling Groq server for AI parsing...
Connecting to: http://10.0.2.2:3000/api/ocr/parse
Request sent, waiting for Groq response...
Response code: 200
✅ Groq server response received
✅ Groq parsed - Amount: 500.0, Merchant: Zomato, Type: debit
```

**Connection Failed:**

```
❌ Server call failed: ConnectException: Failed to connect to /10.0.2.2:3000
Falling back to local parsing...
🔧 Using local fallback parser
```

## 🐛 Troubleshooting

### Issue: "Connection refused"

**Cause:** Server not running or wrong URL

**Fix:**

1. Start server: `cd server && npm run dev`
2. Verify URL in build.gradle
3. Rebuild app

### Issue: "Timeout"

**Cause:** Firewall blocking or wrong network

**Fix:**

1. Check firewall allows port 3000
2. Ensure same WiFi network
3. Try disabling firewall temporarily

### Issue: Always using fallback

**Cause:** Can't reach server

**Fix:**

1. Test server health endpoint
2. Check Android logs for connection error
3. Verify IP address is correct

### Issue: Works on emulator, not on device

**Cause:** Using emulator IP (10.0.2.2) on physical device

**Fix:**

1. Get your computer's IP
2. Update SERVER_URL in build.gradle
3. Rebuild app

## 📊 Configuration Matrix

| Environment           | SERVER_URL                | Notes                |
| --------------------- | ------------------------- | -------------------- |
| Emulator (Dev)        | `http://10.0.2.2:3000`    | Default ✅           |
| Physical Device (Dev) | `http://YOUR_IP:3000`     | Same WiFi            |
| Production            | `https://your-domain.com` | Use HTTPS            |
| Local Testing         | `http://localhost:3000`   | Won't work on device |

## 🔐 Security Notes

### Development

- ✅ HTTP is fine for local testing
- ✅ No authentication needed
- ⚠️ Don't expose to internet

### Production

- ✅ Use HTTPS (SSL certificate)
- ✅ Add authentication (JWT)
- ✅ Implement rate limiting
- ✅ Use environment variables

## 🚀 Quick Commands

### For Emulator

```bash
# No changes needed, just run:
cd server && npm run dev
cd client && npm run build && npx cap sync android
```

### For Physical Device

```bash
# 1. Get IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# 2. Update build.gradle with your IP

# 3. Rebuild
cd client && npm run build && npx cap sync android

# 4. Start server
cd server && npm run dev
```

## 📝 Example Configurations

### Development (Emulator)

```gradle
defaultConfig {
    // ...
    buildConfigField "String", "SERVER_URL", "\"http://10.0.2.2:3000\""
}
```

### Development (Physical Device)

```gradle
defaultConfig {
    // ...
    buildConfigField "String", "SERVER_URL", "\"http://192.168.1.100:3000\""
}
```

### Production

```gradle
defaultConfig {
    // ...
    buildConfigField "String", "SERVER_URL", "\"https://api.moneymanager.com\""
}
```

### Multiple Environments

```gradle
buildTypes {
    debug {
        buildConfigField "String", "SERVER_URL", "\"http://10.0.2.2:3000\""
    }
    release {
        buildConfigField "String", "SERVER_URL", "\"https://api.moneymanager.com\""
    }
}
```

## ✅ Verification Checklist

- [ ] Server running on port 3000
- [ ] SERVER_URL configured in build.gradle
- [ ] App rebuilt after changing URL
- [ ] Same WiFi network (physical device)
- [ ] Firewall allows port 3000
- [ ] Health endpoint accessible
- [ ] Android logs show successful connection

## 🎯 Summary

**For Emulator:** No changes needed! ✅

**For Physical Device:**

1. Get your IP: `ipconfig` or `ifconfig`
2. Update `SERVER_URL` in `build.gradle`
3. Rebuild: `npm run build && npx cap sync android`
4. Ensure same WiFi

**For Production:**

1. Deploy server to cloud
2. Update `SERVER_URL` to production domain
3. Use HTTPS
4. Add authentication

---

**Current Configuration:** Emulator (Default)
**Next Step:** Start server and test!

🚀 **Ready to go!**
