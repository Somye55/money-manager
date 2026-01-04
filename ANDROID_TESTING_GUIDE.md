# Android Testing Guide - Overlay Expense Save

## Why You Got the Error

The error `Cannot read properties of undefined (reading 'testOverlay')` means you're trying to test in a **web browser**, but the `NotificationListenerPlugin` only exists on **Android devices**.

## Prerequisites

✅ Android device (phone or tablet)
✅ USB cable
✅ Android Studio installed
✅ USB debugging enabled on device

## Step-by-Step Testing

### Step 1: Enable USB Debugging on Android Device

1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times (enables Developer Options)
3. Go back to **Settings** → **Developer Options**
4. Enable **USB Debugging**
5. Connect device to computer via USB
6. Accept the "Allow USB debugging" prompt on device

### Step 2: Build and Install the App

Open terminal/command prompt and run:

```bash
cd client
npm install
npm run build
npx cap sync android
npx cap open android
```

This will:

- Install dependencies
- Build the React app
- Sync with Android
- Open Android Studio

### Step 3: Run on Device

In Android Studio:

1. Wait for Gradle sync to complete (bottom right corner)
2. Select your device from the dropdown (top toolbar)
3. Click the green **Run** button (▶️)
4. Wait for app to install and launch on device

### Step 4: Grant Permissions

When the app opens on your device:

1. Go to **Settings** page in the app
2. Click **"Enable Notification Listener"**

   - This opens Android settings
   - Find "Money Manager" in the list
   - Toggle it ON
   - Go back to the app

3. Click **"Enable Overlay Permission"**
   - This opens Android settings
   - Find "Money Manager" in the list
   - Toggle "Allow display over other apps" ON
   - Go back to the app

### Step 5: Connect Chrome DevTools

On your computer:

1. Open **Google Chrome**
2. Go to: `chrome://inspect/#devices`
3. You should see your device listed
4. Under your device, find **"Money Manager"** or **"com.moneymanager.app"**
5. Click **"inspect"**
6. A DevTools window will open

### Step 6: Test the Overlay

In the DevTools console, paste:

```javascript
window.NotificationListenerPlugin.testOverlay();
```

You should see:

- ✅ A popup overlay appears on your Android device
- ✅ Shows test notification with amount
- ✅ Has category dropdown
- ✅ Has "Save Expense" button

### Step 7: Save Test Expense

On your Android device:

1. Select a category from the dropdown (e.g., "Food & Dining")
2. Click **"Save Expense"** button
3. You should see a toast message: "Expense saved: Rs.X.XX in CategoryName"
4. The overlay should close
5. Go to the Dashboard page
6. The expense should appear in the list! ✅

### Step 8: Verify in Console

In Chrome DevTools console, you should see:

```
Handling expense saved from overlay: {amount: ..., category: ...}
Available categories: [...]
Final category mapping: "Food & Dining" -> "Food" (ID: 1)
Final expense data: {amount: ..., date: "2024-01-04...", ...}
User ID: 123
✅ Expense saved from overlay successfully
```

## Troubleshooting

### Device Not Showing in chrome://inspect

**Problem:** Device not listed in Chrome inspect
**Solutions:**

- Check USB cable is connected
- Enable USB debugging on device
- Accept "Allow USB debugging" prompt
- Try different USB port
- Restart ADB: `adb kill-server && adb start-server`

### App Not Installing

**Problem:** Build fails or app won't install
**Solutions:**

- Check Android Studio for errors
- Clean build: `cd android && ./gradlew clean`
- Rebuild: `npm run build && npx cap sync android`
- Check device storage space

### Plugin Still Undefined

**Problem:** `NotificationListenerPlugin` is undefined
**Solutions:**

- Make sure you're inspecting the **app**, not a browser tab
- Rebuild and reinstall the app
- Check if app is running on device
- Try: `console.log(window.Capacitor.Plugins)` to see available plugins

### Overlay Doesn't Appear

**Problem:** testOverlay() runs but no popup shows
**Solutions:**

- Check overlay permission is granted
- Check Android logs: `adb logcat -s OverlayService`
- Try restarting the app
- Check if another overlay is blocking it

### Expense Doesn't Save

**Problem:** Overlay appears but expense doesn't save
**Solutions:**

- Check console for errors
- Verify user is logged in
- Check categories are loaded
- Look for "Final expense data" in console - verify `date` field exists
- Check Supabase connection

## Alternative: Test with Real Notification

Instead of using `testOverlay()`, you can test with a real notification:

1. **Send yourself a payment message on WhatsApp:**

   ```
   You spent Rs.100 at Test Restaurant
   ```

2. **Or use a real payment app:**

   - Make a small payment via GPay/PhonePe/Paytm
   - The notification should trigger the overlay automatically

3. **The overlay should appear automatically**
   - Select category
   - Click "Save Expense"
   - Check dashboard

## Testing Without Android Device

If you don't have an Android device, you can test the manual expense entry:

1. Open the app in browser: `npm run dev`
2. Navigate to `/add` page
3. Enter amount: 100
4. Enter description: Test expense
5. Select a category
6. Click "Add Expense"
7. Check if it saves successfully

This tests the same database flow (minus the Android overlay part).

## Verification Checklist

After testing, verify:

- ✅ Overlay popup appears
- ✅ Category dropdown works
- ✅ Save button works
- ✅ Toast message appears
- ✅ Expense appears in dashboard
- ✅ Database has correct data
- ✅ Console shows success logs
- ✅ No errors in console or logcat

## Next Steps

Once the test overlay works:

1. **Test with real notifications:**

   - Send payment messages
   - Make real transactions
   - Verify automatic detection

2. **Test different categories:**

   - Try all category mappings
   - Verify "Other" fallback works

3. **Test edge cases:**

   - Different amount formats
   - Different notification formats
   - Multiple notifications

4. **Monitor for issues:**
   - Check logs regularly
   - Report any errors
   - Test on different Android versions

## Need Help?

If you're still having issues:

1. **Check Android logs:**

   ```bash
   adb logcat -s OverlayService NotificationListenerPlugin
   ```

2. **Check browser console:**

   - Look for error messages
   - Check if user is authenticated
   - Verify categories are loaded

3. **Share the error:**
   - Copy the full error message
   - Include console logs
   - Include logcat output

The fix is in place - you just need to test it on a real Android device! 🚀
