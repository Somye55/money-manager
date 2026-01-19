import { useState, useEffect } from "react";
import { useSMS } from "../../context/SMSContext";
import { Smartphone, RefreshCw, Loader, Check, Camera } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useData } from "../../context/DataContext";
import { useToast } from "../ui/use-toast";
import screenshotService from "../../lib/screenshotService";

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
  const { toast } = useToast();
  const [serviceConnected, setServiceConnected] = useState(false);
  const [selectedApps, setSelectedApps] = useState([]);
  const [screenshotEnabled, setScreenshotEnabled] = useState(false);
  const [screenshotPermission, setScreenshotPermission] = useState(false);
  const [screenshotAvailable, setScreenshotAvailable] = useState(false);
  const [overlayPermission, setOverlayPermission] = useState(false);

  useEffect(() => {
    if (settings) {
      setSelectedApps(
        settings.selectedApps || [
          "com.whatsapp",
          "com.google.android.apps.messaging",
        ],
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

    // Check overlay permission
    const checkOverlay = async () => {
      if (isSupported) {
        try {
          const NotificationListenerPlugin = (
            await import("../../lib/notificationPlugin")
          ).default;
          const status = await NotificationListenerPlugin.getPermissionStatus();
          setOverlayPermission(status.overlayPermission || false);
        } catch (error) {
          console.error("Error checking overlay permission:", error);
        }
      }
    };
    checkOverlay();

    // Initialize screenshot monitoring
    const initScreenshot = async () => {
      const available = await screenshotService.isAvailable();
      setScreenshotAvailable(available);

      if (available) {
        const hasPermission = await screenshotService.checkPermissions();
        setScreenshotPermission(hasPermission);

        const enabled = await screenshotService.getScreenshotMonitoring();
        setScreenshotEnabled(enabled);
      }
    };
    initScreenshot();

    // Recheck permissions when app becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkConnection();
        checkOverlay();
        initScreenshot();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isSupported, notifPermissionGranted]);

  const handleSMSRequest = async () => {
    try {
      const granted = await requestSMSPermission();
      if (granted) {
        toast({
          variant: "success",
          title: "SMS Permission granted",
          description: "You can now scan past SMS messages",
        });
      } else {
        toast({
          variant: "error",
          title: "Permission denied",
          description: "Check app settings to enable SMS permission",
        });
      }
    } catch (e) {
      toast({
        variant: "error",
        title: "Permission error",
        description: e.message || "Failed to request permission",
      });
    }
  };

  const handleNotifRequest = async () => {
    try {
      const result = await requestNotificationPermission();
      if (result?.opened) {
        toast({
          variant: "success",
          title: "Opening settings",
          description: "Find 'Money Manager' and enable notification access",
        });
      }
    } catch (e) {
      toast({
        variant: "error",
        title: "Permission error",
        description: e.message || "Please grant required permissions",
      });
    }
  };

  const handleManualScan = async () => {
    try {
      const results = await scanSMS(30);
      toast({
        variant: "success",
        title: "Scan complete",
        description: `Found ${results.length} expenses`,
      });
    } catch (err) {
      toast({
        variant: "error",
        title: "Scan failed",
        description: "Failed to scan SMS messages",
      });
    }
  };

  const handleAppSelectionChange = async (apps) => {
    setSelectedApps(apps);
    try {
      await modifySettings({ selectedApps: apps });
      const smsService = (await import("../../lib/smsService")).default;
      await smsService.setSelectedApps(apps);
      toast({
        variant: "success",
        title: "Apps updated",
        description: "Selected apps have been saved",
      });
    } catch (error) {
      console.error("Error updating selected apps:", error);
      toast({
        variant: "error",
        title: "Update failed",
        description: "Failed to update selected apps",
      });
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
            <>
              {!serviceConnected && (
                <div className="text-xs bg-amber-500/20 border border-amber-500/30 p-4 rounded-xl mb-4">
                  <p className="font-semibold mb-2 text-amber-700 dark:text-amber-400">
                    ⚠ Service Not Connected
                  </p>
                  <p className="text-amber-600 dark:text-amber-300 mb-2">
                    Permission is granted but Android hasn't bound the service.
                  </p>
                  <p className="font-semibold mb-1 text-amber-700 dark:text-amber-400">
                    To fix:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-amber-600 dark:text-amber-300">
                    <li>Click "Manage Settings" below</li>
                    <li>Toggle OFF "Money Manager"</li>
                    <li>Wait 2 seconds</li>
                    <li>Toggle it back ON</li>
                    <li>Return to app</li>
                  </ol>
                </div>
              )}
              <div className="flex gap-2">
                {!serviceConnected && (
                  <button
                    onClick={async () => {
                      try {
                        const result = await requestNotificationPermission();
                        if (result?.opened) {
                          toast({
                            variant: "success",
                            title: "Opening settings",
                            description: "Toggle OFF then ON to reconnect",
                          });
                        }
                      } catch (e) {
                        toast({
                          variant: "error",
                          title: "Error",
                          description: e.message,
                        });
                      }
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-secondary text-secondary-foreground font-semibold transition-smooth hover:bg-secondary/80"
                  >
                    Manage Settings
                  </button>
                )}
                <button
                  onClick={async () => {
                    try {
                      const NotificationListenerPlugin = (
                        await import("../../lib/notificationPlugin")
                      ).default;
                      const status =
                        await NotificationListenerPlugin.getPermissionStatus();
                      if (!status.overlayPermission) {
                        toast({
                          variant: "error",
                          title: "Permission required",
                          description:
                            "Please enable 'Display over other apps' permission first",
                        });
                        await NotificationListenerPlugin.requestOverlayPermission();
                        return;
                      }
                      const result =
                        await NotificationListenerPlugin.testOverlay();
                      if (result.success) {
                        toast({
                          variant: "success",
                          title: "Test successful",
                          description: "Check your screen for the popup",
                        });
                      } else {
                        toast({
                          variant: "error",
                          title: "Test failed",
                          description: result.error || "Unknown error",
                        });
                      }
                    } catch (e) {
                      toast({
                        variant: "error",
                        title: "Test error",
                        description: e.message,
                      });
                    }
                  }}
                  className={`${
                    !serviceConnected ? "flex-1" : "w-full"
                  } py-3 px-4 rounded-xl btn-gradient-success font-semibold text-white`}
                >
                  Test Popup
                </button>
              </div>
            </>
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

      {/* Screenshot Monitoring */}
      {screenshotAvailable && (
        <div
          className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Camera size={20} />
              Screenshot Monitoring
              {screenshotEnabled ? (
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
              Automatically detect and process screenshots for expense
              extraction
            </p>
            <div className="text-xs bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl mb-4">
              <p className="font-semibold mb-2 text-blue-700 dark:text-blue-400">
                📸 How it works:
              </p>
              <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-300">
                <li>Take a screenshot of any payment screen</li>
                <li>App automatically extracts text using ML Kit</li>
                <li>Groq AI parses amount and merchant</li>
                <li>Popup appears for category selection</li>
              </ul>
            </div>
            {!screenshotPermission ? (
              <>
                <div className="text-xs bg-secondary/50 border border-border p-4 rounded-xl mb-4">
                  <p className="font-semibold mb-2 text-foreground">
                    Permission required:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Tap "Grant Permission" below</li>
                    <li>Allow storage/media access</li>
                    <li>Enable screenshot monitoring</li>
                  </ol>
                </div>
                <button
                  onClick={async () => {
                    try {
                      const granted =
                        await screenshotService.requestPermissions();
                      if (granted) {
                        setScreenshotPermission(true);
                        toast({
                          variant: "success",
                          title: "Permission granted",
                          description:
                            "You can now enable screenshot monitoring",
                        });
                      } else {
                        toast({
                          variant: "error",
                          title: "Permission denied",
                          description:
                            "Storage permission is required for screenshot monitoring",
                        });
                      }
                    } catch (e) {
                      toast({
                        variant: "error",
                        title: "Error",
                        description: e.message,
                      });
                    }
                  }}
                  className="w-full py-3 px-6 rounded-xl btn-gradient-primary font-semibold"
                >
                  Grant Permission
                </button>
              </>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                <div>
                  <p className="font-semibold text-foreground">
                    {screenshotEnabled
                      ? "Monitoring Active"
                      : "Enable Monitoring"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {screenshotEnabled
                      ? "Screenshots will be processed automatically"
                      : "Turn on to start monitoring screenshots"}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      const newState = !screenshotEnabled;
                      const success =
                        await screenshotService.setScreenshotMonitoring(
                          newState,
                        );
                      if (success) {
                        setScreenshotEnabled(newState);
                        if (newState) {
                          await screenshotService.startListener();
                        } else {
                          await screenshotService.stopListener();
                        }
                        toast({
                          variant: "success",
                          title: newState ? "Enabled" : "Disabled",
                          description: newState
                            ? "Screenshot monitoring is now active"
                            : "Screenshot monitoring is now disabled",
                        });
                      }
                    } catch (e) {
                      toast({
                        variant: "error",
                        title: "Error",
                        description: e.message,
                      });
                    }
                  }}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    screenshotEnabled ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      screenshotEnabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Display Over Other Apps Permission */}
      <div
        className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            Display Over Other Apps
            {overlayPermission ? (
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
            Show expense popups when transactions are detected
          </p>
          {!overlayPermission && (
            <div className="text-xs bg-secondary/50 border border-border p-4 rounded-xl mb-4">
              <p className="font-semibold mb-2 text-foreground">
                How to enable:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Tap "Open Settings" below</li>
                <li>Toggle ON "Display over other apps"</li>
                <li>Return to app</li>
              </ol>
            </div>
          )}
          {overlayPermission ? (
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                  ✓ Permission Granted
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-300 mt-1">
                  Popups will appear when expenses are detected
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={async () => {
                try {
                  const NotificationListenerPlugin = (
                    await import("../../lib/notificationPlugin")
                  ).default;
                  const result =
                    await NotificationListenerPlugin.requestOverlayPermission();
                  if (result?.opened) {
                    toast({
                      variant: "success",
                      title: "Opening settings",
                      description:
                        "Toggle ON 'Display over other apps' permission",
                    });
                    // Recheck permission after a delay
                    setTimeout(async () => {
                      const status =
                        await NotificationListenerPlugin.getPermissionStatus();
                      setOverlayPermission(status.overlayPermission || false);
                    }, 2000);
                  }
                } catch (e) {
                  toast({
                    variant: "error",
                    title: "Error",
                    description: e.message,
                  });
                }
              }}
              className="w-full py-3 px-6 rounded-xl btn-gradient-primary font-semibold"
            >
              Open Settings
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationSettings;
