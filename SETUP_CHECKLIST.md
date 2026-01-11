# ✅ Gemini OCR Setup Checklist

## Prerequisites

- [ ] Node.js installed
- [ ] Android Studio installed
- [ ] Google account (for API key)

## Setup Steps

### 1️⃣ Get Gemini API Key

- [ ] Visit https://aistudio.google.com/app/apikey
- [ ] Sign in with Google account
- [ ] Click "Create API Key"
- [ ] Copy the API key

### 2️⃣ Configure Server

- [ ] Open `server/.env`
- [ ] Replace `your_gemini_api_key_here` with your actual key
- [ ] Save the file

### 3️⃣ Install Dependencies

```bash
cd server
npm install
```

- [ ] Dependencies installed successfully

### 4️⃣ Start Server

```bash
cd server
npm run dev
```

- [ ] Server running on port 3000
- [ ] No errors in console

### 5️⃣ Test Server (Optional but Recommended)

```bash
# In a new terminal
node test-gemini-ocr.js
```

- [ ] All tests pass with ✅
- [ ] Amounts parsed correctly
- [ ] Merchants identified

### 6️⃣ Configure Android (Physical Device Only)

**Skip this if using emulator**

- [ ] Find your computer's IP address
  ```bash
  ipconfig  # Windows
  ifconfig  # Mac/Linux
  ```
- [ ] Open `client/android/app/build.gradle`
- [ ] Update line with `buildConfigField "String", "SERVER_URL"`
- [ ] Replace `http://10.0.2.2:3000` with `http://YOUR_IP:3000`
- [ ] Ensure phone and computer on same WiFi

### 7️⃣ Build Android App

```bash
cd client
npm run build
npx cap sync android
```

- [ ] Build completed successfully
- [ ] No errors

### 8️⃣ Run in Android Studio

- [ ] Open `client/android` in Android Studio
- [ ] Wait for Gradle sync
- [ ] Click Run (green play button)
- [ ] App launches successfully

### 9️⃣ Test OCR Feature

- [ ] Open a payment app (Google Pay, PhonePe, etc.)
- [ ] Make a test payment or view transaction
- [ ] Take a screenshot
- [ ] Overlay popup appears with parsed amount
- [ ] Amount is correct
- [ ] Merchant name is correct

### 🔟 Verify Logs (Optional)

In Android Studio Logcat, filter by "OCRProcessor":

- [ ] See "OCR extracted text: ..."
- [ ] See "✅ Gemini parsing successful"
- [ ] See "Gemini parsed - Amount: X, Merchant: Y"

## Troubleshooting

### Server Issues

| Problem                    | Solution                                           |
| -------------------------- | -------------------------------------------------- |
| "GEMINI_API_KEY not found" | Add key to `server/.env` and restart               |
| Port 3000 already in use   | Change PORT in `server/.env` or stop other service |
| Module not found           | Run `npm install` in server directory              |

### Android Issues

| Problem                   | Solution                                     |
| ------------------------- | -------------------------------------------- |
| "Connection refused"      | Check server is running, verify SERVER_URL   |
| Always using local parser | Check server logs, verify API key            |
| Build errors              | Run `npx cap sync android` again             |
| Overlay not showing       | Grant overlay permission in Android settings |

### Testing Issues

| Problem                | Solution                                 |
| ---------------------- | ---------------------------------------- |
| Test script fails      | Ensure server is running first           |
| "fetch is not defined" | Use Node.js 18+ or install node-fetch    |
| Timeout errors         | Check firewall, ensure server accessible |

## Quick Commands Reference

```bash
# Start server
cd server && npm run dev

# Test Gemini endpoint
node test-gemini-ocr.js

# Build Android app
cd client && npm run build && npx cap sync android

# View server logs
cd server && npm run dev

# Install server dependencies
cd server && npm install

# Install client dependencies
cd client && npm install
```

## Success Indicators

✅ Server starts without errors
✅ Test script shows parsed amounts
✅ Android app builds successfully
✅ Screenshot triggers overlay popup
✅ Amounts are parsed correctly
✅ Logs show "Gemini parsing successful"

## Next Steps After Setup

1. **Test with real payment apps**: Google Pay, PhonePe, Paytm
2. **Try different screenshot types**: Success screens, SMS, receipts
3. **Check accuracy**: Compare parsed vs actual amounts
4. **Monitor logs**: Watch for fallback to local parser
5. **Optimize**: Adjust confidence thresholds if needed

## Support Resources

- **Full Setup Guide**: `GEMINI_OCR_SETUP.md`
- **Quick Start**: `GEMINI_QUICK_START.md`
- **Implementation Details**: `GEMINI_INTEGRATION_SUMMARY.md`
- **Test Script**: `test-gemini-ocr.js`

---

**Estimated Setup Time**: 10-15 minutes
**Difficulty**: Easy
**Prerequisites**: Basic command line knowledge

🎉 **Ready to go!** Follow the checklist and you'll be up and running in no time.
