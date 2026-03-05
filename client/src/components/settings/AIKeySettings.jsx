import { useState, useEffect } from "react";
import { keyManager } from "../../lib/keyManager";
import { PROVIDERS } from "../../lib/aiProviders";
import {
  Key,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

/**
 * AIKeySettings Component
 *
 * Simplified AI Key Settings page - allows user to configure one API key at a time.
 * User selects provider from dropdown and enters their API key.
 *
 * Requirements: 3.6, 10.1
 */
const AIKeySettings = () => {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [currentKey, setCurrentKey] = useState(null);
  const [validating, setValidating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCurrentKey();
  }, []);

  const loadCurrentKey = async () => {
    try {
      setLoading(true);
      const statuses = await keyManager.getKeyStatuses();

      // Find the first configured key
      const configuredProvider = PROVIDERS.find(
        (p) => statuses[p.name]?.configured,
      );

      if (configuredProvider) {
        setCurrentKey({
          provider: configuredProvider.name,
          displayName: configuredProvider.displayName,
          status: statuses[configuredProvider.name],
        });
        setSelectedProvider(configuredProvider.name);
      } else {
        setCurrentKey(null);
        setSelectedProvider(PROVIDERS[0].name); // Default to first provider
      }
    } catch (err) {
      console.error("Failed to load key status:", err);
      toast({
        title: "Error",
        description: "Failed to load API key settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!apiKey.trim()) {
      setValidationResult({
        valid: false,
        error: "Please enter an API key",
      });
      return;
    }

    if (!selectedProvider) {
      setValidationResult({
        valid: false,
        error: "Please select a provider",
      });
      return;
    }

    try {
      setValidating(true);
      setValidationResult(null);

      const result = await keyManager.setKey(selectedProvider, apiKey);

      if (result.success) {
        setValidationResult({
          valid: true,
          error: null,
        });
        toast({
          title: "Key validated",
          description: "API key is valid and ready to save",
        });
      } else {
        setValidationResult({
          valid: false,
          error: result.error || "Validation failed",
        });
      }
    } catch (error) {
      console.error("Validation error:", error);
      setValidationResult({
        valid: false,
        error: "Failed to validate key. Please try again.",
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

      const provider = PROVIDERS.find((p) => p.name === selectedProvider);

      toast({
        title: "Key saved",
        description: `${provider.displayName} API key has been configured`,
      });

      // Clear form and reload
      setApiKey("");
      setValidationResult(null);
      await loadCurrentKey();
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

  const handleRemove = async () => {
    if (!currentKey) return;

    if (
      !window.confirm(
        `Are you sure you want to remove your ${currentKey.displayName} API key? This will disable AI-powered expense parsing.`,
      )
    ) {
      return;
    }

    try {
      setRemoving(true);
      const result = await keyManager.removeKey(currentKey.provider);

      if (result.success) {
        toast({
          title: "Key removed",
          description: `${currentKey.displayName} API key has been removed`,
        });
        setCurrentKey(null);
        setApiKey("");
        setValidationResult(null);
        setSelectedProvider(PROVIDERS[0].name);
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

  const handleChangeProvider = () => {
    setCurrentKey(null);
    setApiKey("");
    setValidationResult(null);
    setSelectedProvider(PROVIDERS[0].name);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  const selectedProviderData = PROVIDERS.find(
    (p) => p.name === selectedProvider,
  );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AI API Key
          </h1>
          <p className="text-muted-foreground">
            Configure your AI provider API key for expense parsing
          </p>
        </div>

        {/* Current Key Status */}
        {currentKey && (
          <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card border-2 border-emerald-200 dark:border-emerald-800">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10">
                    <Key size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {currentKey.displayName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {currentKey.status.valid === true ? (
                        <>
                          <CheckCircle2
                            size={16}
                            className="text-emerald-600"
                          />
                          <span className="text-sm text-emerald-600 font-medium">
                            Active & Validated
                          </span>
                        </>
                      ) : currentKey.status.valid === false ? (
                        <>
                          <XCircle size={16} className="text-rose-600" />
                          <span className="text-sm text-rose-600 font-medium">
                            Invalid
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={16} className="text-amber-600" />
                          <span className="text-sm text-amber-600 font-medium">
                            Not Tested
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleChangeProvider}
                  variant="outline"
                  size="sm"
                  disabled={removing}
                >
                  Change Provider
                </Button>
                <Button
                  onClick={handleRemove}
                  variant="destructive"
                  size="sm"
                  disabled={removing}
                  loading={removing}
                >
                  <Trash2 size={16} className="mr-2" />
                  {removing ? "Removing..." : "Remove Key"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Update Key Form */}
        {!currentKey && (
          <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Add API Key
              </h2>

              <div className="space-y-4">
                {/* Provider Selector */}
                <div>
                  <label
                    htmlFor="provider"
                    className="text-sm font-medium text-foreground mb-2 block"
                  >
                    Select AI Provider
                  </label>
                  <select
                    id="provider"
                    value={selectedProvider}
                    onChange={(e) => {
                      setSelectedProvider(e.target.value);
                      setValidationResult(null);
                    }}
                    disabled={validating || saving}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {PROVIDERS.map((provider) => (
                      <option key={provider.name} value={provider.name}>
                        {provider.displayName}
                      </option>
                    ))}
                  </select>
                </div>

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
                    placeholder={`Enter your ${selectedProviderData?.displayName} API key`}
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setValidationResult(null);
                    }}
                    disabled={validating || saving}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Your API key is stored securely and never displayed
                  </p>
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
                          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                            Validation failed
                          </p>
                          <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                            {validationResult.error}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Help Link */}
                {selectedProviderData && (
                  <a
                    href={selectedProviderData.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink size={14} />
                    Get API key from {selectedProviderData.displayName}
                  </a>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleValidate}
                    variant="secondary"
                    disabled={!apiKey.trim() || validating || saving}
                    loading={validating}
                    className="flex-1"
                  >
                    {validating ? "Validating..." : "Validate Key"}
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!validationResult?.valid || saving}
                    loading={saving}
                    className="flex-1"
                  >
                    {saving ? "Saving..." : "Save Key"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Why provide your own API key?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  <strong className="text-foreground">Privacy:</strong> Your
                  expenses are processed directly with your chosen provider
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  <strong className="text-foreground">Control:</strong> Use your
                  preferred AI provider and manage your own usage
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  <strong className="text-foreground">Security:</strong> Keys
                  are encrypted and stored locally on your device
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIKeySettings;
