# Testing Guide - Gemini OCR Integration

## Issues Fixed

### 1. Wrong Amount Parsing (34039 instead of 340.39)

**Problem**: Phone numbers in OCR text were being parsed as amounts
**Solution**: Improved regex patterns with better filtering:

- Skip 10-digit numbers (phone numbers)
- Skip numbers after "+" sign (phone numbers)
- Prioritize amounts with currency symbols (₹, Rs, INR)
- Prioritize decimal amounts (340.39)
- Skip very long numbers (transaction IDs)

### 2. Gemini AI Not Working

**Problem**: No logs showing Gemini API calls
**Solution**: Added detailed logging to diagnose:

- Connection attempts
- Server URL
- Response codes
- Error messages

## Testing Steps

### Step 1: Start the Server

```bash
cd server
npm run dev
```

**Expected output:**

```
Server running on port 3000
```

### Step 2: Test Server Endpoint

```bash
# Test with the actual OCR text from your screenshot
curl -X POST http://localhost:3000/api/ocr/parse \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"To Nisha Sharma+9197581 340391Pay againCompleted8 Jan 2026, 11:46 pm116896766920BBank of Baroda 2247UPI transaction IDTo: NISHA SHARMAGoogle Pay ns9758134039@oksbiFrom: SOMYE VERMA (Bank of Baroda)\"}"
```

**Expected response:**

```json
{
  "success": true,
  "data": {
    "amount": 340.39,
    "merchant": "Nisha Sharma",
    "type": "debit",
    "confidence": 90
  }
}
```

### Step 3: Rebuild Android App

```bash
cd client
npm run build
npx cap sync android
```

### Step 4: Test in Android

1. Open Android Studio
2. Run the app
3. Share a payment screenshot to the app
4. Check Logcat (filter by "OCRProcessor")

**Expected logs:**

```
OCR extracted text: To Nisha Sharma+9197581 340391...
🤖 Attempting Gemini API call...
Server URL: http://10.0.2.2:3000
Connecting to: http://10.0.2.2:3000/api/ocr/parse
Request sent, waiting for response...
Response code: 200
Response received: {"success":true,"data":{...}}
✅ Gemini parsed - Amount: 340.39, Merchant: Nisha Sharma, Confidence: 90
```

## Troubleshooting

### Issue: "Cannot connect to server"

**Logs:**

```
❌ Connection failed: Cannot connect to server at http://10.0.2.2:3000
Make sure server is running: npm run server:dev
```

**Solutions:**

1. Check server is running: `npm run server:dev`
2. For physical device, update SERVER_URL in `build.gradle`:
   ```gradle
   buildConfigField "String", "SERVER_URL", "\"http://YOUR_IP:3000\""
   ```
3. Check firewall isn't blocking port 3000

### Issue: "Server error: 503"

**Logs:**

```
Response code: 503
Server error 503: {"error":"Service unavailable","message":"Gemini API not configured"}
```

**Solution:**
Add GEMINI_API_KEY to `server/.env`:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### Issue: Still parsing wrong amount

**Logs:**

```
Amount parsed: 34039.0 using pattern: \b([1-9][0-9]{0,5})\b
```

**This means:**

- Gemini API failed (check logs above for why)
- Fell back to local parser
- Local parser needs the improved regex (rebuild app)

**Solution:**

1. Fix Gemini API issue first
2. Rebuild Android app with new code
3. Test again

### Issue: "Connection timeout"

**Logs:**

```
❌ Connection timeout: Server took too long to respond
```

**Solutions:**

1. Check server logs for errors
2. Verify GEMINI_API_KEY is valid
3. Check internet connection
4. Gemini API might be slow - wait and retry

## Verification Checklist

- [ ] Server starts without errors
- [ ] Test endpoint returns correct amount (340.39, not 34039)
- [ ] Android app rebuilt with new code
- [ ] Logcat shows "🤖 Attempting Gemini API call..."
- [ ] Logcat shows "Response code: 200"
- [ ] Logcat shows "✅ Gemini parsed - Amount: 340.39"
- [ ] Overlay shows correct amount

## Expected Behavior

### With Gemini Working:

```
Screenshot → ML Kit OCR → Gemini API → Amount: 340.39 ✅
```

### With Gemini Failing:

```
Screenshot → ML Kit OCR → Gemini API (fails) → Local Parser → Amount: 340.39 ✅
```

### Old Behavior (Bug):

```
Screenshot → ML Kit OCR → Local Parser → Amount: 34039 ❌
```

## Test Cases

### Test Case 1: Google Pay Screenshot

**Text:** "To Nisha Sharma+9197581 340391Pay again"
**Expected:** 340.39 (not 34039)

### Test Case 2: PhonePe Screenshot

**Text:** "Paid ₹500 to Zomato"
**Expected:** 500

### Test Case 3: Bank SMS

**Text:** "Debited Rs.1,250.50 from A/c XX1234"
**Expected:** 1250.50

### Test Case 4: With Phone Number

**Text:** "Payment to +919876543210 Amount: ₹750"
**Expected:** 750 (not 9876543210)

## Next Steps

1. Start server: `npm run server:dev`
2. Test endpoint with curl
3. Rebuild Android app
4. Test with real screenshot
5. Check logs for Gemini API calls
6. Verify correct amount is shown

---

**Status**: Ready to test
**Date**: January 2025
