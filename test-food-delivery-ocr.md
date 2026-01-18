# Food Delivery OCR Fix - Test Guide

## Problem Fixed
ML Kit OCR was extracting "245" but missing the rupee symbol "₹" from "Add item ₹245" in food delivery app screenshots (Swiggy, Zomato, etc.), causing the AI to miss the amount.

## Changes Made

### 1. Android OCR Processor Enhancement
**File**: `client/android/app/src/main/java/com/moneymanager/app/OCRProcessor.java`

Added `enhanceTextWithCurrencySymbols()` method that:
- Detects "Add item 245" patterns and adds ₹ symbol
- Handles "Total\n245" patterns
- Converts "Rs245" to "₹245"
- Adds ₹ to standalone price-like numbers

### 2. Local Parser Enhancement
Enhanced `extractAmountRobust()` to:
- Detect e-commerce patterns: "Add item 245", "Buy now 1299"
- Handle standalone numbers in shopping contexts
- Filter out very large numbers (transaction IDs)
- Look for "Price", "Subtotal" keywords

### 3. AI Prompt Improvement
**File**: `server/src/services/geminiParser.js`

Updated Gemini prompt to:
- Recognize food delivery and e-commerce contexts
- Look for amounts near "Add item", "Add to cart" buttons
- Handle missing currency symbols
- Explicitly avoid confusing phone numbers and dates with amounts

## Testing Steps

### Test 1: Food Delivery Screenshot
1. Take a screenshot from Swiggy/Zomato showing "Add item ₹245"
2. Share to Money Manager app
3. Verify amount is detected as 245
4. Check merchant is set to the food item name

### Test 2: E-commerce Screenshot
1. Take a screenshot from Amazon/Flipkart showing product price
2. Share to Money Manager app
3. Verify price is correctly extracted
4. Check product name is captured as merchant

### Test 3: UPI Payment (Regression Test)
1. Take a screenshot from GPay/PhonePe
2. Share to Money Manager app
3. Verify existing UPI parsing still works
4. Ensure phone numbers aren't confused with amounts

## Expected Behavior

**Before Fix:**
```
OCR Text: "Add item 245"
Result: Amount = 0 (missed because no ₹ symbol)
```

**After Fix:**
```
OCR Text: "Add item 245"
Enhanced: "Add item ₹245"
Result: Amount = 245 ✅
```

## Build and Test Commands

```bash
# Rebuild Android app
cd client
npm run android

# Or use quick rebuild script
quick-rebuild.bat

# Check logs for OCR processing
adb logcat | findstr OCRProcessor
```

## Log Indicators

Look for these log messages:
- ✅ "Enhanced text with currency symbols" - Enhancement applied
- ✅ "Found amount in e-commerce pattern: 245" - E-commerce detection worked
- ✅ "Found standalone amount: 245" - Fallback detection worked
- ✅ "Gemini parsed expense" - AI successfully parsed

## Rollback Plan

If issues occur, revert these commits:
1. OCRProcessor.java - Remove `enhanceTextWithCurrencySymbols()` method
2. geminiParser.js - Restore original prompt
3. OCRProcessor.java - Restore original `extractAmountRobust()` method
