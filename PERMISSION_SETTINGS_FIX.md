# Permission Settings Fix

## Changes Made

Fixed Android permission settings to properly open app-specific settings pages and display accurate permission status indicators.

### 1. SettingsHelper.java

**Fixed:** `openOverlaySettings()` method

- **Before:** Opened generic overlay permission settings (all apps)
- **After:** Opens app-specific overlay permission settings with package URI
- Added missing `Uri` import

### 2. ScreenshotListenerPlugin.java

**Added:** `openAppSettings()` method

- Opens the app's detailed settings page where users can manage all permissions
- Useful for screenshot monitoring (READ_MEDIA_IMAGES/READ_EXTERNAL_STORAGE)
- Includes proper error handling and logging

### 3. AutomationSettings.jsx

**Added:** Overlay permission status checking and display

- Added `overlayPermission` state to track permission status
- Added visual indicator (✓ Enabled / ✗ Disabled) in the section header
- Checks permission status on component mount
- Rechecks permissions when app becomes visible (after returning from settings)
- Shows appropriate UI based on permission state:
  - When disabled: Shows instructions and "Open Settings" button
  - When enabled: Shows success message with green checkmark
- Auto-refreshes permission status after opening settings

**Enhanced:** Permission status refresh

- Added `visibilitychange` event listener to recheck all permissions when user returns to app
- Automatically updates UI when permissions are granted in system settings
- Applies to all permissions: SMS, Notifications, Overlay, and Screenshot

## Technical Details

### Overlay Permission (Android)

```java
// Now correctly targets this app
Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:" + getContext().getPackageName()));
```

### App Settings (Android)

```java
// Opens app-specific settings page
Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
intent.setData(Uri.parse("package:" + getContext().getPackageName()));
```

### Permission Status Display (React)

```jsx
// Visual indicator in section header
{
  overlayPermission ? (
    <span className="text-xs bg-emerald-500/20 text-emerald-600 px-3 py-1.5 rounded-full font-bold">
      ✓ Enabled
    </span>
  ) : (
    <span className="text-xs bg-rose-500/20 text-rose-600 px-3 py-1.5 rounded-full font-bold">
      ✗ Disabled
    </span>
  );
}
```

## Usage

### From JavaScript/TypeScript:

```javascript
// Open overlay permission settings (app-specific)
await SettingsHelper.openOverlaySettings();

// Open notification listener settings
await SettingsHelper.openNotificationSettings();

// Open app settings page (for screenshot permissions)
await ScreenshotListener.openAppSettings();

// Check overlay permission status
const status = await NotificationListenerPlugin.getPermissionStatus();
console.log(status.overlayPermission); // true or false
```

## Benefits

1. **Better UX:** Users go directly to the app's permission page
2. **Less confusion:** No need to search for the app in a list
3. **Faster:** One less step for users to grant permissions
4. **Consistent:** All permission settings now properly target the app
5. **Real-time feedback:** Permission status updates automatically when user returns to app
6. **Clear visual indicators:** Users can see at a glance which permissions are enabled/disabled

## Permission Status Indicators

All permission sections now show clear status badges:

- **SMS Permission:** ✓ Enabled / ✗ Disabled
- **Notification Access:** ✓ Connected / ⚠ Enabled but not connected / ✗ Disabled
- **Screenshot Monitoring:** ✓ Enabled / ✗ Disabled
- **Overlay Permission:** ✓ Enabled / ✗ Disabled

## Testing

After rebuilding the app, verify:

1. All permission sections show correct enabled/disabled status
2. Overlay permission button opens app-specific overlay settings
3. Status indicators update when returning from settings
4. Green checkmarks appear for granted permissions
5. Red X marks appear for denied permissions
6. Instructions only show when permissions are disabled
