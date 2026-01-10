# Test Background Expense Save

## Quick Test Steps

### 1. Rebuild the App

```bash
cd client
npm run build
npx cap sync android
npx cap open android
```

### 2. Install on Device

- Build and install the APK on your Android device
- Make sure you're logged in

### 3. Test Background Save

#### Method 1: Using Test Notification

1. Open the app
2. Go to Settings → Notifications
3. Tap "Test Notification Popup"
4. Press Home button to background the app
5. Wait for the popup to appear
6. Select a category and tap "Save"
7. Open the app and check Expenses page

#### Method 2: Using Real Notification

1. Open the app and ensure notification listener is enabled
2. Press Home button to background the app
3. Make a payment using GPay/PhonePe/WhatsApp
4. When the popup appears, select category and save
5. Open the app and check if expense is saved

### 4. Check Logs

#### Using Android Studio Logcat

```bash
# Filter for Money Manager logs
adb logcat | grep -E "(SMSContext|OverlayService|NotificationListenerPlugin|Supabase)"
```

#### Look for these success indicators:

```
✅ Active session found: user@example.com
✅ Session expires at: [timestamp]
✅ User profile loaded: user@example.com
✅ Session verified for user: user@example.com
💾 Final expense data: [data]
✅ Expense created successfully: [expense]
```

#### Look for these error indicators:

```
❌ No active session found
❌ Invalid amount in overlay data
❌ No category in overlay data
❌ Failed to save expense
❌ Error creating expense
```

### 5. Verify in Database

#### Check Supabase Dashboard

1. Go to your Supabase project
2. Navigate to Table Editor → Expense
3. Look for the most recent expense
4. Verify:
   - `amount` is correct
   - `categoryId` is set
   - `source` is "NOTIFICATION"
   - `userId` matches your user
   - `date` is correct
   - `notes` contains the SMS text

### 6. Common Issues and Solutions

#### Issue: "No active session found"

**Solution:**

- Make sure you're logged in before backgrounding
- Check if session persistence is enabled in supabase.js
- Try logging out and logging back in

#### Issue: "Failed to save expense" with RLS error

**Solution:**

- Run `fix_rls_policies.sql` in Supabase SQL Editor
- Verify your User table has correct googleId or email
- Check if RLS is enabled on Expense table

#### Issue: Expense saves but doesn't appear in UI

**Solution:**

- Check if the "refreshExpenses" event is being dispatched
- Verify DataContext is listening for the event
- Try manually refreshing the Expenses page

#### Issue: Category is null in database

**Solution:**

- Check if categories exist for your user
- Verify category mapping logic in SMSContext
- Check console logs for category mapping messages

## Expected Console Output

### Successful Save

```
💾 Handling expense saved from overlay: {amount: 100, category: "Food & Dining", ...}
✅ Active session found: user@example.com
✅ Session expires at: Thu Jan 09 2026 10:30:00
✅ User profile loaded: user@example.com
📋 Available categories: ["Food", "Transport", "Shopping", ...]
🎯 Overlay category: Food & Dining
✅ Mapped "Food & Dining" to "Food" (ID: 123)
📅 Timestamp: 1736345678000
📅 ISO Date: 2026-01-08T12:34:38.000Z
💾 Final expense data: {amount: 100, categoryId: 123, source: "NOTIFICATION", ...}
👤 User ID: 456
🔐 Session user ID: abc-def-ghi
🔐 Verifying auth before save...
✅ Auth verified, proceeding with save
🔄 Creating expense: {amount: 100, categoryId: 123, ...}
✅ Session verified for user: user@example.com
🔄 Expense with timestamps and defaults: {...}
✅ Expense created successfully: {id: 789, amount: 100, ...}
```

### Failed Save (No Session)

```
💾 Handling expense saved from overlay: {amount: 100, category: "Food & Dining", ...}
❌ No active session found
⚠️ User needs to be logged in. AuthUser from context: null
```

### Failed Save (Database Error)

```
💾 Handling expense saved from overlay: {amount: 100, category: "Food & Dining", ...}
✅ Active session found: user@example.com
...
❌ Failed to save expense: [Error details]
❌ Error details: {
  message: "new row violates row-level security policy",
  code: "42501",
  details: null,
  hint: null
}
```

## Performance Check

The save operation should complete in:

- **< 500ms** for successful save
- **< 100ms** for validation errors
- **< 200ms** for session retrieval

If it takes longer, check:

- Network connectivity
- Supabase response time
- Database query performance

## Automated Test (Optional)

You can create an automated test using adb:

```bash
#!/bin/bash
# test-background-save.sh

echo "Starting background save test..."

# Launch app
adb shell am start -n com.moneymanager.app/.MainActivity

# Wait for app to load
sleep 3

# Background the app
adb shell input keyevent KEYCODE_HOME

# Trigger test notification (if you have a test button)
# adb shell am broadcast -a com.moneymanager.app.TEST_NOTIFICATION

# Wait for user to interact with popup
echo "Please interact with the popup and save the expense"
read -p "Press Enter when done..."

# Check logs for success
adb logcat -d | grep "Expense created successfully"

if [ $? -eq 0 ]; then
    echo "✅ Test PASSED - Expense saved successfully"
else
    echo "❌ Test FAILED - Check logs for errors"
    adb logcat -d | grep -E "(❌|Error)"
fi
```

## Success Criteria

- [ ] Popup appears when app is backgrounded
- [ ] Category selection works
- [ ] Save button triggers save operation
- [ ] Console shows "✅ Expense created successfully"
- [ ] Expense appears in Supabase database
- [ ] Expense appears in app UI after refresh
- [ ] No error messages in console
- [ ] Save completes in < 500ms

## Rollback Plan

If the fix doesn't work, you can rollback by:

1. Reverting the changes in SMSContext.jsx:

   - Remove fresh session retrieval
   - Use authUser from context

2. Reverting the changes in dataService.js:

   - Remove session verification

3. Check the git history:
   ```bash
   git log --oneline client/src/context/SMSContext.jsx
   git checkout <commit-hash> client/src/context/SMSContext.jsx
   ```

## Next Steps After Testing

1. If test passes:

   - Mark BACKGROUND_EXPENSE_SAVE_FIX.md as complete
   - Update READY_TO_TEST.md
   - Deploy to production

2. If test fails:
   - Review error logs
   - Check Supabase dashboard for clues
   - Verify RLS policies
   - Check user authentication state
   - Review the troubleshooting section

## Contact

If you encounter issues not covered here, check:

- BACKGROUND_EXPENSE_SAVE_FIX.md for technical details
- Supabase logs for database errors
- Android Logcat for native errors
