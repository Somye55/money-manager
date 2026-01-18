# Test OCR Navigation Fixes

## Quick Test Steps

### Test 1: Direct Navigation (No Dashboard Flash)

1. Build and install the app: `npm run build:android` or use `rebuild-android.bat`
2. Open GPay or PhonePe
3. Find a payment transaction
4. Tap Share → Select Money Manager app
5. ✅ **Expected**: App opens directly to QuickSave page with OCR results
6. ❌ **Before**: Dashboard would flash briefly before showing QuickSave

### Test 2: Cancel Button (No Loop)

1. Share an image to open QuickSave page
2. Click the "Cancel" button
3. ✅ **Expected**: Navigates to Dashboard
4. Press device back button
5. ✅ **Expected**: App closes or goes to home screen
6. ❌ **Before**: Would loop between Dashboard → QuickSave → Dashboard

### Test 3: Save and Back (No Loop)

1. Share an image to open QuickSave page
2. Fill in amount and category
3. Click "Save" button
4. ✅ **Expected**: Shows success toast and navigates to Dashboard
5. Press device back button
6. ✅ **Expected**: App closes or goes to home screen
7. ❌ **Before**: Would redirect back to QuickSave page

### Test 4: No Amount Detected Flow

1. Share an image with no clear amount
2. ✅ **Expected**: Shows "Amount Not Detected" screen
3. Click "Back to Home" button
4. ✅ **Expected**: Navigates to Dashboard
5. Press device back button
6. ✅ **Expected**: App closes (no loop)

### Test 5: OCR Error Flow

1. Share an invalid/corrupted image
2. ✅ **Expected**: Shows "Processing Failed" screen
3. Click "Back to Home" button
4. ✅ **Expected**: Navigates to Dashboard
5. Press device back button
6. ✅ **Expected**: App closes (no loop)

## Build Commands

```bash
# Full rebuild
npm run build:android

# Or use batch file
rebuild-android.bat

# Install on device
install-debug.bat
```

## Debugging

If issues persist, check logs:

```bash
# Android logs
adb logcat | grep -E "MainActivity|QuickSave|OCR"

# Or in Android Studio
# View → Tool Windows → Logcat
# Filter: "MainActivity"
```

## What Changed

### MainActivity.java

- Changed `window.location.href` to `window.location.replace()` for direct navigation
- This prevents Dashboard from being added to navigation history

### QuickSave.jsx

- All `navigate()` calls now use `{ replace: true }` option
- Clears OCR data from sessionStorage on cancel
- Prevents navigation loops by replacing history entries

## Success Criteria

✅ No dashboard flash when sharing images
✅ Back button closes app (doesn't loop)
✅ Cancel button works correctly
✅ Save button works correctly
✅ All error states handle navigation properly
