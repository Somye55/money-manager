import { useState } from "react";
import { Bell, Send, CheckCircle, XCircle, Loader } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { Capacitor } from "@capacitor/core";

const NotificationTestSettings = () => {
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const sendTestNotification = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      if (!Capacitor.isNativePlatform()) {
        toast({
          variant: "error",
          title: "Not available",
          description: "Test notifications only work on Android devices",
        });
        setTestResult({ success: false, message: "Not on Android device" });
        setTesting(false);
        return;
      }

      const { SettingsHelper } = await import("../../plugins/SettingsHelper");

      const result = await SettingsHelper.sendTestNotification();

      setTestResult({ success: true, message: result.message });
      toast({
        variant: "success",
        title: "Test notification sent",
        description: "Check if the popup appears to capture the notification",
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
      setTestResult({
        success: false,
        message: error.message || "Failed to send",
      });
      toast({
        variant: "error",
        title: "Test failed",
        description: error.message || "Failed to send test notification",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600">
            <Bell size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Test Notification Capture
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Send a real test notification to verify popup functionality
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
            This will send a real notification that simulates a bank SMS. The
            notification listener should catch it and show the expense popup
            automatically.
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-secondary border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              Test Notification Content:
            </p>
            <p className="text-sm font-medium text-foreground">Test Bank SMS</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your account has been debited by Rs.250.50 at Test Merchant
            </p>
          </div>

          <button
            onClick={sendTestNotification}
            disabled={testing}
            className="w-full py-3.5 px-6 rounded-xl btn-gradient-primary font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {testing ? (
              <>
                <Loader size={20} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Test Notification
              </>
            )}
          </button>

          {testResult && (
            <div
              className={`p-4 rounded-xl border-2 flex items-start gap-3 ${
                testResult.success
                  ? "bg-green-50 dark:bg-green-950/20 border-green-500"
                  : "bg-red-50 dark:bg-red-950/20 border-red-500"
              }`}
            >
              {testResult.success ? (
                <CheckCircle
                  size={20}
                  className="text-green-600 flex-shrink-0 mt-0.5"
                />
              ) : (
                <XCircle
                  size={20}
                  className="text-red-600 flex-shrink-0 mt-0.5"
                />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    testResult.success
                      ? "text-green-900 dark:text-green-100"
                      : "text-red-900 dark:text-red-100"
                  }`}
                >
                  {testResult.success ? "Success!" : "Failed"}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    testResult.success
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {testResult.message}
                </p>
                {testResult.success && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✓ Check your notification tray and watch for the expense
                    popup
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>What to expect:</strong> A notification will appear in your
            notification tray. If the notification listener is working
            correctly, the expense popup should automatically appear to let you
            save the transaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationTestSettings;
