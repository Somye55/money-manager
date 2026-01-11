# Overlay Permission & Server Issues

## Issues Found in Logs

### 1. Overlay Permission Denied ❌

```
E OverlayService: !!! Cannot draw overlays - permission denied !!!
```

**Solution**: Grant overlay permission manually

**Steps**:

1. Open Android Settings
2. Go to Apps → Money Manager
3. Go to "Special app access" or "Display over other apps"
4. Enable "Allow display over other apps"

OR use this ADB command:

```bash
adb shell appops set com.moneymanager.app SYSTEM_ALERT_WINDOW allow
```

### 2. Gemini API Not Responding ❌

```
D OCRProcessor: Connecting to: http://10.0.2.2:3000/api/ocr/parse
(no response logs after this)
```

**This means**:

- Server is not running, OR
- Server is not responding, OR
- Request is timing out

**Solution**: Check server status

## Quick Fix Steps

### Step 1: Check Server

```bash
# Is server running?
curl http://localhost:3000/health

# Expected: {"status":"ok","timestamp":"..."}
```

If not running:

```bash
cd server
npm run dev
```

### Step 2: Test Gemini Endpoint

```bash
curl -X POST http://localhost:3000/api/ocr/parse \
  -H "Content-Type: application/json" \
  -d '{"text": "Paid ₹500 to Zomato"}'
```

**Expected response**:

```json
{
  "success": true,
  "data": {
    "amount": 500,
    "merchant": "Zomato",
    "type": "debit",
    "confidence": 90
  }
}
```

**If you get error**:

- Check `GEMINI_API_KEY` is in `server/.env`
- Check server logs for errors

### Step 3: Grant Overlay Permission

**Method 1: Via App**

1. Open Money Manager app
2. Go to Settings
3. Look for "Enable Overlay" or similar
4. Tap to open Android settings
5. Enable permission

**Method 2: Via Android Settings**

1. Settings → Apps → Money Manager
2. Special app access → Display over other apps
3. Enable

**Method 3: Via ADB**

```bash
adb shell appops set com.moneymanager.app SYSTEM_ALERT_WINDOW allow
```

### Step 4: Test Again

1. Make sure server is running
2. Share screenshot to app
3. Check logs

## Expected Logs (Success)

```
D OCRProcessor: 🤖 Attempting Gemini API call...
D OCRProcessor: Server URL: http://10.0.2.2:3000
D OCRProcessor: Connecting to: http://10.0.2.2:3000/api/ocr/parse
D OCRProcessor: Request sent, waiting for response...
D OCRProcessor: Response code: 200
D OCRProcessor: Response received: {"success":true,"data":{...}}
D OCRProcessor: ✅ Gemini parsed - Amount: 340.39, Merchant: Nisha Sharma
D MainActivity: ✅ OCR Success - Amount: 340.39, Merchant: Nisha Sharma
D OverlayService: === showOverlay called ===
D OverlayService: >>> OVERLAY VIEW ADDED SUCCESSFULLY <<<
```

## Troubleshooting

### Server Not Responding

**Check 1**: Is server running?

```bash
# Should show node process
ps aux | grep node
```

**Check 2**: Is port 3000 open?

```bash
# Windows
netstat -an | findstr 3000

# Mac/Linux
lsof -i :3000
```

**Check 3**: Check server logs
Look for errors in the terminal where you ran `npm run dev`

### Overlay Still Not Showing

**Check 1**: Permission granted?

```bash
adb shell appops get com.moneymanager.app SYSTEM_ALERT_WINDOW
# Should show: SYSTEM_ALERT_WINDOW: allow
```

**Check 2**: Check logs

```
# Should NOT see this:
E OverlayService: !!! Cannot draw overlays - permission denied !!!

# Should see this:
D OverlayService: >>> OVERLAY VIEW ADDED SUCCESSFULLY <<<
```

## Summary

1. ✅ Start server: `cd server && npm run dev`
2. ✅ Test endpoint: `curl http://localhost:3000/api/ocr/parse ...`
3. ✅ Grant overlay permission (Settings or ADB)
4. ✅ Test with screenshot

---

**Status**: Waiting for fixes
**Next**: Apply fixes above and test again
