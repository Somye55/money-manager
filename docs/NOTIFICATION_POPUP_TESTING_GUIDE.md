# Real-Time Notification Popup Testing Guide

## Quick Test (NEW!)

There's now a **Test Notification Popup** button in the app:

1. Open the app → Go to **Settings**
2. Scroll to **Expense Automation** section
3. Click **"🧪 Test Notification Popup"** button
4. A test popup should appear at the top of your screen!

If the test popup works but real notifications don't, the issue is with notification access permissions.

---

## What Was Fixed

1. **Removed invalid foreground service from NotificationListenerService** - This was causing issues
2. **Added extensive logging** - Check Logcat to see exactly what's happening
3. **Added Toast confirmation** - When service connects, you'll see "Notification monitoring active"
4. **Added test button** - Test the overlay without needing real notifications
5. **Improved error handling** - Better fallback if layout fails to load
6. **Added more financial apps** - CRED, Mobikwik, SBI, HDFC, ICICI, Axis, Kotak

## Testing Steps

### Step 1: Rebuild the App

```bash
cd client
npm run build
npx cap sync android
```

### Step 2: Open in Android Studio

```bash
npx cap open android
```

Build and run on your device.

### Step 3: Grant Required Permissions

**IMPORTANT: Do these in order!**

1. **Enable Overlay Permission FIRST:**

   - Go to **Settings → Apps → Money Manager → Display over other apps**
   - Toggle it **ON**
   - Or search for "Display over other apps" in Settings

2. **Enable Notification Access:**

   - Go to **Settings → Notifications → Notification access**
   - Find **Money Manager** and toggle it **ON**
   - You'll see a warning - tap "Allow"
   - **You should see a Toast: "Money Manager: Notification monitoring active"**

3. **Disable Battery Optimization:**
   - Go to **Settings → Battery → Battery optimization**
   - Find Money Manager → Select **"Don't optimize"**

### Step 4: Test with the Test Button

1. Open the app
2. Go to Settings → Expense Automation
3. Tap **"🧪 Test Notification Popup"**
4. A popup should appear at the top of your screen!

### Step 5: Test with Real Notifications

1. **Close the Money Manager app completely**
2. Send yourself a WhatsApp message with text like:

   - "debited Rs 500"
   - "credited ₹1000"
   - "payment received"

3. A popup should appear immediately!

### Step 6: Check Logs (If Issues)

In Android Studio → Logcat, filter by tag:

- `NotificationListener`
- `OverlayService`

You should see logs like:

```
D/NotificationListener: === NotificationListener CONNECTED - Service is now active! ===
D/NotificationListener: ========================================
D/NotificationListener: NEW NOTIFICATION RECEIVED
D/NotificationListener: Package: com.whatsapp
D/NotificationListener: Title: John
D/NotificationListener: Text: debited Rs 500
D/NotificationListener: Is Financial App: true
D/NotificationListener: Is Financial Content: true
D/NotificationListener: ========================================
D/NotificationListener: >>> FINANCIAL APP DETECTED - Attempting to show overlay...
D/OverlayService: === OverlayService onStartCommand called ===
D/OverlayService: >>> OVERLAY VIEW ADDED SUCCESSFULLY <<<
```

## Troubleshooting

### "Test Notification Popup" button doesn't work

1. Check overlay permission is granted
2. Check Logcat for errors
3. Try restarting the app

### No Toast "Notification monitoring active" appears

The notification listener service isn't connecting. Try:

1. Toggle notification access OFF then ON again
2. Restart your phone
3. Reinstall the app

### Popup doesn't appear for real notifications

1. Check if the app is in the monitored list (WhatsApp, Paytm, PhonePe, etc.)
2. Check if the message contains financial keywords
3. Look at Logcat - it logs ALL notifications from financial apps now

### Service keeps disconnecting

1. Disable battery optimization for Money Manager
2. Lock the app in recent apps (if your phone supports it)
3. Some phones (Xiaomi, Oppo, Vivo) have aggressive battery management - check manufacturer-specific settings

## Monitored Apps

Currently detects notifications from:

- Paytm
- PhonePe
- Google Pay (GPay, Tez)
- WhatsApp
- Amazon Pay
- BHIM
- CRED
- Mobikwik
- Freecharge
- SBI, HDFC, ICICI, Axis, Kotak (and any app with "bank" in name)
- Any app with "upi" in package name

## Financial Keywords Detected

- debited, credited
- paid, received, sent
- payment, transaction, balance
- rs., rs (space), inr, ₹, rupee
- Any decimal number (e.g., 500.00)

## Verification Checklist

- [ ] App builds without errors
- [ ] Overlay permission granted (Display over other apps)
- [ ] Notification access granted
- [ ] Toast "Notification monitoring active" appeared
- [ ] Battery optimization disabled
- [ ] Test button works
- [ ] Real notifications trigger popup
- [ ] Popup auto-dismisses after 10 seconds
- [ ] Close button works
