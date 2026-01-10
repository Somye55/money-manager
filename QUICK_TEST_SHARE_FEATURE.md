# Quick Test - Share Feature

## 🚀 5-Minute Test Guide

### Prerequisites

- Android device (10+)
- Money Manager app installed
- Google Pay or PhonePe installed

---

## Test 1: Share from Google Pay (2 minutes)

### Steps

1. Open **Google Pay**
2. Go to any transaction (or make a test payment)
3. Tap the **Share** button
4. Select **Money Manager** from share menu
5. Wait 2-3 seconds

### Expected Result

✅ Money Manager opens
✅ Popup appears with:

- Amount (e.g., ₹500.00)
- Merchant name (e.g., "Zomato")
- Category dropdown
- Save and Dismiss buttons

### What to Check

- [ ] App opens immediately
- [ ] Amount is correct
- [ ] Merchant name extracted
- [ ] Popup is visible
- [ ] Category selection works
- [ ] Save button works
- [ ] Expense appears in dashboard

---

## Test 2: Share from Gallery (1 minute)

### Steps

1. Open **Gallery** app
2. Find any payment screenshot
3. Tap **Share** button
4. Select **Money Manager**
5. Wait 2-3 seconds

### Expected Result

✅ Same popup as Test 1
✅ Data extracted from old screenshot

---

## Test 3: Share When App Running (1 minute)

### Steps

1. Open **Money Manager** (keep it running)
2. Switch to **Google Pay**
3. Share a transaction
4. Select **Money Manager**

### Expected Result

✅ App comes to foreground
✅ Popup appears on top

---

## Test 4: Multiple Shares (1 minute)

### Steps

1. Share first transaction
2. Dismiss popup
3. Immediately share another transaction

### Expected Result

✅ Second popup appears
✅ No crashes or freezes

---

## 🐛 Troubleshooting

### Money Manager not in share menu

**Fix**: Reinstall app or restart phone

### Popup doesn't appear

**Fix**: Grant "Display over other apps" permission

- Settings → Apps → Money Manager → Display over other apps → Allow

### Wrong amount detected

**Fix**: Ensure screenshot is clear. Try different screenshot.

### App crashes

**Fix**: Check logs:

```bash
adb logcat | grep -E "MainActivity|OCRProcessor|OverlayService"
```

---

## ✅ Success Criteria

All tests should pass:

- [x] Share from GPay works
- [x] Share from Gallery works
- [x] Share when app running works
- [x] Multiple shares work
- [x] Amount extracted correctly
- [x] Merchant extracted correctly
- [x] Popup appears within 3 seconds
- [x] Category selection works
- [x] Expense saves to database
- [x] No crashes

---

## 📊 Performance Check

| Metric             | Target | Pass/Fail |
| ------------------ | ------ | --------- |
| Share to popup     | <3s    | [ ]       |
| OCR accuracy       | >90%   | [ ]       |
| App responsiveness | Smooth | [ ]       |
| Memory usage       | <100MB | [ ]       |
| No crashes         | 0      | [ ]       |

---

## 🎯 Quick Commands

### View Logs

```bash
adb logcat | grep -E "MainActivity|OCRProcessor"
```

### Check Memory

```bash
adb shell dumpsys meminfo com.moneymanager.app
```

### Force Stop

```bash
adb shell am force-stop com.moneymanager.app
```

### Reinstall

```bash
adb install -r app-debug.apk
```

---

## 📝 Test Report Template

```
Date: ___________
Device: ___________
Android Version: ___________

Test 1 (Share from GPay): PASS / FAIL
Test 2 (Share from Gallery): PASS / FAIL
Test 3 (Share when running): PASS / FAIL
Test 4 (Multiple shares): PASS / FAIL

Issues Found:
1. ___________
2. ___________

Notes:
___________
```

---

## 🎉 If All Tests Pass

**Congratulations!** The share feature is working perfectly.

Next steps:

1. Test with more payment apps
2. Test with different screenshot formats
3. Add to production
4. Monitor user feedback

---

**Total Test Time**: 5 minutes
**Status**: Ready to test! 🚀
