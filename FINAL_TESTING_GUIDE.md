# 🧪 Final Testing Guide - Gemini OCR Integration

## ✅ All Issues Fixed

1. ✅ Removed local parsing - uses Gemini only
2. ✅ App doesn't open when image shared - only overlay shows
3. ✅ Loading state while processing
4. ✅ HTTP cleartext traffic allowed for localhost
5. ✅ Category selection in overlay

## 🚀 Setup Steps

### 1. Start Server (Terminal 1)

```bash
cd server

# Make sure GEMINI_API_KEY is in .env
# GEMINI_API_KEY=your_actual_key_here

npm run dev
```

**Expected output:**

```
Server running on port 3000
```

### 2. Rebuild Android App (Terminal 2)

```bash
cd client
npm run build
npx cap sync android
```

### 3. Run in Android Studio

1. Open `client/android` in Android Studio
2. Wait for Gradle sync
3. Click Run (green play button)
4. App should launch on emulator/device

## 🧪 Test Scenario

### Test 1: Share Screenshot to App

1. **Take/download a payment screenshot** (Google Pay, PhonePe, etc.)
2. **Share it to Money Manager app**
3. **Observe behavior:**

**Expected:**

- ✅ Loading overlay appears immediately
- ✅ Shows "Processing..." and "Analyzing screenshot"
- ✅ App does NOT open (stays in background)
- ✅ After 1-2 seconds, overlay updates with:
  - Parsed amount (e.g., ₹340.39)
  - Merchant name
  - Category dropdown
  - Save and Dismiss buttons
- ✅ Select category and tap Save
- ✅ Overlay closes
- ✅ Expense saved to database

### Test 2: Check Logs

**Filter by**: `OCRProcessor`

**Expected logs:**

```
D OCRProcessor: OCR extracted text: To Nisha Sharma+9197581 340391...
D OCRProcessor: 🤖 Attempting Gemini API call...
D OCRProcessor: Server URL: http://10.0.2.2:3000
D OCRProcessor: Connecting to: http://10.0.2.2:3000/api/ocr/parse
D OCRProcessor: Request sent, waiting for response...
D OCRProcessor: Response code: 200
D OCRProcessor: Response received: {"success":true,"data":{...}}
D OCRProcessor: ✅ Gemini parsed - Amount: 340.39, Merchant: Nisha Sharma, Confidence: 90
D MainActivity: ✅ OCR Success - Amount: 340.39, Merchant: Nisha Sharma
```

## 🐛 Troubleshooting

### Issue 1: "Cleartext HTTP traffic not permitted"

**Logs:**

```
❌ Gemini API call failed: IOException: Cleartext HTTP traffic to 10.0.2.2 not permitted
```

**Solution:**
This should be fixed now. If you still see it:

1. Make sure you rebuilt the app after adding network_security_config.xml
2. Clean and rebuild: `Build > Clean Project` then `Build > Rebuild Project`
3. Uninstall old app from device/emulator and reinstall

### Issue 2: "Connection refused"

**Logs:**

```
❌ Connection failed: Cannot connect to server at http://10.0.2.2:3000
```

**Solution:**

1. Check server is running: `npm run server:dev`
2. Check server logs for errors
3. For physical device, update SERVER_URL in build.gradle with your computer's IP

### Issue 3: "Service unavailable"

**Logs:**

```
Response code: 503
Server error 503: {"error":"Service unavailable","message":"Gemini API not configured"}
```

**Solution:**

1. Add GEMINI_API_KEY to `server/.env`
2. Restart server
3. Get API key from: https://aistudio.google.com/app/apikey

### Issue 4: Wrong amount parsed

**Example:** Shows 34039 instead of 340.39

**This means:**

- Gemini API failed (check logs for why)
- Since we removed local fallback, it should show error
- Fix the Gemini API issue first

### Issue 5: App opens instead of just overlay

**Solution:**

- Make sure you rebuilt the app with latest MainActivity changes
- Check logs for "Overlay service started with loading state"
- MainActivity should call `finish()` after starting overlay

## ✅ Success Criteria

- [ ] Server starts without errors
- [ ] Android app builds successfully
- [ ] Sharing screenshot shows loading overlay immediately
- [ ] App does NOT open (stays in background)
- [ ] Logs show "🤖 Attempting Gemini API call..."
- [ ] Logs show "Response code: 200"
- [ ] Logs show "✅ Gemini parsed - Amount: X"
- [ ] Overlay shows correct amount (not phone number)
- [ ] Can select category from dropdown
- [ ] Tapping Save closes overlay and saves expense
- [ ] Expense appears in app dashboard

## 📊 Test Cases

### Test Case 1: Google Pay Screenshot

**Text:** "To Nisha Sharma+9197581 340391Pay again"
**Expected:** Amount: 340.39, Merchant: Nisha Sharma

### Test Case 2: PhonePe Screenshot

**Text:** "Paid ₹500 to Zomato"
**Expected:** Amount: 500, Merchant: Zomato

### Test Case 3: Bank SMS Screenshot

**Text:** "Debited Rs.1,250.50 from A/c XX1234"
**Expected:** Amount: 1250.50, Merchant: (from context)

### Test Case 4: Error Handling

**Action:** Stop server, share screenshot
**Expected:** Error overlay shows "Cannot connect to server"

## 🎯 Performance Expectations

| Step                 | Expected Time      |
| -------------------- | ------------------ |
| Show loading overlay | Immediate (<100ms) |
| ML Kit OCR           | ~500ms             |
| Gemini API call      | ~1-2s              |
| Total                | ~1.5-2.5s          |

## 📝 Files Changed

1. ✅ `OCRProcessor.java` - Removed local parsing, uses Gemini only
2. ✅ `MainActivity.java` - Added loading/error overlays, calls finish()
3. ✅ `AndroidManifest.xml` - Added network security config
4. ✅ `network_security_config.xml` - Allows HTTP for localhost

## 🔄 Quick Reset

If something goes wrong:

```bash
# 1. Stop server
Ctrl+C

# 2. Clean Android build
cd client/android
./gradlew clean

# 3. Rebuild everything
cd ../..
cd client
npm run build
npx cap sync android

# 4. Restart server
cd ../server
npm run dev

# 5. Run app in Android Studio
```

## 📞 Support

If issues persist:

1. Check all logs in Android Studio (filter by "OCRProcessor", "MainActivity", "OverlayService")
2. Verify server is running and responding: `curl http://localhost:3000/health`
3. Test Gemini endpoint: `npm run test:gemini`
4. Check GEMINI_API_KEY is valid

---

**Status**: ✅ Ready for testing
**Last Updated**: January 2025
**All fixes applied**: Yes

**Next Step**: Follow the test scenario above! 🚀
