// Test Overlay Console Commands
// Open Chrome DevTools (chrome://inspect) and paste these commands

// ============================================
// 1. Test Overlay Popup
// ============================================
console.log("Testing overlay popup...");
window.NotificationListenerPlugin.testOverlay();

// ============================================
// 2. Check Permissions
// ============================================
async function checkPermissions() {
  const status = await window.NotificationListenerPlugin.getPermissionStatus();
  console.log("Permission Status:", status);
  console.log("✅ Notification Access:", status.notificationAccess);
  console.log("✅ Overlay Permission:", status.overlayPermission);
  console.log("✅ All Granted:", status.allGranted);
}
// Run: checkPermissions()

// ============================================
// 3. Check Service Connection
// ============================================
async function checkService() {
  const result = await window.NotificationListenerPlugin.isServiceConnected();
  console.log("Service Connected:", result.connected);
}
// Run: checkService()

// ============================================
// 4. Monitor Expense Save Events
// ============================================
function monitorExpenseSaves() {
  console.log("Monitoring expense save events...");

  window.NotificationListenerPlugin.addListener("expenseSaved", (data) => {
    console.log("=== EXPENSE SAVED EVENT ===");
    console.log("Amount:", data.amount);
    console.log("Category:", data.category);
    console.log("Type:", data.type);
    console.log("Title:", data.title);
    console.log("Text:", data.text);
    console.log("Transaction Timestamp:", new Date(data.transactionTimestamp));
    console.log("Full Data:", data);
  });

  console.log("✅ Monitoring started. Save an expense to see the event.");
}
// Run: monitorExpenseSaves()

// ============================================
// 5. Check User Authentication
// ============================================
function checkAuth() {
  // Access React context (if available)
  const user = window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers
    ?.get(1)
    ?.getCurrentFiber?.()?.return?.memoizedState?.user;

  if (user) {
    console.log("✅ User authenticated:", user.email);
    console.log("User ID:", user.id);
  } else {
    console.log("❌ User not found in context");
    console.log("Try checking manually in React DevTools");
  }
}
// Run: checkAuth()

// ============================================
// 6. Check Categories
// ============================================
function checkCategories() {
  // Access React context (if available)
  const categories = window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers
    ?.get(1)
    ?.getCurrentFiber?.()?.return?.memoizedState?.categories;

  if (categories && categories.length > 0) {
    console.log("✅ Categories loaded:", categories.length);
    categories.forEach((cat) => {
      console.log(`  - ${cat.name} (ID: ${cat.id})`);
    });
  } else {
    console.log("❌ No categories found");
    console.log("Try checking manually in React DevTools");
  }
}
// Run: checkCategories()

// ============================================
// 7. Simulate Expense Save (Manual Test)
// ============================================
async function simulateExpenseSave() {
  console.log("Simulating expense save...");

  // This simulates what the overlay sends
  const testData = {
    package: "com.test.app",
    title: "Test Transaction",
    text: "You spent Rs.100.00 at Test Merchant",
    category: "Food & Dining",
    amount: 100.0,
    type: "debit",
    transactionTimestamp: Date.now(),
    notificationTimestamp: Date.now(),
  };

  console.log("Test data:", testData);

  // Trigger the event manually
  window.dispatchEvent(new CustomEvent("expenseSaved", { detail: testData }));

  console.log("✅ Event dispatched. Check console for processing logs.");
}
// Run: simulateExpenseSave()

// ============================================
// 8. Check Recent Expenses
// ============================================
function checkRecentExpenses() {
  // Access React context (if available)
  const expenses = window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers
    ?.get(1)
    ?.getCurrentFiber?.()?.return?.memoizedState?.expenses;

  if (expenses && expenses.length > 0) {
    console.log("✅ Recent expenses:", expenses.length);
    expenses.slice(0, 5).forEach((exp) => {
      console.log(
        `  - Rs.${exp.amount} - ${exp.description} (${new Date(
          exp.date
        ).toLocaleDateString()})`
      );
    });
  } else {
    console.log("❌ No expenses found");
  }
}
// Run: checkRecentExpenses()

// ============================================
// 9. Full Diagnostic
// ============================================
async function fullDiagnostic() {
  console.log("=== FULL DIAGNOSTIC ===");
  console.log("");

  console.log("1. Checking permissions...");
  await checkPermissions();
  console.log("");

  console.log("2. Checking service connection...");
  await checkService();
  console.log("");

  console.log("3. Checking authentication...");
  checkAuth();
  console.log("");

  console.log("4. Checking categories...");
  checkCategories();
  console.log("");

  console.log("5. Checking recent expenses...");
  checkRecentExpenses();
  console.log("");

  console.log("=== DIAGNOSTIC COMPLETE ===");
}
// Run: fullDiagnostic()

// ============================================
// 10. Enable Verbose Logging
// ============================================
function enableVerboseLogging() {
  console.log("Enabling verbose logging...");

  // Override console methods to add timestamps
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  console.log = function (...args) {
    originalLog.apply(console, [`[${new Date().toISOString()}]`, ...args]);
  };

  console.error = function (...args) {
    originalError.apply(console, [`[${new Date().toISOString()}] ❌`, ...args]);
  };

  console.warn = function (...args) {
    originalWarn.apply(console, [`[${new Date().toISOString()}] ⚠️`, ...args]);
  };

  console.log("✅ Verbose logging enabled");
}
// Run: enableVerboseLogging()

// ============================================
// QUICK START
// ============================================
console.log(`
=== OVERLAY TEST COMMANDS ===

Quick Commands:
1. Test overlay:           window.NotificationListenerPlugin.testOverlay()
2. Check permissions:      checkPermissions()
3. Check service:          checkService()
4. Monitor saves:          monitorExpenseSaves()
5. Full diagnostic:        fullDiagnostic()

Debugging:
- Check auth:              checkAuth()
- Check categories:        checkCategories()
- Check expenses:          checkRecentExpenses()
- Enable verbose logs:     enableVerboseLogging()

Copy and paste any command above into the console!
`);
