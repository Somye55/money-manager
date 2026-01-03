import { useState, useEffect } from "react";
import { useSMS } from "../../context/SMSContext";
import { Smartphone, RefreshCw, Loader, Check } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useData } from "../../context/DataContext";

const AutomationSettings = () => {
  const {
    isSupported,
    permissionGranted: smsGranted,
    notifPermissionGranted,
    requestSMSPermission,
    requestNotificationPermission,
    scanSMS,
    scanning,
  } = useSMS();
  const { settings, modifySettings } = useData();
  const [serviceConnected, setServiceConnected] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [selectedApps, setSelectedApps] = useState([]);

  useEffect(() => {
    if (settings) {
      setSelectedApps(
        settings.selectedApps || [
          "com.whatsapp",
          "com.google.android.apps.messaging",
        ]
      );
    }
  }, [settings]);

  useEffect(() => {
    const checkConnection = async () => {
      if (isSupported && notifPermissionGranted) {
        try {
          const smsService = (await import("../../lib/smsService")).default;
          const connected = await smsService.isNotificationServiceConnected();
          setServiceConnected(connected);
        } catch (error) {
          console.error("Error checking service connection:", error);
        }
      }
    };
    checkConnection();
  }, [isSupported, notifPermissionGranted]);

  const handleSMSRequest = async () => {
    try {
      const granted = await requestSMSPermission();
      if (granted) {
        setScanMessage("✓ SMS Permission granted!");
      } else {
        setScanMessage("⚠️ SMS Permission denied. Check app settings.");
      }
    } catch (e) {
      setScanMessage(
        `❌ Error: ${e.message || "Failed to request permission"}`
      );
    }
    setTimeout(() => setScanMessage(""), 5000);
  };

  const handleNotifRequest = async () => {
    try {
      await requestNotificationPermission();
      setScanMessage("✓ Opening settings. Please enable notification access.");
    } catch (e) {
      setScanMessage(`⚠️ ${e.message || "Please grant required permissions"}`);
    }
    setTimeout(() => setScanMessage(""), 7000);
  };

  const handleManualScan = async () => {
    try {
      const results = await scanSMS(30);
      setScanMessage(`✓ Scan complete! Found ${results.length} expenses.`);
    } catch (err) {
      setScanMessage("❌ Scan failed.");
    }
    setTimeout(() => setScanMessage(""), 3000);
  };

  const handleAppSelectionChange = async (apps) => {
    setSelectedApps(apps);
    try {
      await modifySettings({ selectedApps: apps });
      const smsService = (await import("../../lib/smsService")).default;
      await smsService.setSelectedApps(apps);
    } catch (error) {
      console.error("Error updating selected apps:", error);
    }
  };

  const availableApps = [
    { package: "com.whatsapp", name: "WhatsApp", icon: "MessageCircle" },
    {
      package: "com.google.android.apps.messaging",
      name: "Messages",
      icon: "MessageSquare",
    },
    { package: "org.telegram.messenger", name: "Telegram", icon: "Send" },
    {
      package: "com.google.android.apps.nbu.paisa.user",
      name: "Google Pay",
      icon: "CreditCard",
    },
    { package: "com.phonepe.app", name: "PhonePe", icon: "Smartphone" },
    { package: "net.one97.paytm", name: "Paytm", icon: "Wallet" },
    { package: "com.freecharge.android", name: "Freecharge", icon: "Zap" },
    {
      package: "com.amazon.mShop.android.shopping",
      name: "Amazon",
      icon: "ShoppingBag",
    },
    { package: "com.sbi.lotus", name: "SBI YONO", icon: "Banknote" },
    { package: "com.axis.mobile", name: "Axis Mobile", icon: "Banknote" },
    { package: "com.hdfcbank.mobileapp", name: "HDFC Bank", icon: "Banknote" },
  ];

  if (!isSupported) {
    return (
      <div className="space-y-4">
        <div className="card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card p-6">
          <p className="text-muted-foreground text-center">
            Automation features are only available on mobile devices
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scanMessage && (
        <div className="mb-4 p-3 rounded-xl bg-primary/10 text-primary text-sm font-medium animate-slide-up">
          {scanMessage}
        </div>
      )}

      {/* SMS Permission */}
      <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            Read SMS Database
            {smsGranted ? (
              <span className="text-xs bg-emerald-500/20 text-emerald-600 px-3 py-1.5 rounded-full font-bold">
                ✓ Enabled
              </span>
            ) : (
              <span className="text-xs bg-rose-500/20 text-rose-600 px-3 py-1.5 rounded-full font-bold">
                ✗ Disabled
              </span>
            )}
          </h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Scan past SMS messages for bank transactions
          </p>
          {!smsGranted && (
            <div className="text-xs bg-secondary/50 border border-border p-4 rounded-xl mb-4">
              <p className="font-semibold mb-2 text-foreground">
                How to enable:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Tap "Enable" button below</li>
                <li>Allow SMS permission when prompted</li>
                <li>Return to app to start scanning</li>
              </ol>
            </div>
          )}
          {smsGranted ? (
            <button
              onClick={handleManualScan}
              disabled={scanning}
              className="w-full py-3 px-6 rounded-xl bg-secondary text-secondary-foreground font-semibold transition-smooth hover:bg-secondary/80 flex items-center justify-center gap-2"
            >
              {scanning ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Scan Past SMS (30 Days)
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleSMSRequest}
              className="w-full py-3 px-6 rounded-xl btn-gradient-primary font-semibold"
            >
              Enable SMS Permission
            </button>
          )}
        </div>
      </div>

      {/* Notification Permission */}
      <div
        className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            Read Notifications
            {notifPermissionGranted ? (
              serviceConnected ? (
                <span className="text-xs bg-emerald-500/20 text-emerald-600 px-3 py-1.5 rounded-full font-bold">
                  ✓ Connected
                </span>
              ) : (
                <span className="text-xs bg-amber-500/20 text-amber-600 px-3 py-1.5 rounded-full font-bold">
                  ⚠ Enabled but not connected
                </span>
              )
            ) : (
              <span className="text-xs bg-rose-500/20 text-rose-600 px-3 py-1.5 rounded-full font-bold">
                ✗ Disabled
              </span>
            )}
          </h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Real-time tracking from WhatsApp, GPay, Paytm, PhonePe
          </p>
          {!notifPermissionGranted && (
            <div className="text-xs bg-secondary/50 border border-border p-4 rounded-xl mb-4">
              <p className="font-semibold mb-2 text-foreground">
                How to enable:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Tap "Enable" button below</li>
                <li>Find "Money Manager" in the list</li>
                <li>Toggle ON notification access</li>
                <li>Return to app</li>
              </ol>
            </div>
          )}
          {notifPermissionGranted ? (
            <div className="flex gap-2">
              <button
                onClick={handleNotifRequest}
                className="flex-1 py-3 px-4 rounded-xl bg-secondary text-secondary-foreground font-semibold transition-smooth hover:bg-secondary/80"
              >
                Manage Settings
              </button>
              <button
                onClick={async () => {
                  try {
                    const NotificationListenerPlugin = (
                      await import("../../lib/notificationPlugin")
                    ).default;
                    const status =
                      await NotificationListenerPlugin.getPermissionStatus();
                    if (!status.overlayPermission) {
                      setScanMessage(
                        "⚠️ Please enable 'Display over other apps' permission first"
                      );
                      await NotificationListenerPlugin.requestOverlayPermission();
                      return;
                    }
                    const result =
                      await NotificationListenerPlugin.testOverlay();
                    if (result.success) {
                      setScanMessage(
                        "✓ Test popup triggered! Check your screen."
                      );
                    } else {
                      setScanMessage(
                        "❌ Failed: " + (result.error || "Unknown error")
                      );
                    }
                  } catch (e) {
                    setScanMessage("❌ Error: " + e.message);
                  }
                  setTimeout(() => setScanMessage(""), 5000);
                }}
                className="flex-1 py-3 px-4 rounded-xl btn-gradient-success font-semibold text-white"
              >
                Test Popup
              </button>
            </div>
          ) : (
            <button
              onClick={handleNotifRequest}
              className="w-full py-3 px-6 rounded-xl btn-gradient-primary font-semibold"
            >
              Enable Notification Access
            </button>
          )}
        </div>
      </div>

      {/* App Selection */}
      <div
        className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Select Apps to Monitor
          </h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Choose which apps to listen for SMS notifications from
          </p>
          <div className="grid grid-cols-2 gap-3">
            {availableApps.map((app) => {
              const Icon = LucideIcons[app.icon] || Smartphone;
              const isSelected = selectedApps.includes(app.package);
              return (
                <button
                  key={app.package}
                  onClick={() => {
                    const newSelected = isSelected
                      ? selectedApps.filter((p) => p !== app.package)
                      : [...selectedApps, app.package];
                    handleAppSelectionChange(newSelected);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-smooth ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30 bg-secondary/50"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }
                  />
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {app.name}
                  </span>
                  {isSelected && (
                    <Check size={16} className="text-primary ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Display Over Other Apps Permission */}
      <div
        className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card"
        style={{ animationDelay: "0.15s" }}
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Display Over Other Apps
          </h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Show expense popups when transactions are detected
          </p>
          <div className="text-xs bg-secondary/50 border border-border p-4 rounded-xl mb-4">
            <p className="font-semibold mb-2 text-foreground">How to enable:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Go to Settings → Apps → Money Manager</li>
              <li>Find "Display over other apps" or "Draw over other apps"</li>
              <li>Toggle ON the permission</li>
              <li>Return to app and test</li>
            </ol>
          </div>
          <button
            onClick={async () => {
              try {
                const NotificationListenerPlugin = (
                  await import("../../lib/notificationPlugin")
                ).default;
                await NotificationListenerPlugin.requestOverlayPermission();
                setScanMessage("Opening overlay permission settings...");
              } catch (e) {
                setScanMessage("❌ Error: " + e.message);
              }
              setTimeout(() => setScanMessage(""), 3000);
            }}
            className="w-full py-3 px-6 rounded-xl btn-gradient-primary font-semibold"
          >
            Open Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomationSettings;
