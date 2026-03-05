# KeyStatusOverview Component

## Overview

The `KeyStatusOverview` component displays a comprehensive summary of all configured AI provider API keys. It shows status indicators, counts, and overall feature availability for the user-provided AI keys feature.

## Requirements

- **Requirement 3.1**: Display the status of each AI provider key (configured, not configured, or invalid)
- **Requirement 4.5**: Display clear indicators showing which AI features are available based on configured keys

## Features

- **Overall Status Banner**: Shows at-a-glance status with color-coded indicators
  - Green: AI features available (at least one valid key)
  - Amber: Keys need validation (configured but not tested)
  - Red: No keys configured

- **Summary Statistics**: Displays three key metrics
  - Configured: Number of providers with keys added
  - Valid: Number of providers with working keys
  - Total: Total number of supported providers (3)

- **Provider Status List**: Shows individual status for each provider
  - ChatGPT (OpenAI)
  - Groq
  - Gemini (Google)

- **Status Indicators**:
  - 🟢 Active: Key is configured and validated
  - 🔴 Invalid: Key is configured but validation failed
  - 🟡 Not tested: Key is configured but not yet validated
  - ⚪ Not configured: No key added for this provider

- **Benefits Notice**: When no valid keys exist, displays information about why users should provide their own API keys

## Usage

```jsx
import KeyStatusOverview from "./components/settings/KeyStatusOverview";

function AIKeySettings() {
  return (
    <div className="space-y-4">
      <KeyStatusOverview />
      {/* Other settings components */}
    </div>
  );
}
```

## Props

This component does not accept any props. It manages its own state and loads data from the `keyManager`.

## State Management

The component internally manages:

- `keyStatuses`: Object containing status for each provider
- `loading`: Boolean indicating if data is being loaded

## Dependencies

- `keyManager`: For retrieving key statuses
- `PROVIDERS`: Configuration array of supported AI providers
- Lucide React icons: `CheckCircle2`, `XCircle`, `AlertCircle`, `Key`

## Styling

The component uses Tailwind CSS classes and follows the app's design system:

- Card elevation with rounded corners
- Color-coded status indicators
- Responsive grid layout for statistics
- Dark mode support

## Data Flow

1. Component mounts and calls `loadKeyStatuses()`
2. `keyManager.getKeyStatuses()` retrieves status for all providers
3. Component calculates summary statistics
4. UI updates with current status information

## Status Calculation Logic

```javascript
// Configured count: providers with keys added
const configuredCount = Object.values(keyStatuses).filter(
  (status) => status.configured,
).length;

// Valid count: providers with validated keys
const validCount = Object.values(keyStatuses).filter(
  (status) => status.valid === true,
).length;

// Overall status determination
if (validCount > 0) {
  // AI Features Available
} else if (configuredCount > 0) {
  // Keys Need Validation
} else {
  // No Keys Configured
}
```

## Error Handling

- Gracefully handles loading failures
- Displays loading spinner during data fetch
- Logs errors to console without breaking UI

## Accessibility

- Semantic HTML structure
- Color indicators supplemented with text labels
- Loading state with spinner animation

## Testing

See `KeyStatusOverview.test.jsx` for unit tests covering:

- Loading state display
- No keys configured message
- Correct count calculations
- Status indicator display
- Benefits notice visibility

## Related Components

- `KeyCard`: Individual provider key management
- `KeyInputModal`: Add/update API keys
- `ScreenshotToggle`: Enable/disable screenshot monitoring
- `AIKeySettings`: Parent container component

## Future Enhancements

- Add refresh button to manually reload statuses
- Add click handlers to navigate to specific provider settings
- Add animation for status changes
- Add tooltip with last tested timestamp
