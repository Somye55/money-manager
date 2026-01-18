# OCR Currency Symbol Fix - Complete

## Issue

Food delivery app screenshots (Swiggy, Zomato) showing "Add item ₹245" were being OCR'd as "Add item 245" (missing ₹ symbol), causing the AI parser to miss the amount entirely.

## Root Cause

ML Kit's Latin text recognizer doesn't always reliably capture currency symbols, especially when they appear near buttons or in certain fonts.

## Solution - Three-Layer Approach

### Layer 1: Text Enhancement (Android)

Added post-processing to OCR text that intelligently adds missing currency symbols:

- `"Add item 245"` → `"Add item ₹245"`
- `"Total\n245"` → `"Total\n₹245"`
- `"Rs245"` → `"₹245"`
- Standalone numbers in price context → `"₹245"`

### Layer 2: Local Parser (Android Fallback)

Enhanced regex patterns to detect e-commerce scenarios:

- Detects "Add item", "Buy now", "Order now" patterns
- Handles standalone numbers in shopping contexts
- Filters out transaction IDs and dates

### Layer 3: AI Parser (Server)

Improved Gemini prompt with explicit instructions:

- Recognize food delivery and e-commerce contexts
- Look for amounts near action buttons
- Handle missing currency symbols
- Avoid confusing phone numbers/dates with amounts

## Files Modified

1. `client/android/app/src/main/java/com/moneymanager/app/OCRProcessor.java`

   - Added `enhanceTextWithCurrencySymbols()` method
   - Enhanced `extractAmountRobust()` with e-commerce patterns

2. `server/src/services/geminiParser.js`
   - Updated AI prompt with food delivery context
   - Added explicit rules for amount detection

## Testing

See `test-food-delivery-ocr.md` for complete testing guide.

Quick test:

1. Share a food delivery screenshot with "Add item ₹245"
2. Verify amount is detected as 245
3. Check logs for "Enhanced text with currency symbols"

## Impact

- ✅ Food delivery apps (Swiggy, Zomato, Uber Eats)
- ✅ E-commerce apps (Amazon, Flipkart)
- ✅ Shopping cart screenshots
- ✅ Maintains backward compatibility with UPI payments
