import { useState, useEffect } from "react";
import { Camera, AlertCircle } from "lucide-react";
import { Switch } from "../ui/switch";
import { keyManager } from "../../lib/keyManager";
import { useToast } from "../ui/use-toast";

/**
 * ScreenshotToggle Component
 *
 * Toggle switch for enabling/disabling screenshot monitoring.
 * Requires at least one valid API key to be enabled.
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.7
 */
const ScreenshotToggle = ({ onRefresh }) => {
  const [enabled, setEnabled] = useState(false);
  const [canEnable, setCanEnable] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [isEnabled, hasKey] = await Promise.all([
        keyManager.getScreenshotMonitoringEnabled(),
        keyManager.canEnableScreenshotMonitoring(),
      ]);
      setEnabled(isEnabled);
      setCanEnable(hasKey);
    } catch (error) {
      console.error("Failed to load screenshot monitoring settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (checked) => {
    try {
      const result = await keyManager.setScreenshotMonitoringEnabled(checked);

      if (result.success) {
        setEnabled(checked);
        toast({
          title: checked
            ? "Screenshot monitoring enabled"
            : "Screenshot monitoring disabled",
          description: checked
            ? "The app will now process screenshots for expense parsing"
            : "Screenshots will no longer be processed",
        });
        onRefresh?.();
      } else {
        toast({
          title: "Failed to update setting",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to toggle screenshot monitoring:", error);
      toast({
        title: "Error",
        description: "Failed to update screenshot monitoring setting",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Camera size={20} className="text-foreground" />
              <h3 className="text-lg font-semibold text-foreground">
                Screenshot Monitoring
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Automatically parse expenses from screenshots when enabled
            </p>
            {!canEnable && (
              <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <AlertCircle
                  size={16}
                  className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0"
                />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Add at least one valid API key to enable screenshot monitoring
                </p>
              </div>
            )}
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={!canEnable}
            aria-label="Toggle screenshot monitoring"
          />
        </div>
      </div>
    </div>
  );
};

export default ScreenshotToggle;
