import { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { keyManager } from "../../lib/keyManager";
import { useToast } from "../ui/use-toast";

/**
 * KeyCard Component
 *
 * Displays individual provider card with status, masked key, and action buttons.
 * Shows Add button when not configured, Test/Update/Remove when configured.
 *
 * Requirements: 3.1, 3.2, 3.3, 3.5
 */
const KeyCard = ({ provider, status, onUpdate, onOpenModal }) => {
  const [testing, setTesting] = useState(false);
  const [removing, setRemoving] = useState(false);
  const { toast } = useToast();

  const handleTest = async () => {
    try {
      setTesting(true);
      const result = await keyManager.testKey(provider.name);

      if (result.success) {
        toast({
          title: "Key validated successfully",
          description: `${provider.displayName} API key is working correctly`,
        });
      } else {
        toast({
          title: "Key validation failed",
          description: result.error,
          variant: "destructive",
        });
      }

      onUpdate?.();
    } catch (error) {
      console.error("Failed to test key:", error);
      toast({
        title: "Error",
        description: "Failed to test API key",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleRemove = async () => {
    // Confirm removal
    if (
      !window.confirm(
        `Are you sure you want to remove your ${provider.displayName} API key?`,
      )
    ) {
      return;
    }

    try {
      setRemoving(true);
      const result = await keyManager.removeKey(provider.name);

      if (result.success) {
        toast({
          title: "Key removed",
          description: `${provider.displayName} API key has been removed`,
        });
        onUpdate?.();
      } else {
        toast({
          title: "Failed to remove key",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to remove key:", error);
      toast({
        title: "Error",
        description: "Failed to remove API key",
        variant: "destructive",
      });
    } finally {
      setRemoving(false);
    }
  };

  // Determine status indicator
  let statusIndicator;
  let statusColor;

  if (!status.configured) {
    statusIndicator = (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        <span className="text-xs text-muted-foreground">Not configured</span>
      </div>
    );
    statusColor = "border-gray-200 dark:border-gray-700";
  } else if (status.valid === true) {
    statusIndicator = (
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} className="text-emerald-600" />
        <span className="text-xs text-emerald-600 font-medium">Active</span>
      </div>
    );
    statusColor = "border-emerald-200 dark:border-emerald-800";
  } else if (status.valid === false) {
    statusIndicator = (
      <div className="flex items-center gap-2">
        <XCircle size={16} className="text-rose-600" />
        <span className="text-xs text-rose-600 font-medium">Invalid</span>
      </div>
    );
    statusColor = "border-rose-200 dark:border-rose-800";
  } else {
    statusIndicator = (
      <div className="flex items-center gap-2">
        <AlertCircle size={16} className="text-amber-600" />
        <span className="text-xs text-amber-600 font-medium">Not tested</span>
      </div>
    );
    statusColor = "border-amber-200 dark:border-amber-800";
  }

  return (
    <div
      className={`card-elevated rounded-xl overflow-hidden bg-white dark:bg-card border-2 ${statusColor}`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-foreground">
              {provider.displayName}
            </h4>
            {status.maskedKey && (
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {status.maskedKey}
              </p>
            )}
          </div>
          {statusIndicator}
        </div>

        {/* Error message if validation failed */}
        {status.valid === false && status.error && (
          <div className="mb-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
            <p className="text-xs text-rose-700 dark:text-rose-300">
              {status.error}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {!status.configured ? (
            <Button
              onClick={() => onOpenModal(provider.name)}
              className="flex-1"
              size="sm"
            >
              Add Key
            </Button>
          ) : (
            <>
              <Button
                onClick={handleTest}
                variant="outline"
                size="sm"
                disabled={testing || removing}
                loading={testing}
              >
                {testing ? "Testing..." : "Test"}
              </Button>
              <Button
                onClick={() => onOpenModal(provider.name)}
                variant="outline"
                size="sm"
                disabled={testing || removing}
              >
                Update
              </Button>
              <Button
                onClick={handleRemove}
                variant="destructive"
                size="sm"
                disabled={testing || removing}
                loading={removing}
              >
                {removing ? "Removing..." : "Remove"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyCard;
