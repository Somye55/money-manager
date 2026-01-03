import { useState, useEffect } from "react";
import { useSMS } from "../../context/SMSContext";
import { Smartphone, RefreshCw, Loader, Check } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
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
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Automation features are only available on mobile devices
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scanMessage && (
        <div className="mb-4 p-3 rounded-xl bg-indigo-500/10 text-indigo-600 text-sm font-medium animate-slide-up">
          {scanMessage}
        </div>
      )}

      {/* SMS Permission */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Read SMS Database
            {smsGranted ? (
              <span className="text-xs bg-emerald-500/20 text-emerald-600 px-2 py-1 rounded-full font-bold">
                ✓ Enabled
              </span>
            ) : (
              <span className="text-xs bg-rose-500/20 text-rose-600 px-2 py-1 rounded-full font-bold">
                ✗ Disabled
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Scan past SMS messages for bank transactions
          </p>
          {!smsGranted && (
            <div className="text-xs bg-secondary p-3 rounded-lg mb-4">
              <p className="font-semibold mb-2">How to enable:</p>
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
              className="btn btn-secondary w-full flex items-center justify-center gap-2"
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
              className="btn btn-primary w-full"
              style={{ background: "var(--gradient-primary)" }}
            >
              Enable SMS Permission
            </button>
          )}
        </CardContent>
      </Card>

      {/* Notification Permission */}
      <Card className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Read Notifications
            {notifPermissionGranted ? (
              serviceConnected ? (
                <span className="text-xs bg-emerald-500/20 text-emerald-600 px-2 py-1 rounded-full font-bold">
                  ✓ Connected
                </span>
              ) : (
                <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-1 rounded-full font-bold">
                  ⚠ Enabled but not connected
                </span>
              )
            ) : (
              <span className="text-xs bg-rose-500/20 text-rose-600 px-2 py-1 rounded-full font-bold">
                ✗ Disabled
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Real-time tracking from WhatsApp, GPay, Paytm, PhonePe
          </p>
          {!notifPermissionGranted && (
            <div className="text-xs bg-secondary p-3 rounded-lg mb-4">
              <p className="font-semibold mb-2">How to enable:</p>
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
                className="btn btn-secondary flex-1"
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
                className="btn flex-1"
                style={{
                  background: "var(--gradient-secondary)",
                  color: "white",
                }}
              >
                Test Popup
              </button>
            </div>
          ) : (
            <button
              onClick={handleNotifRequest}
              className="btn btn-primary w-full"
              style={{ background: "var(--gradient-primary)" }}
            >
              Enable Notification Access
            </button>
          )}
        </CardContent>
      </Card>

      {/* App Selection */}
      <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <CardHeader>
          <CardTitle className="text-base">Select Apps to Monitor</CardTitle>
        </CardHeader>
        <CardContent>
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
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-border hover:border-indigo-300 bg-secondary"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      isSelected ? "text-indigo-600" : "text-muted-foreground"
                    }
                  />
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-indigo-600" : "text-muted-foreground"
                    }`}
                  >
                    {app.name}
                  </span>
                  {isSelected && (
                    <Check size={16} className="text-indigo-600 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Display Over Other Apps Permission */}
      <Card className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
        <CardHeader>
          <CardTitle className="text-base">Display Over Other Apps</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Show expense popups when transactions are detected
          </p>
          <div className="text-xs bg-secondary p-3 rounded-lg mb-4">
            <p className="font-semibold mb-2">How to enable:</p>
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
            className="btn btn-primary w-full"
            style={{ background: "var(--gradient-primary)" }}
          >
            Open Settings
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationSettings;
