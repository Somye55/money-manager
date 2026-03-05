import { useState, useEffect } from "react";
import { keyManager } from "../../lib/keyManager";
import { PROVIDERS } from "../../lib/aiProviders";
import { CheckCircle2, XCircle, AlertCircle, Key } from "lucide-react";

/**
 * KeyStatusOverview Component
 *
 * Displays a summary of all configured AI providers with status indicators.
 * Shows count of configured vs total providers and overall feature availability.
 *
 * Requirements: 3.1, 4.5
 */
const KeyStatusOverview = () => {
  const [keyStatuses, setKeyStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKeyStatuses();
  }, []);

  const loadKeyStatuses = async () => {
    try {
      setLoading(true);
      const statuses = await keyManager.getKeyStatuses();
      setKeyStatuses(statuses);
    } catch (error) {
      console.error("Failed to load key statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics
  const totalProviders = PROVIDERS.length;
  const configuredCount = Object.values(keyStatuses).filter(
    (status) => status.configured,
  ).length;
  const validCount = Object.values(keyStatuses).filter(
    (status) => status.valid === true,
  ).length;
  const hasAnyValidKey = validCount > 0;
  const hasAnyConfiguredKey = configuredCount > 0;

  // Determine overall status
  const getOverallStatus = () => {
    if (validCount > 0) {
      return {
        icon: CheckCircle2,
        color: "text-emerald-600",
        bgColor: "bg-emerald-500/20",
        text: "AI Features Available",
        description: `${validCount} provider${validCount > 1 ? "s" : ""} configured and working`,
      };
    } else if (configuredCount > 0) {
      return {
        icon: AlertCircle,
        color: "text-amber-600",
        bgColor: "bg-amber-500/20",
        text: "Keys Need Validation",
        description: "Please test your configured keys",
      };
    } else {
      return {
        icon: XCircle,
        color: "text-rose-600",
        bgColor: "bg-rose-500/20",
        text: "No Keys Configured",
        description: "Add an API key to enable AI features",
      };
    }
  };

  const overallStatus = getOverallStatus();
  const StatusIcon = overallStatus.icon;

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
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Key size={20} />
          API Key Status
        </h3>
      </div>
      <div className="p-6">
        {/* Overall Status Banner */}
        <div
          className={`flex items-start gap-4 p-4 rounded-xl ${overallStatus.bgColor} border border-${overallStatus.color.replace("text-", "")}/30 mb-4`}
        >
          <StatusIcon size={24} className={overallStatus.color} />
          <div className="flex-1">
            <p className={`font-semibold ${overallStatus.color}`}>
              {overallStatus.text}
            </p>
            <p
              className={`text-sm mt-1 ${overallStatus.color.replace("600", "500")}`}
            >
              {overallStatus.description}
            </p>
          </div>
        </div>

        {/* Provider Count Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-2xl font-bold text-foreground">
              {configuredCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Configured</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-2xl font-bold text-foreground">{validCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Valid</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-2xl font-bold text-foreground">
              {totalProviders}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </div>
        </div>

        {/* Provider Status List */}
        <div className="mt-4 space-y-2">
          {PROVIDERS.map((provider) => {
            const status = keyStatuses[provider.name] || {
              configured: false,
              valid: null,
            };

            let statusIndicator;
            if (!status.configured) {
              statusIndicator = (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  Not configured
                </span>
              );
            } else if (status.valid === true) {
              statusIndicator = (
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Active
                </span>
              );
            } else if (status.valid === false) {
              statusIndicator = (
                <span className="flex items-center gap-1 text-xs text-rose-600">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  Invalid
                </span>
              );
            } else {
              statusIndicator = (
                <span className="flex items-center gap-1 text-xs text-amber-600">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  Not tested
                </span>
              );
            }

            return (
              <div
                key={provider.name}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border"
              >
                <span className="text-sm font-medium text-foreground">
                  {provider.displayName}
                </span>
                {statusIndicator}
              </div>
            );
          })}
        </div>

        {/* Feature Availability Notice */}
        {!hasAnyValidKey && (
          <div className="mt-4 text-xs bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
            <p className="font-semibold mb-2 text-blue-700 dark:text-blue-400">
              💡 Why provide your own API key?
            </p>
            <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-300">
              <li>Unlimited AI-powered expense parsing</li>
              <li>No rate limits or usage restrictions</li>
              <li>Choose your preferred AI provider</li>
              <li>Your keys stay secure on your device</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyStatusOverview;
