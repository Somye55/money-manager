# Screenshot Monitoring Feature

## Overview

Automatically detect and process screenshots to extract expense information using ML Kit OCR and Groq AI parsing.

## How It Works

1. **User takes a screenshot** of any payment screen (UPI apps, food delivery, e-commerce, etc.)
2. **ScreenshotListenerService** detects the new screenshot via ContentObserver
3. **ML Kit OCR** extracts text from the screenshot
4. **Groq AI** parses the text to extract amount, merchant, and transaction type
5. **Overlay popup** appears with parsed data for category selection
6. **User confirms** and expense is saved to database

## Implementation Details

### Android Components

#### 1. ScreenshotListenerService.java

- Monitors MediaStore for new screenshots
- Checks if screenshot monitoring is enabled in settings
- Processes screenshots with OCRProcessor
- Shows overlay popup with results

#### 2. ScreenshotListenerPlugin.java

- Capacitor plugin for React integration
- Methods:
  - `startListener()` - Start monitoring
  - `stopListener()` - Stop monitoring
  - `checkPermissions()` - Check storage permission
  - `requestPermissions()` - Request storage permission
  - `setScreenshotMonitoring(enabled)` - Enable/disable monitoring
  - `getScreenshotMonitoring()` - Get current state

#### 3. MainActivity.java

- Starts screenshot listener on app launch if enabled
- Restarts listener on app resume

### React Components

#### 1. screenshotService.js

JavaScript wrapper for the Capacitor plugin with methods:

- `isAvailable()` - Check if feature is available
- `checkPermissions()` - Check storage permission
- `requestPermissions()` - Request storage permission
- `startListener()` - Start monitoring
- `stopListener()` - Stop monitoring
- `setScreenshotMonitoring(enabled)` - Toggle monitoring
- `getScreenshotMonitoring()` - Get current state

#### 2. AutomationSettings.jsx

Settings UI with:

- Permission request button
- Enable/disable toggle
- Status indicators
- Instructions for users

## Settings Storage

Settings are stored in Android SharedPreferences:

- Key: `screenshot_monitoring_enabled`
- Type: Boolean
- Default: false

## Permissions Required

1. **READ_MEDIA_IMAGES** (Android 13+) or **READ_EXTERNAL_STORAGE** (Android 12 and below)
   - Required to access screenshots from MediaStore
2. **Display Over Other Apps**
   - Required to show overlay popup with expense details

## User Flow

1. Go to Settings → Automation
2. Scroll to "Screenshot Monitoring" section
3. Tap "Grant Permission" to allow storage access
4. Toggle ON to enable monitoring
5. Take a screenshot of any payment screen
6. Popup appears automatically with parsed expense data
7. Select category and save

## Technical Features

- **Throttling**: 2-second minimum between processing to avoid duplicates
- **Pattern Detection**: Identifies screenshots by filename patterns
- **Settings Check**: Only processes if enabled in settings
- **Permission Validation**: Checks permissions before processing
- **Foreground Service**: Runs as foreground service for reliability
- **Auto-restart**: Restarts on app launch and resume

## Testing

1. Enable screenshot monitoring in settings
2. Take a screenshot of a payment confirmation
3. Verify popup appears with correct amount and merchant
4. Test with different apps (GPay, PhonePe, Swiggy, Amazon, etc.)
5. Verify toggle OFF stops processing

## Benefits

- **Zero manual entry**: Completely automatic expense capture
- **Works with any app**: Processes any screenshot with payment info
- **Accurate parsing**: Groq AI provides high accuracy
- **Instant feedback**: Popup appears immediately after screenshot
- **User control**: Can be enabled/disabled anytime

## Future Enhancements

- Batch processing of multiple screenshots
- Screenshot history/gallery
- Custom OCR regions
- Confidence threshold settings
- Auto-categorization based on merchant
