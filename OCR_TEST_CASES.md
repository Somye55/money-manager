# OCR Test Cases - Quick Reference

## How to Test

1. Create test screenshots with the text below
2. Share them to Money Manager app
3. Check if amount and merchant are correctly detected
4. Monitor logcat for confidence levels

## Test Case 1: Food Delivery - Missing Rupee Symbol

**Create screenshot with:**

```
Swiggy
Chicken Biryani
Add item 245
```

**Expected Result:**

- ✅ Amount: 245
- ✅ Merchant: Swiggy or Chicken Biryani
- ✅ Confidence: 90%+

---

## Test Case 2: UPI Payment - Standalone Amount

**Create screenshot with:**

```
Payment Successful
To: RAJESH KUMAR
500
```

**Expected Result:**

- ✅ Amount: 500
- ✅ Merchant: RAJESH KUMAR
- ✅ Confidence: 70%+

---

## Test Case 3: E-commerce - Buy Now Button

**Create screenshot with:**

```
iPhone 15 Pro
Buy now 79999
Free Delivery
```

**Expected Result:**

- ✅ Amount: 79999
- ✅ Merchant: iPhone 15 Pro
- ✅ Confidence: 90%+

---

## Test Case 4: With Phone Number (Should Ignore)

**Create screenshot with:**

```
Paid to Zomato
98765 43210
Rs. 350
Order delivered
```

**Expected Result:**

- ✅ Amount: 350 (NOT 9876543210)
- ✅ Merchant: Zomato
- ✅ Confidence: 95%+

---

## Test Case 5: Multiple Numbers (Prioritization)

**Create screenshot with:**

```
Order #123456789012
Total: Rs 1250
Date: 15/01/2025
Account: 2024
```

**Expected Result:**

- ✅ Amount: 1250 (NOT 123456789012, 2025, or 2024)
- ✅ Merchant: Order or Unknown
- ✅ Confidence: 95%+

---

## Test Case 6: Amazon Order

**Create screenshot with:**

```
Amazon
Nike Running Shoes
Add to cart 3499
```

**Expected Result:**

- ✅ Amount: 3499
- ✅ Merchant: Amazon or Nike Running Shoes
- ✅ Confidence: 90%+

---

## Test Case 7: Google Pay - With Currency

**Create screenshot with:**

```
Google Pay
Paid ₹850
To: Starbucks
Payment successful
```

**Expected Result:**

- ✅ Amount: 850
- ✅ Merchant: Starbucks
- ✅ Confidence: 95%+

---

## Test Case 8: PhonePe - Uppercase Name

**Create screenshot with:**

```
PhonePe
AMIT SHARMA
₹1200
Sent successfully
```

**Expected Result:**

- ✅ Amount: 1200
- ✅ Merchant: AMIT SHARMA
- ✅ Confidence: 95%+

---

## Test Case 9: Flipkart - INR Format

**Create screenshot with:**

```
Flipkart
Samsung Galaxy Buds
INR 4999
```

**Expected Result:**

- ✅ Amount: 4999
- ✅ Merchant: Flipkart or Samsung Galaxy Buds
- ✅ Confidence: 95%+

---

## Test Case 10: Uber - Decimal Amount

**Create screenshot with:**

```
Uber
Trip completed
Total: 245.50
```

**Expected Result:**

- ✅ Amount: 245.50
- ✅ Merchant: Uber
- ✅ Confidence: 85%+

---

## How to Create Test Screenshots

### Method 1: Use Image Editor

1. Open Paint or any image editor
2. Create a white background (500x500px)
3. Add the test text in large, clear font
4. Save as PNG/JPG
5. Transfer to phone and share to app

### Method 2: Use Online Tools

1. Go to https://www.text2image.com/
2. Paste test case text
3. Generate image
4. Download and transfer to phone

### Method 3: Real Screenshots

1. Open payment apps (GPay, PhonePe, Swiggy, etc.)
2. Take actual payment screenshots
3. Share to Money Manager
4. Verify accuracy

---

## Monitoring Logs

### Start Monitoring

```bash
adb logcat | grep OCRProcessor
```

### What to Look For

**✅ Good Signs:**

```
✨ ENHANCED TEXT (with currency symbols)
✅ Found amount with currency symbol: ₹500 (95% confidence)
✅ Found merchant after 'To': RAJESH KUMAR
✅ Groq parsed expense: {amount: 500, merchant: "RAJESH KUMAR"}
```

**⚠️ Warning Signs:**

```
⚠️ Best guess amount: ₹500 (50% confidence - uncertain)
⚠️ No merchant found, using default
```

**❌ Error Signs:**

```
❌ No amount found by smart parser
❌ OCR failed: [error message]
❌ Server error 500
```

---

## Confidence Level Guide

| Level | Symbol | Meaning                                           |
| ----- | ------ | ------------------------------------------------- |
| 95%   | ✅     | Currency symbol present (₹, Rs, INR)              |
| 90%   | ✅     | E-commerce pattern (Add item, Buy now)            |
| 85%   | ✅     | Payment keyword (Total, Paid, Amount)             |
| 70%   | ⚠️     | Standalone number (just "500" on a line)          |
| 50%   | ⚠️     | Best guess (multiple numbers, picked most likely) |
| 0%    | ❌     | No amount found                                   |

---

## Quick Test Command

Run all tests automatically:

```bash
test-ocr-reliability.bat
```

This will:

1. Rebuild the Android app
2. Install on device
3. Start monitoring logs
4. Show OCR processing in real-time

---

## Troubleshooting

### Amount Not Detected

- Check if text has numbers
- Look for currency symbols or keywords
- Verify image quality is good
- Check logcat for "No amount found"

### Wrong Amount Detected

- Check if phone numbers are in text
- Look for transaction IDs (12+ digits)
- Verify dates aren't being parsed as amounts
- Check confidence level (should be 70%+)

### Merchant Not Detected

- Check if "To:" or "Paid to" is present
- Look for uppercase names
- Verify phone numbers are being removed
- Check if known merchants are in text

### Low Confidence

- Add more keywords (Total, Paid, etc.)
- Include currency symbols (₹, Rs)
- Improve image quality
- Use clearer fonts

---

## Success Criteria

For each test case:

- ✅ Amount correctly detected
- ✅ Merchant correctly identified
- ✅ Confidence level 70% or higher
- ✅ No false positives (phone numbers, IDs, dates)
- ✅ Processing time under 3 seconds

---

## Real-World Testing

After passing all test cases, test with:

1. **Google Pay** - 10 real payment screenshots
2. **PhonePe** - 10 real payment screenshots
3. **Swiggy** - 5 food order screenshots
4. **Zomato** - 5 food order screenshots
5. **Amazon** - 5 shopping cart screenshots
6. **Flipkart** - 5 shopping cart screenshots

**Target Accuracy:** 95%+ correct detection

---

## Reporting Issues

If a test case fails, provide:

1. Screenshot of the test image
2. Raw OCR text from logcat
3. Expected vs actual result
4. Confidence level reported
5. Full logcat output

Example:

```
Test Case: Food Delivery - Missing Rupee Symbol
Expected: Amount=245, Merchant=Swiggy
Actual: Amount=0, Merchant=Unknown
Confidence: 0%
Raw OCR: "Swiggy\nChicken Biryani\nAdd item 245"
Issue: Currency symbol not added, pattern not matched
```
