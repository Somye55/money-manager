import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Key, X, AlertCircle } from "lucide-react";

/**
 * MissingKeyPrompt Component
 *
 * Displays a prompt when user attempts to use AI features without configured API keys.
 * Provides direct link to AI Key Settings page.
 *
 * Requirements: 4.2, 4.3
 */
const MissingKeyPrompt = ({
  isOpen,
  onClose,
  feature = "AI-powered parsing",
}) => {
  const navigate = useNavigate();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check if user has dismissed this prompt before
    const dismissed = localStorage.getItem("missingKeyPromptDismissed");
    if (dismissed === "true" && !isOpen) {
      return;
    }
  }, [isOpen]);

  const handleGoToSettings = () => {
    if (dontShowAgain) {
      localStorage.setItem("missingKeyPromptDismissed", "true");
    }
    navigate("/settings/ai-keys");
    onClose();
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("missingKeyPromptDismissed", "true");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-card rounded-2xl shadow-2xl max-w-md w-full animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
              <AlertCircle className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              API Key Required
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-foreground">
            To use <span className="font-semibold">{feature}</span>, you need to
            configure at least one AI provider API key.
          </p>

          <div className="bg-muted/50 rounded-xl p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                Why do I need this?
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              AI-powered features require API keys from providers like ChatGPT,
              Groq, or Gemini. Your keys are stored securely on your device and
              never shared.
            </p>
          </div>

          {/* Don't show again checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">
              Don't show this again
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-border">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleGoToSettings}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2"
          >
            <Key size={18} />
            Configure Keys
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissingKeyPrompt;
