// Test Plugin Access - Paste this in DevTools console

console.log("=== TESTING PLUGIN ACCESS ===");

// Method 1: Check Capacitor.Plugins
console.log("\n1. Checking Capacitor.Plugins:");
if (window.Capacitor && window.Capacitor.Plugins) {
  console.log("Available plugins:", Object.keys(window.Capacitor.Plugins));

  if (window.Capacitor.Plugins.NotificationListenerPlugin) {
    console.log("✅ Found via Capacitor.Plugins.NotificationListenerPlugin");
    window.NotificationListenerPlugin =
      window.Capacitor.Plugins.NotificationListenerPlugin;
  } else {
    console.log("❌ Not found in Capacitor.Plugins");
  }
} else {
  console.log("❌ Capacitor.Plugins not available");
}

// Method 2: Check window directly
console.log("\n2. Checking window.NotificationListenerPlugin:");
if (window.NotificationListenerPlugin) {
  console.log("✅ Found on window");
} else {
  console.log("❌ Not found on window");
}

// Method 3: Try to import dynamically
console.log("\n3. Trying dynamic import:");
import("./lib/notificationPlugin.js")
  .then((module) => {
    console.log("✅ Module imported:", module);
    window.NotificationListenerPlugin = module.default;
    console.log("✅ Plugin exposed to window");

    // Test it
    console.log("\n=== TESTING PLUGIN ===");
    testPlugin();
  })
  .catch((err) => {
    console.log("❌ Import failed:", err);
    console.log("\nTrying alternative method...");

    // Method 4: Use Capacitor registerPlugin
    if (window.Capacitor) {
      const { registerPlugin } = window.Capacitor;
      const plugin = registerPlugin("NotificationListenerPlugin");
      window.NotificationListenerPlugin = plugin;
      console.log("✅ Plugin registered via Capacitor.registerPlugin");
      testPlugin();
    }
  });

async function testPlugin() {
  try {
    console.log("\nTesting plugin methods...");

    // Test 1: Check permissions
    const permStatus =
      await window.NotificationListenerPlugin.getPermissionStatus();
    console.log("✅ getPermissionStatus works:", permStatus);

    // Test 2: Check service connection
    const serviceStatus =
      await window.NotificationListenerPlugin.isServiceConnected();
    console.log("✅ isServiceConnected works:", serviceStatus);

    // Test 3: Try test overlay
    console.log("\nReady to test overlay!");
    console.log("Run: window.NotificationListenerPlugin.testOverlay()");
  } catch (error) {
    console.error("❌ Plugin test failed:", error);
  }
}

console.log("\n=== WAITING FOR RESULTS ===");
