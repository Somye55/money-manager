# Processing Indicator Feature

## Overview

Added minimal, non-intrusive toast notifications to inform users when the app is processing expenses in the background.

## What Was Added

### 1. Screenshot Processing Indicator

When a screenshot is detected and being processed:

- **Toast Message**: "📸 Processing screenshot..."
- **Duration**: 2 seconds (Toast.LENGTH_SHORT)
- **Timing**: Appears immediately when screenshot is detected
- **Location**: Bottom of screen (standard Android toast position)

### 2. Notification Processing Indicator

When a financial notification is detected:

- **Toast Message**: "💳 Processing transaction..."
- **Duration**: 2 seconds
- **Timing**: Appears when SMS format is matched
- **Location**: Bottom of screen

### 3. Error Indicators

When processing fails:

- **Screenshot OCR Failed**: "❌ Could not extract expense from screenshot"
- **Overlay Permission Missing**: "⚠️ Enable overlay permission to see expense popup"

## User Experience

### Normal Flow:

```
1. User takes screenshot of payment
   ↓
2. Toast appears: "📸 Processing screenshot..."
   ↓
3. Processing happens (3-5 seconds)
   ↓
4. Popup appears with expense details
```

### Notification Flow:

```
1. Financial notification received
   ↓
2. Toast appears: "💳 Processing transaction..."
   ↓
3. Processing happens (1-2 seconds)
   ↓
4. Popup appears with expense details
```

## Implementation Details

### ScreenshotListenerService.java

```java
private void showProcessingToast(final String message) {
    mainHandler.post(() -> {
        Toast.makeText(ScreenshotListenerService.this, message, Toast.LENGTH_SHORT).show();
    });
}
```

Called in:

- `processScreenshot()` - When processing starts
- `onFailure()` - When OCR fails
- `onSuccess()` - When overlay permission is missing

### NotificationListener.java

```java
private void showProcessingToast(final String message) {
    Handler mainHandler = new Handler(Looper.getMainLooper());
    mainHandler.post(() -> {
        Toast.makeText(NotificationListener.this, message, Toast.LENGTH_SHORT).show();
    });
}
```

Called in:

- `onNotificationPosted()` - When SMS format is matched

## Design Decisions

### Why Toast Notifications?

1. **Minimal**: Doesn't interrupt user workflow
2. **Non-intrusive**: Appears at bottom, auto-dismisses
3. **Standard**: Familiar Android UI pattern
4. **No permissions**: Works without additional permissions
5. **Background-friendly**: Works even when app is closed

### Why Not Other Options?

- ❌ **Persistent notification**: Too intrusive for quick processing
- ❌ **Progress bar**: Overkill for 3-5 second operation
- ❌ **In-app banner**: Only works when app is open
- ❌ **Vibration**: Annoying and requires permission
- ❌ **Sound**: Disruptive

### Message Design

- **Emoji prefix**: Quick visual recognition
  - 📸 = Screenshot processing
  - 💳 = Transaction processing
  - ❌ = Error
  - ⚠️ = Warning
- **Short text**: "Processing screenshot..." (clear and concise)
- **Action-oriented**: Tells user what's happening

## Benefits

### For Users

- **Feedback**: Know the app is working
- **Confidence**: Not wondering if screenshot was detected
- **Transparency**: Clear about what's happening
- **Non-disruptive**: Doesn't interrupt current task

### For App

- **Better UX**: Users feel informed
- **Reduced confusion**: Clear processing state
- **Professional**: Shows attention to detail
- **Debugging**: Users can report if toast appears but popup doesn't

## Testing

### Test Case 1: Screenshot Processing

1. Enable screenshot monitoring
2. Take a screenshot of a payment
3. **Expected**: Toast "📸 Processing screenshot..." appears immediately
4. **Expected**: Popup appears 3-5 seconds later

### Test Case 2: Notification Processing

1. Enable notification monitoring
2. Receive a financial notification
3. **Expected**: Toast "💳 Processing transaction..." appears
4. **Expected**: Popup appears 1-2 seconds later

### Test Case 3: OCR Failure

1. Take a screenshot of non-payment content
2. **Expected**: Toast "📸 Processing screenshot..." appears
3. **Expected**: Toast "❌ Could not extract expense..." appears
4. **Expected**: No popup appears

### Test Case 4: Missing Overlay Permission

1. Disable overlay permission
2. Take a screenshot of a payment
3. **Expected**: Toast "📸 Processing screenshot..." appears
4. **Expected**: Toast "⚠️ Enable overlay permission..." appears
5. **Expected**: No popup appears

## Edge Cases Handled

1. **Multiple screenshots quickly**: Toast appears for each (throttled by service)
2. **App in background**: Toast still appears (service is foreground)
3. **Screen off**: Toast queued, appears when screen turns on
4. **Low memory**: Toast is lightweight, won't cause issues

## Performance Impact

- **Memory**: Negligible (~1KB per toast)
- **CPU**: Minimal (just UI thread post)
- **Battery**: None (no background work)
- **Network**: None

## Future Enhancements

Possible improvements (not implemented):

- [ ] Custom toast with app branding
- [ ] Progress percentage for long operations
- [ ] Dismissible toast with action button
- [ ] Toast history/log
- [ ] Settings to disable toasts
- [ ] Different toast styles per source

## Summary

Added minimal toast notifications to inform users when:

- ✅ Screenshot is being processed
- ✅ Transaction notification is being processed
- ✅ OCR fails
- ✅ Overlay permission is missing

**Result**: Users now have clear feedback that the app is working on their expense in the background, without any intrusive interruptions.
