# 🚀 Enable Screenshot Monitoring - Quick Fix

## The Problem

You took a screenshot but nothing happened because **screenshot monitoring is not enabled yet**.

## The Solution (2 minutes)

### Step 1: Rebuild the App

```bash
cd client
npm run build
npx cap sync android
```

### Step 2: Install Updated App

Open in Android Studio and run, or:

```bash
cd android
./gradlew installDebug
```

### Step 3: Enable Screenshot Monitoring

1. **Open the Money Manager app**

2. **Navigate to Settings**:
   - Tap the Settings icon (bottom navigation)

3. **Go to Automation**:
   - Tap "Automation" card

4. **Find Screenshot Monitoring section**:
   - Scroll down past SMS and Notification settings
   - You'll see a new section: "📸 Screenshot Monitoring"

5. **Grant Storage Permission**:
   - Tap "Grant Permission" button
   - When system dialog appears, tap "Allow"
   - Return to app

6. **Enable Monitoring**:
   - Toggle the switch to **ON** (it will turn blue/green)
   - You'll see status change to "✓ Enabled"
   - A toast notification will confirm: "Screenshot monitoring is now active"

### Step 4: Verify It's Working

1. **Check the logs**:

   ```bash
   adb logcat | grep -E "MainActivity|ScreenshotListener"
   ```

2. **You should see**:

   ```
   MainActivity: === Screenshot Monitoring Check ===
   MainActivity: Screenshot monitoring enabled in settings: true
   MainActivity: ✅ Screenshot listener service started
   ScreenshotListener: === ScreenshotListenerService CREATED ===
   ScreenshotListener: ✅ Screenshot listener ready and monitoring MediaStore
   ```

3. **Take a test screenshot** (of anything - home screen is fine)

4. **Within 2 seconds, you should see**:
   ```
   ScreenshotListener: MediaStore change detected
   ScreenshotListener: 📸 Screenshot monitoring enabled in settings: true
   ScreenshotListener: Found screenshot: /path/to/screenshot.png
   ScreenshotListener: New screenshot detected
   ScreenshotListener: Processing screenshot with OCR...
   ```

### Step 5: Test with Real Payment

1. **Open Google Pay** (or any payment app)
2. **View a transaction** or make a payment
3. **Take a screenshot** of the payment confirmation
4. **Wait 3-5 seconds**
5. **Popup should appear** with:
   - Amount (automatically extracted)
   - Merchant name
   - Category selection dropdown
   - Save button

6. **Select category and save**
7. **Done!** Expense is saved to your database

## What You'll See

### In Settings:

```
┌─────────────────────────────────────┐
│  📸 Screenshot Monitoring           │
│  ✓ Enabled                          │
├─────────────────────────────────────┤
│  Automatically detect and process   │
│  screenshots for expense extraction │
│                                     │
│  📸 How it works:                   │
│  • Take screenshot of payment       │
│  • App extracts text using ML Kit  │
│  • Groq AI parses amount/merchant  │
│  • Popup appears for category      │
│                                     │
│  [Monitoring Active]                │
│  Screenshots will be processed      │
│  automatically                      │
│                                     │
│  [Toggle: ON] ●─────────           │
└─────────────────────────────────────┘
```

### When Taking Screenshot:

```
1. Take screenshot → 📸
2. Wait 2-3 seconds... ⏳
3. Popup appears! 🎉

┌─────────────────────────────────────┐
│  New Expense Detected               │
├─────────────────────────────────────┤
│  Amount: ₹500.00                    │
│  Merchant: Google Pay               │
│  Type: Debit                        │
│                                     │
│  Category: [Select ▼]              │
│                                     │
│  [Save Expense]                     │
└─────────────────────────────────────┘
```

## Troubleshooting

### "I don't see Screenshot Monitoring section"

→ You need to rebuild and reinstall the app (Step 1 & 2 above)

### "Permission button doesn't work"

→ Manually grant permission:

1. Settings → Apps → Money Manager → Permissions
2. Enable "Photos and media" or "Storage"
3. Return to app and toggle ON

### "Toggle doesn't stay ON"

→ Check logcat for errors:

```bash
adb logcat | grep ScreenshotListenerPlugin
```

### "No popup appears after screenshot"

→ Check these:

1. Is monitoring enabled? (Settings → Automation)
2. Is overlay permission granted? (Settings → Display Over Other Apps)
3. Check logs: `adb logcat | grep ScreenshotListener`

### "Service not starting"

→ Force restart:

1. Force close app completely
2. Reopen app
3. Go to Settings → Automation
4. Toggle OFF, wait 2 seconds, toggle ON

## Debug Commands

### Check if enabled:

```bash
adb shell "run-as com.moneymanager.app cat /data/data/com.moneymanager.app/shared_prefs/app_settings.xml | grep screenshot"
```

### Watch logs in real-time:

```bash
adb logcat | grep -E "ScreenshotListener|OCRProcessor|OverlayService"
```

### Manual service start (for testing):

```bash
adb shell am startservice com.moneymanager.app/.ScreenshotListenerService
```

## Expected Behavior

### ✅ When Enabled:

- Service starts automatically on app launch
- MediaStore is monitored for new screenshots
- Screenshots are processed within 3-5 seconds
- Popup appears with parsed expense data
- Can save expense with one tap

### ❌ When Disabled:

- Service does not start
- Screenshots are ignored
- No processing happens
- No popup appears
- Privacy is maintained

## Next Steps

After enabling:

1. ✅ Take screenshots of payments
2. ✅ Review parsed data in popup
3. ✅ Select category
4. ✅ Save expense
5. ✅ Enjoy automatic expense tracking!

**No more manual entry! 🎉**
