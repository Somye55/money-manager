import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { keyManager } from "../../lib/keyManager";
import { getProvider } from "../../lib/aiProviders";
import { useToast } from "../ui/use-toast";

/**
 * KeyInputModal Component
 *
 * Modal for adding or updating API keys.
 * Validates key before enabling Save button.
 *
 * Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 9.1
 */

/**
 * Get user-friendly error message with troubleshooting tips
 */
const getErrorDetails = (errorType, error) => {
  switch (errorType) {
    case "invalid_key":
      return {
        title: "Invalid API Key",
        message: error || "The API key you entered is not valid",
        tips: [
          "Double-check that you copied the entire key",
          "Make sure there are no extra spaces",
          "Verify the key hasn't been revoked",
        ],
      };
    case "network_error":
      return {
        title: "Network Error",
        message: "Unable to connect to the API provider",
        tips: [
          "Check your internet connection",
          "Try again in a few moments",
          "Verify the provider's service is operational",
        ],
      };
    case "rate_limit":
      return {
        title: "Rate Limit Exceeded",
        message: "Too many validation attempts",
        tips: [
          "Wait a few minutes before trying again",
          "Consider using a different API key",
          "Check your provider's rate limits",
        ],
      };
    case "timeout":
      return {
        title: "Request Timeout",
        message: "The validation request took too long",
        tips: [
          "Check your internet connection",
          "Try again with a stable connection",
          "The provider may be experiencing issues",
        ],
      };
    default:
      return {
        title: "Validation Failed",
        message: error || "An unexpected error occurred",
        tips: [
          "Try again",
          "Check your API key",
          "Contact support if the issue persists",
        ],
      };
  }
};

const KeyInputModal = ({ isOpen, onClose, providerName, onSuccess }) => {
  const [key, setKey] = useState("");
  const [validating, setValidating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const { toast } = useToast();

  const provider = providerName ? getProvider(providerName) : null;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setKey("");
      setValidationResult(null);
    }
  }, [isOpen]);

  const handleValidate = async () => {
    if (!key.trim()) {
      setValidationResult({
        valid: false,
        error: "Please enter an API key",
        errorType: "invalid_key",
      });
      return;
    }

    try {
      setValidating(true);
      setValidationResult(null);

      // Validate and save the key
      const result = await keyManager.setKey(providerName, key);

      if (result.success) {
        setValidationResult({
          valid: true,
          error: null,
          errorType: null,
        });
      } else {
        // Extract error type from result if available
        const errorType = result.errorType || "unknown";
        setValidationResult({
          valid: false,
          error: result.error,
          errorType: errorType,
        });
      }
    } catch (error) {
      console.error("Validation error:", error);
      setValidationResult({
        valid: false,
        error: "Failed to validate key. Please try again.",
        errorType: "unknown",
      });
    } finally {
      setValidating(false);
    }
  };

  const handleSave = async () => {
    if (!validationResult?.valid) {
      toast({
        title: "Validation required",
        description: "Please validate the key before saving",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      // Key was already saved during validation, just close modal
      toast({
        title: "Key saved successfully",
        description: `${provider.displayName} API key has been configured`,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!provider) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{provider.displayName} API Key</DialogTitle>
          <DialogDescription>
            Enter your API key to enable AI-powered expense parsing with{" "}
            {provider.displayName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* API Key Input */}
          <div>
            <label
              htmlFor="api-key"
              className="text-sm font-medium text-foreground mb-2 block"
            >
              API Key
            </label>
            <Input
              id="api-key"
              type="password"
              placeholder={`Enter your ${provider.displayName} API key`}
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setValidationResult(null); // Reset validation when key changes
              }}
              disabled={validating || saving}
              error={
                validationResult?.valid === false
                  ? validationResult.error
                  : undefined
              }
            />
          </div>

          {/* Validation Status */}
          {validationResult && (
            <div
              className={`flex items-start gap-2 p-3 rounded-lg border ${
                validationResult.valid
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-rose-500/10 border-rose-500/30"
              }`}
            >
              {validationResult.valid ? (
                <>
                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      Key validated successfully
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      Your API key is working correctly
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle
                    size={16}
                    className="text-rose-600 mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    {(() => {
                      const errorDetails = getErrorDetails(
                        validationResult.errorType,
                        validationResult.error,
                      );
                      return (
                        <>
                          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                            {errorDetails.title}
                          </p>
                          <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                            {errorDetails.message}
                          </p>
                          {errorDetails.tips &&
                            errorDetails.tips.length > 0 && (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs font-medium text-rose-700 dark:text-rose-300">
                                  Troubleshooting:
                                </p>
                                <ul className="text-xs text-rose-600 dark:text-rose-400 list-disc list-inside space-y-0.5">
                                  {errorDetails.tips.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          {validationResult.errorType === "network_error" ||
                          validationResult.errorType === "timeout" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleValidate}
                              className="mt-2 h-7 text-xs"
                            >
                              Retry
                            </Button>
                          ) : null}
                        </>
                      );
                    })()}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Help Link */}
          <a
            href={provider.helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink size={14} />
            Get API key from {provider.displayName}
          </a>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleValidate}
            variant="secondary"
            disabled={!key.trim() || validating || saving}
            loading={validating}
          >
            {validating ? "Validating..." : "Validate"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!validationResult?.valid || saving}
            loading={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KeyInputModal;
