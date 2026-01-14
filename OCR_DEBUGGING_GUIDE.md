# 🔍 OCR Debugging Guide

## Current Issue Analysis

### Problem 1: Amount Not Detected

**OCR Text**: Contains "80,000" but ML Kit returns 0.0

**Root Cause**:

- ML Kit Entity Extraction may not recognize Indian number formats (80,000)
- Regex fallback wasn't catching it properly

**Solution Applied**:

- Improved regex patterns to handle:
  - Comma-separated numbers (80,000)
  - Numbers without currency symbols
  - Large standalone numbers
  - Better filtering of phone numbers and transaction IDs

### Problem 2: OCR Text Quality

**Issue**: Sometimes OCR doesn't extract text correctly from images

**Possible Causes**:

1. Image quality/resolution too low
2. Image orientation incorrect
3. Text too small or blurry
4. Poor contrast

## Improved Regex Patterns

### Pattern Priority (in order):

1. **Standalone large numbers**: `\b([0-9]{2,}(?:,[0-9]{3})*(?:\.[0-9]{2})?)\b`
   - Matches: 80,000 | 80000 | 1,234.56
2. **Currency before**: `(?:Rs\.?|₹)\s*([0-9,]+(?:\.[0-9]{2})?)`
   - Matches: ₹80,000 | Rs.80000 | Rs 80,000
3. **Currency after**: `([0-9,]+(?:\.[0-9]{2})?)\s*(?:Rs\.?|₹)`
   - Matches: 80,000₹ | 80000 Rs
4. **With keywords**: `(?:Amount|Total|Paid|Pay)\s*:?\s*(?:Rs\.?|₹)?\s*([0-9,]+(?:\.[0-9]{2})?)`
   - Matches: Amount: 80000 | Total 80,000 | Paid ₹80000
5. **Plain numbers**: `\b([0-9]{3,}(?:\.[0-9]{2})?)\b`
   - Matches: 80000 | 1234.56

### Smart Filtering

- Skips phone numbers (10 digits exactly)
- Skips transaction IDs (checks context for "UPI", "transaction id")
- Only accepts amounts between 10 and 10,000,000
- Returns the largest reasonable amount found

## Testing Your OCR

### Step 1: Check Logs

```bash
adb logcat | grep OCRProcessor
```

### Step 2: Look for These Logs

```
========================================
OCR EXTRACTED TEXT:
[Full text here]
========================================
```

### Step 3: Verify Extraction

```
Extracting amount from text: [first 200 chars]
Pattern 1 found amount: 80000
Pattern 2 found amount: 80000
...
Final extracted amount: 80000.0
```

### Step 4: Check Merchant

```
Extracting merchant from text...
Found merchant: Nisha Sharma
```

## Common OCR Issues & Fixes

### Issue: Amount Shows 0.0

**Check 1**: Is the amount in the OCR text?

```bash
adb logcat | grep "OCR EXTRACTED TEXT" -A 20
```

**If YES** → Regex issue, check patterns
**If NO** → OCR quality issue, improve image

**Fix for Regex**:

- Check if amount has special format
- Add new pattern to `extractAmountWithRegex()`

**Fix for OCR**:

- Ensure image is clear and high resolution
- Check image orientation
- Verify text is not too small

### Issue: Wrong Amount Detected

**Possible Causes**:

1. Multiple amounts in image (picks largest)
2. Phone number detected as amount
3. Transaction ID detected as amount

**Check Logs**:

```
Pattern X found amount: [value]
Skipping phone number: [value]
Skipping transaction ID: [value]
```

**Fix**:

- Improve filtering logic in `extractAmountWithRegex()`
- Add more context checks

### Issue: Merchant Not Found

**Check Logs**:

```
Extracting merchant from text...
No merchant found, using default
```

**Possible Causes**:

1. Keyword not in list ("To:", "Paid to", etc.)
2. Merchant name has special characters
3. Phone number attached to merchant name

**Fix**:

- Add new keyword to `merchantKeywords` array
- Improve cleaning logic

### Issue: Wrong Transaction Type

**Check Text**:

- Should contain "credited", "received", "refund" → credit
- Should contain "debited", "paid", "sent" → debit

**Fix**:

- Add more keywords to `determineTransactionType()`

## Improving OCR Quality

### For Better Text Recognition:

1. **Image Preprocessing** (Future Enhancement):

```java
// Add before OCR processing
Bitmap preprocessed = preprocessImage(bitmap);
- Increase contrast
- Convert to grayscale
- Sharpen edges
- Resize if too small
```

2. **Use ML Kit's Advanced Options**:

```java
// In OCRProcessor constructor
TextRecognizerOptions options = new TextRecognizerOptions.Builder()
    .setExecutor(executorService)
    .build();
recognizer = TextRecognition.getClient(options);
```

3. **Handle Image Orientation**:

```java
// Detect and rotate image if needed
int rotation = getImageRotation(imageUri);
InputImage image = InputImage.fromFilePath(context, imageUri, rotation);
```

## Test Cases

### Test Case 1: Standard Google Pay

```
Expected: Amount: 80000, Merchant: Nisha Sharma, Type: debit
```

### Test Case 2: PhonePe Receipt

```
Expected: Amount: [value], Merchant: [name], Type: debit/credit
```

### Test Case 3: Bank SMS Screenshot

```
Expected: Amount: [value], Merchant: [name], Type: debit/credit
```

### Test Case 4: Multiple Amounts

```
Expected: Largest reasonable amount (not phone number)
```

## Quick Fixes

### If Amount Still 0.0:

1. **Check the actual OCR text**:

```bash
adb logcat | grep "OCR EXTRACTED TEXT" -A 50 > ocr_output.txt
```

2. **Test regex manually**:

- Copy the OCR text
- Test against patterns in regex tester
- Adjust patterns as needed

3. **Add specific pattern**:

```java
// Add to extractAmountWithRegex()
Pattern.compile("your_specific_pattern_here")
```

### If Merchant Wrong:

1. **Check keyword**:

```bash
adb logcat | grep "Extracting merchant"
```

2. **Add keyword**:

```java
String[] merchantKeywords = {
    "To:", "Paid to", "YOUR_NEW_KEYWORD"
};
```

### If Type Wrong:

1. **Check text content**:

```bash
adb logcat | grep "OCR EXTRACTED TEXT" -A 50
```

2. **Add keyword**:

```java
// In determineTransactionType()
if (lowerText.contains("your_keyword")) {
    return "credit"; // or "debit"
}
```

## Rebuild & Test

After making changes:

```bash
build-ml-kit.bat
```

Then test with:

```bash
adb logcat | grep OCRProcessor
```

## Expected Output (Success)

```
D  🤖 Using ML Kit Entity Extraction (Offline)...
D  ✅ ML Kit model ready
D  ========================================
D  OCR EXTRACTED TEXT:
D  To Nisha Sharma+9197581 3403980,000Pay again...
D  ========================================
D  Extracting amount from text: To Nisha Sharma+9197581 3403980,000Pay...
D  Pattern 1 found amount: 80000.0
D  Final extracted amount: 80000.0
D  Extracting merchant from text...
D  Found merchant: Nisha Sharma
D  ✅ ML Kit parsed - Amount: 80000.0, Merchant: Nisha Sharma, Type: debit
```

## Next Steps

1. Rebuild with improved regex
2. Test with the same screenshot
3. Check logs for amount detection
4. If still failing, add specific pattern for that format
5. Consider image preprocessing for better OCR quality

---

**Remember**: ML Kit is still learning. The regex fallback is your safety net!
