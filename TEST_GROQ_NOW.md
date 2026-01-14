# 🧪 Test Groq OCR - Step by Step

## ✅ Pre-Flight Checklist

- [ ] Server is running (check terminal for "Server running on port 3000")
- [ ] Firewall configured (ran `setup-firewall-port-3000.bat` as admin)
- [ ] App installed (ran `install-app.bat`)
- [ ] Phone and computer on same WiFi

## 🧪 Test 1: Server Health Check

**On your phone's browser:**

1. Open: `http://10.5.48.113:3000/health`
2. Expected: `{"status":"ok","timestamp":"2026-01-14T..."}`

❌ **If it fails:**

- Check firewall is configured
- Verify both devices on same WiFi
- Run `node get-ip.js` to confirm IP hasn't changed

## 🧪 Test 2: Share Screenshot

1. Open Google Pay on your phone
2. Find a payment transaction
3. Take a screenshot OR use the share button
4. Share to "Money Manager"
5. Wait 2-3 seconds

**Expected Result:**

- App opens to Quick Save page
- Amount field shows: `1.0` (from your test screenshot)
- Merchant field shows: `Nisha Sharma`

## 🧪 Test 3: Check Logs

**Look for these in the Android logs:**

```
OCRProcessor: 🤖 Calling Groq server for AI parsing...
OCRProcessor: Connecting to: http://10.5.48.113:3000/api/ocr/parse
OCRProcessor: ✅ Groq AI parsed successfully
```

**Server logs should show:**

```
POST /api/ocr/parse
Groq API response received
```

## ✅ Success Indicators

- ✅ No "Connection timeout" errors
- ✅ No "Cleartext HTTP traffic not permitted" errors
- ✅ Amount and merchant extracted correctly
- ✅ Quick Save page opens with pre-filled data

## ❌ Troubleshooting

### "Connection timeout"

- Server not running → `cd server && npm run dev`
- Firewall blocking → Run `setup-firewall-port-3000.bat` as admin

### "Cleartext HTTP traffic not permitted"

- App not updated → Run `install-app.bat` again
- Wrong APK installed → Check you installed the latest from `client/android/app/build/outputs/apk/debug/`

### "Cannot connect to server"

- Different WiFi networks → Connect both to same network
- IP changed → Run `node get-ip.js` and update configs

### Amount/Merchant wrong

- Groq parsed but incorrectly → Check server logs for Groq response
- Using fallback parser → Server didn't respond in time

## 📊 What Should Happen

### With Groq (Working):

```
1. Share screenshot
2. ML Kit extracts text (1-2 seconds)
3. Text sent to Groq server (1-2 seconds)
4. Groq parses amount/merchant
5. Quick Save opens with data
```

### Without Groq (Fallback):

```
1. Share screenshot
2. ML Kit extracts text
3. Server timeout (10 seconds)
4. Local parser extracts amount/merchant
5. Quick Save opens with data
```

The Groq version is faster and more accurate!

## 🎉 When It Works

You'll see the Quick Save page open instantly with:

- **Amount:** Correctly extracted (e.g., 1.0)
- **Merchant:** Correctly extracted (e.g., "Nisha Sharma")
- **Date:** Today's date

Just select a category and save! 🚀
