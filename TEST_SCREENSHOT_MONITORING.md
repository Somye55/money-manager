# 🧪 Screenshot Monitoring - Testing Guide

## Pre-Testing Setup

### 1. Build the App

```bash
cd client
npm run build
npx cap sync android
npx cap open android
```

### 2. Install on Device

- Connect Android device via USB
- Enable USB debugging
- Click "Run" in Android Studio
- Or use: `./gradlew installDebug`

### 3. Grant Permissions

- Storage/Media permission
- Display over other apps permission
- Notification access (for overlay)

## Test Cases

### Test 1: Permission Request Flow

**Objective**: Verify permission request works correctly

**Steps**:

1. Open app → Settings → Automation
2. Scroll to "Screenshot Monitoring" section
3. Tap "Grant Permission"
4. Verify system permission dialog appears
5. Grant permission
6. Verify status changes to show permission granted

**Expected Result**:

- Permission dialog appears
- After granting, toggle switch becomes available
- Status indicator shows permission granted

**Pass/Fail**: \_\_\_

---

### Test 2: Enable Screenshot Monitoring

**Objective**: Verify monitoring can be enabled

**Steps**:

1. In Screenshot Monitoring section
2. Toggle switch to ON
3. Verify status changes to "✓ Enabled"
4. Check logcat for service start message

**Expected Result**:

- Toggle animates to ON position
- Status shows "✓ Enabled"
- Logcat shows: "Screenshot listener service started"
- Toast notification confirms activation

**Pass/Fail**: \_\_\_

---

### Test 3: Screenshot Detection - Google Pay

**Objective**: Verify screenshot detection and OCR processing

**Steps**:

1. Open Google Pay app
2. Make a test payment or view a past transaction
3. Take a screenshot of the payment confirmation
4. Wait 3-5 seconds

**Expected Result**:

- Popup appears with expense details
- Amount is correctly extracted
- Merchant name is identified
- Type is set to "debit"

**Pass/Fail**: \_\_\_

---

### Test 4: Screenshot Detection - Food Delivery

**Objective**: Test with food delivery app screenshots

**Steps**:

1. Open Swiggy or Zomato
2. View an order confirmation or receipt
3. Take a screenshot
4. Wait for popup

**Expected Result**:

- Popup appears
- Restaurant name extracted as merchant
- Order amount correctly identified
- Can select "Food & Dining" category

**Pass/Fail**: \_\_\_

---

### Test 5: Screenshot Detection - E-commerce

**Objective**: Test with e-commerce app screenshots

**Steps**:

1. Open Amazon or Flipkart
2. View an order confirmation
3. Take a screenshot
4. Wait for popup

**Expected Result**:

- Popup appears
- Product/store name as merchant
- Order total correctly extracted
- Can select "Shopping" category

**Pass/Fail**: \_\_\_

---

### Test 6: Disable Monitoring

**Objective**: Verify monitoring can be disabled

**Steps**:

1. Go to Settings → Automation
2. Toggle screenshot monitoring OFF
3. Take a screenshot of any payment
4. Wait 10 seconds

**Expected Result**:

- Toggle animates to OFF position
- Status shows "✗ Disabled"
- No popup appears after screenshot
- Logcat shows: "Screenshot monitoring disabled"

**Pass/Fail**: \_\_\_

---

### Test 7: Re-enable Monitoring

**Objective**: Verify monitoring can be re-enabled

**Steps**:

1. Toggle screenshot monitoring back ON
2. Take a screenshot of a payment
3. Wait for popup

**Expected Result**:

- Service restarts successfully
- Screenshot is detected and processed
- Popup appears as expected

**Pass/Fail**: \_\_\_

---

### Test 8: App Restart Persistence

**Objective**: Verify setting persists across app restarts

**Steps**:

1. Enable screenshot monitoring
2. Force close the app completely
3. Reopen the app
4. Go to Settings → Automation
5. Check screenshot monitoring status
6. Take a test screenshot

**Expected Result**:

- Status still shows "✓ Enabled"
- Service automatically starts on app launch
- Screenshot is detected and processed

**Pass/Fail**: \_\_\_

---

### Test 9: Device Reboot Persistence

**Objective**: Verify setting persists after device reboot

**Steps**:

1. Enable screenshot monitoring
2. Reboot the device
3. Open the app
4. Check screenshot monitoring status
5. Take a test screenshot

**Expected Result**:

- Status shows "✓ Enabled"
- Service starts automatically
- Screenshot is processed

**Pass/Fail**: \_\_\_

---

### Test 10: Multiple Screenshots

**Objective**: Test throttling and batch processing

**Steps**:

1. Take 3 screenshots in quick succession (< 2 seconds apart)
2. Wait and observe

**Expected Result**:

- Only the first screenshot is processed immediately
- Subsequent screenshots are throttled
- Logcat shows: "Skipping - too soon after last process"
- No duplicate popups

