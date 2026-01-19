# Share Target Plugin Implementation

## Problem

When sharing an image with the app (from Gallery, GPay, PhonePe, etc.), the dashboard was appearing for a few seconds before redirecting to the OCR Quick Save page. This created a poor user experience.

## Solution

Implemented the `@capgo/capacitor-share-target` plugin to intercept shared content at the native layer and navigate directly to the Quick Save page before any React components render.

## Changes Made

### 1. Installed Plugin

```bash
npm install @capgo/capacitor-share-target --legacy-peer-deps
```

### 2. Updated `client/package.json`

Added Capacitor configuration:

```json
"capacitor": {
  "appId": "com.moneymanager.app",
  "appName": "Money Manager"
}
```

### 3. Updated `client/src/App.jsx`

- Imported `CapacitorShareTarget` from `@capgo/capacitor-share-target`
- Created `ShareIntentHandler` component that:
  - Listens for `shareReceived` events from the plugin
  - Extracts shared image data (URI, name, mimeType)
  - Stores it in sessionStorage
  - Navigates directly to `/quick-save` with `replace: true`
  - Cleans up listener on unmount

### 4. Updated `client/src/pages/QuickSave.jsx`

- Enhanced to check for three data sources:
  1. `window.ocrData` (from MainActivity direct processing)
  2. `sessionStorage.getItem('ocrData')` (OCR results)
  3. `sessionStorage.getItem('sharedImage')` (from Share Target plugin)
- Added `processSharedImage()` function to handle plugin-intercepted images

### 5. Android Manifest

The intent filters were already configured in `AndroidManifest.xml`:

```xml
<intent-filter>
    <action android:name="android.intent.action.SEND" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:mimeType="image/*" />
</intent-filter>
```

## How It Works

### Flow with Share Target Plugin:

1. **User shares image** from Gallery/GPay/PhonePe
2. **Android OS** launches Money Manager app
3. **Share Target Plugin** intercepts the intent immediately
4. **Plugin fires** `shareReceived` event with image data
5. **ShareIntentHandler** catches the event
6. **Stores data** in sessionStorage as `sharedImage`
7. **Navigates** to `/quick-save` with `replace: true`
8. **QuickSave page** loads and checks for shared image data
9. **Processes image** with OCR (via MainActivity)
10. **Displays results** to user

### Key Benefits:

- ✅ **No dashboard flash** - Direct navigation to Quick Save
- ✅ **Seamless UX** - User sees processing screen immediately
- ✅ **Backward compatible** - Still works with MainActivity's direct OCR processing
- ✅ **Clean navigation** - Uses `replace: true` to prevent back button issues

## Testing

Run the test script:

```bash
test-share-target.bat
```

Or manually:

1. Build: `cd client && npm run build`
2. Sync: `npx cap sync android`
3. Build APK: `cd android && gradlew.bat assembleDebug`
4. Install: `gradlew.bat installDebug`

### Test Steps:

1. Open Google Pay or PhonePe
2. Find a transaction screenshot
3. Tap Share button
4. Select "Money Manager" app
5. **Expected**: App opens DIRECTLY to Quick Save page (no dashboard)
6. OCR processes the image
7. Results displayed for confirmation

## Technical Details

### Plugin Event Structure:

```javascript
{
  files: [
    {
      uri: "content://...",
      name: "screenshot.png",
      mimeType: "image/png",
    },
  ];
}
```

### SessionStorage Data:

```javascript
// Shared image from plugin
{
  uri: "content://...",
  name: "screenshot.png",
  mimeType: "image/png",
  timestamp: 1234567890
}

// OCR results from MainActivity
{
  status: "success",
  data: {
    amount: 250.50,
    merchant: "Swiggy",
    type: "debit"
  }
}
```

## Fallback Behavior

If the plugin doesn't intercept (shouldn't happen, but just in case):

1. MainActivity's `handleSharedImage()` still processes the intent
2. Runs OCR on the image
3. Stores results in `sessionStorage.ocrData`
4. Navigates to `/quick-save` via JavaScript
5. QuickSave page picks up the OCR data

## Files Modified

- `client/package.json` - Added plugin and Capacitor config
- `client/src/App.jsx` - Added ShareIntentHandler component
- `client/src/pages/QuickSave.jsx` - Enhanced to handle plugin data
- `test-share-target.bat` - New test script

## Files NOT Modified

- `client/android/app/src/main/AndroidManifest.xml` - Already had correct intent filters
- `client/android/app/src/main/java/com/moneymanager/app/MainActivity.java` - Kept as fallback

## Next Steps

After testing confirms it works:

1. Consider removing MainActivity's direct navigation code (keep OCR processing)
2. Update documentation
3. Test with various image sources (Gallery, GPay, PhonePe, WhatsApp, etc.)
4. Monitor for any edge cases

## Troubleshooting

### If dashboard still appears:

1. Check browser console for plugin logs
2. Verify plugin is registered: `npx cap sync android`
3. Check Android logcat for native logs
4. Ensure intent filters are in the correct `<activity>` tag

### If OCR doesn't work:

1. MainActivity should still process the image
2. Check for `ocrData` in sessionStorage
3. Verify OCR service is running
4. Check network connectivity (for Gemini API)

## References

- Plugin docs: https://capgo.app/docs/plugins/share-target/getting-started/
- Capacitor docs: https://capacitorjs.com/docs
- Android Share Intent: https://developer.android.com/training/sharing/receive
