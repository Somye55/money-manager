# 📱 Processing Indicators - User Guide

## What You'll See

When the app processes expenses in the background, you'll see small toast notifications at the bottom of your screen.

## Screenshot Processing

### Step 1: Take Screenshot

You take a screenshot of a payment confirmation in any app (GPay, PhonePe, Swiggy, etc.)

### Step 2: Processing Starts

**Immediately**, you'll see a toast at the bottom:

```
┌─────────────────────────────────┐
│  📸 Processing screenshot...    │
└─────────────────────────────────┘
```

This appears for 2 seconds, then disappears automatically.

### Step 3: Processing Happens

The app is now:

- Extracting text from your screenshot (ML Kit OCR)
- Parsing amount and merchant (Groq AI)
- Preparing the expense popup

This takes 3-5 seconds.

### Step 4: Popup Appears

The expense popup appears with:

- Amount (automatically extracted)
- Merchant name
- Category selection
- Save button

## Notification Processing

### Step 1: Notification Received

You receive a financial notification (bank SMS, UPI payment, etc.)

### Step 2: Processing Starts

**Immediately**, you'll see a toast at the bottom:

```
┌─────────────────────────────────┐
│  💳 Processing transaction...   │
└─────────────────────────────────┘
```

This appears for 2 seconds, then disappears automatically.

### Step 3: Processing Happens

The app is now:

- Parsing the notification text
- Extracting amount and merchant
- Preparing the expense popup

This takes 1-2 seconds.

### Step 4: Popup Appears

The expense popup appears with parsed details.

## Error Messages

### OCR Failed

If the screenshot doesn't contain payment information:

```
┌─────────────────────────────────────────────────┐
│  ❌ Could not extract expense from screenshot   │
└─────────────────────────────────────────────────┘
```

**What this means**: The screenshot didn't have clear payment information. Try taking a clearer screenshot of the payment confirmation screen.

### Missing Overlay Permission

If you haven't granted overlay permission:

```
┌─────────────────────────────────────────────────┐
│  ⚠️ Enable overlay permission to see popup     │
└─────────────────────────────────────────────────┘
```

**What to do**:

1. Go to Settings → Apps → Money Manager
2. Find "Display over other apps"
3. Toggle it ON
4. Try again

## Visual Timeline

### Screenshot Flow

```
0s:  📸 Take screenshot
     ↓
0s:  Toast: "📸 Processing screenshot..."
     ↓
1s:  [ML Kit extracting text...]
     ↓
2s:  [Groq AI parsing...]
     ↓
3s:  [Preparing popup...]
     ↓
4s:  💰 Popup appears!
```

### Notification Flow

```
0s:  📱 Notification received
     ↓
0s:  Toast: "💳 Processing transaction..."
     ↓
1s:  [Parsing text...]
     ↓
2s:  💰 Popup appears!
```

## What the Toasts Look Like

### Location

Toasts appear at the **bottom center** of your screen, above the navigation bar.

### Duration

Each toast stays visible for **2 seconds**, then fades away automatically.

### Style

- Dark background
- White text
- Emoji prefix for quick recognition
- Short, clear message

### Examples

**Processing:**

```
┌─────────────────────────────────┐
│  📸 Processing screenshot...    │
└─────────────────────────────────┘
```

**Success:**
(No toast - popup appears directly)

**Error:**

```
┌─────────────────────────────────────────────────┐
│  ❌ Could not extract expense from screenshot   │
└─────────────────────────────────────────────────┘
```

**Warning:**

```
┌─────────────────────────────────────────────────┐
│  ⚠️ Enable overlay permission to see popup     │
└─────────────────────────────────────────────────┘
```

## Why These Toasts?

### Feedback

You know immediately that the app detected your screenshot or notification.

### Confidence

You're not left wondering "Did it work?" or "Is it processing?"

### Transparency

You understand what's happening in the background.

### Non-Intrusive

The toast doesn't interrupt what you're doing. It appears briefly and disappears automatically.

## Common Scenarios

### Scenario 1: Quick Payment

```
1. Pay ₹500 on Google Pay
2. Take screenshot
3. See toast: "📸 Processing screenshot..."
4. Continue using your phone
5. 4 seconds later: Popup appears
6. Select category, tap Save
7. Done!
```

### Scenario 2: Multiple Screenshots

```
1. Take screenshot of Swiggy order
2. See toast: "📸 Processing screenshot..."
3. Take screenshot of GPay payment
4. See toast: "📸 Processing screenshot..."
5. First popup appears (Swiggy)
6. Save it
7. Second popup appears (GPay)
8. Save it
9. Both expenses saved!
```

### Scenario 3: Wrong Screenshot

```
1. Accidentally take screenshot of home screen
2. See toast: "📸 Processing screenshot..."
3. Wait 4 seconds
4. See toast: "❌ Could not extract expense..."
5. No popup appears (as expected)
6. No problem - just ignore it
```

## Tips

### Best Practices

1. **Wait for the toast** - It confirms the app detected your screenshot
2. **Don't worry if you miss it** - The popup will still appear
3. **Multiple screenshots are fine** - Each will be processed
4. **Errors are okay** - Just try again with a clearer screenshot

### What to Screenshot

✅ Payment confirmation screens
✅ Transaction success messages
✅ UPI receipts
✅ Order confirmations with amounts

❌ Shopping carts (before payment)
❌ Product listings
❌ App home screens

## Troubleshooting

### "I don't see any toast"

**Possible reasons:**

1. Screenshot monitoring is disabled → Enable it in Settings
2. Notification monitoring is disabled → Enable it in Settings
3. App is not running → Open the app once to start services

### "I see the toast but no popup"

**Possible reasons:**

1. Overlay permission not granted → Enable in Settings
2. OCR failed (no amount found) → Try clearer screenshot
3. Processing is still happening → Wait a few more seconds

### "Toast appears but says error"

**This is normal!** It means:

- The screenshot didn't have payment info, OR
- You need to enable overlay permission

Just follow the error message instructions.

## Summary

**Processing Indicators** = Small toast notifications that tell you:

- ✅ When the app is processing your screenshot
- ✅ When the app is processing a notification
- ✅ If something went wrong
- ✅ What to do to fix it

**Benefits**:

- You're always informed
- No guessing if it's working
- Clear error messages
- Non-intrusive design

**Enjoy automatic expense tracking with clear feedback!** 📸💰