**Pass/Fail**: \_\_\_

---

### Test 11: Wrong Screenshot Type

**Objective**: Verify non-payment screenshots are handled

**Steps**:

1. Take a screenshot of home screen or random app
2. Wait 10 seconds

**Expected Result**:

- OCR extracts text but finds no amount
- Either no popup or popup with 0 amount
- No crash or error

**Pass/Fail**: \_\_\_

---

### Test 12: Overlay Permission Missing

**Objective**: Test behavior without overlay permission

**Steps**:

1. Disable "Display over other apps" permission
2. Take a screenshot of a payment
3. Check logcat

**Expected Result**:

- OCR processes successfully
- Logcat shows: "No overlay permission, cannot show popup"
- No crash
- No popup appears

**Pass/Fail**: \_\_\_

---

### Test 13: Storage Permission Revoked

**Objective**: Test behavior when permission is revoked

**Steps**:

1. Enable screenshot monitoring
2. Go to system settings and revoke storage permission
3. Take a screenshot
4. Check logcat

**Expected Result**:

- Logcat shows: "No READ_MEDIA_IMAGES permission"
- No crash
- No popup appears
- Service continues running

**Pass/Fail**: \_\_\_

---

### Test 14: Groq Server Offline

**Objective**: Test fallback to local parser

**Steps**:

1. Disconnect from internet or stop server
2. Take a screenshot of a payment
3. Wait for popup

**Expected Result**:

- OCR extracts text successfully
- Falls back to local regex parser
- Popup appears with parsed data (may be less accurate)
- Logcat shows: "Falling back to local parsing"

**Pass/Fail**: \_\_\_

---

### Test 15: Category Selection and Save

**Objective**: Test complete flow from screenshot to save

**Steps**:

1. Take a screenshot of a payment
2. Wait for popup
3. Select a category
4. Tap "Save Expense"
5. Go to Dashboard
6. Verify expense appears

**Expected Result**:

- Popup appears with correct data
- Category selection works
- Save button saves expense
- Expense appears in dashboard
- Amount, merchant, and category are correct

**Pass/Fail**: \_\_\_

---

## Performance Tests

### Test P1: Detection Speed

**Objective**: Measure time from screenshot to detection

**Steps**:

1. Take a screenshot
2. Note timestamp in logcat
3. Find "New screenshot detected" message
4. Calculate time difference

**Expected Result**: < 1 second

**Actual Result**: \_\_\_ seconds

---

### Test P2: OCR Processing Speed

**Objective**: Measure OCR processing time

**Steps**:

1. Take a screenshot
2. Find "Processing screenshot with OCR" in logcat
3. Find "OCR Success" message
4. Calculate time difference

**Expected Result**: 1-3 seconds

**Actual Result**: \_\_\_ seconds

---

### Test P3: Total Time to Popup

**Objective**: Measure total time from screenshot to popup

**Steps**:

1. Take a screenshot
2. Start timer
3. Wait for popup to appear
4. Stop timer

**Expected Result**: 3-5 seconds

**Actual Result**: \_\_\_ seconds

---

## Edge Cases

### Edge Case 1: Very Long Text

- Screenshot with lots of text (terms & conditions)
- Should extract relevant payment info only

### Edge Case 2: Multiple Amounts

- Screenshot with multiple numbers
- Should identify the correct payment amount

### Edge Case 3: No Amount

- Screenshot with no monetary value
- Should handle gracefully (0 amount or no popup)

### Edge Case 4: Foreign Currency

- Screenshot with USD, EUR, etc.
- Should handle or show error

### Edge Case 5: Corrupted Screenshot

- Blurry or unreadable screenshot
- Should fail gracefully without crash

---

## Logcat Monitoring

### Key Log Messages to Watch:

**Service Start**:

```
Screenshot listener service started (enabled in settings)
```

**Screenshot Detection**:

```
MediaStore change detected
New screenshot detected: content://...
```

**Settings Check**:

```
Screenshot monitoring enabled: true
```

**OCR Processing**:

```
Processing screenshot with OCR...
✅ Extracted X text blocks in reading order
```

**Groq Parsing**:

```
🤖 Calling Groq server for AI parsing...
✅ Groq parsed - Amount: X, Merchant: Y
```

**Overlay Display**:

```
Overlay service started for screenshot expense
```

---

## Bug Report Template

If you find a bug, report it with:

**Bug Title**: [Brief description]

**Steps to Reproduce**:

1.
2.
3.

**Expected Behavior**:

**Actual Behavior**:

**Screenshots/Logcat**:

**Device Info**:

- Model:
- Android Version:
- App Version:

---

## Test Summary

**Total Tests**: 15 core + 3 performance + 5 edge cases = 23 tests

**Passed**: **_
**Failed**: _**
**Skipped**: \_\_\_

**Overall Status**: \_\_\_

**Notes**:

**Tester**: **_
**Date**: _**
**Build Version**: \_\_\_
