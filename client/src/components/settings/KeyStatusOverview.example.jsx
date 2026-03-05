/**
 * KeyStatusOverview Component Usage Example
 *
 * This example demonstrates how to use the KeyStatusOverview component
 * in the AI Key Settings page.
 */

import KeyStatusOverview from "./KeyStatusOverview";

// Example 1: Basic usage in AI Key Settings page
function AIKeySettingsPage() {
  return (
    <div className="space-y-4">
      {/* Display the overview at the top of the settings page */}
      <KeyStatusOverview />

      {/* Other components like KeyCard, ScreenshotToggle, etc. */}
      {/* ... */}
    </div>
  );
}

// Example 2: Usage with refresh functionality
function AIKeySettingsWithRefresh() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleKeyUpdate = () => {
    // After adding/removing/testing a key, trigger a refresh
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      {/* Pass key prop to force re-render and reload statuses */}
      <KeyStatusOverview key={refreshKey} />

      {/* Pass handleKeyUpdate to child components */}
      <KeyManagementList onKeyUpdate={handleKeyUpdate} />
    </div>
  );
}

// Example 3: Standalone usage for dashboard widget
function DashboardAIStatus() {
  return (
    <div className="max-w-md">
      <KeyStatusOverview />
    </div>
  );
}

export { AIKeySettingsPage, AIKeySettingsWithRefresh, DashboardAIStatus };
