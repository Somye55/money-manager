import { ExternalLink, HelpCircle, Lightbulb } from "lucide-react";
import { PROVIDERS } from "../../lib/aiProviders";

/**
 * HelpSection Component
 *
 * Displays links to get API keys for each provider and explains BYOK benefits.
 * Includes troubleshooting tips for common issues.
 *
 * Requirements: 9.5, 8.3
 */
const HelpSection = () => {
  return (
    <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <HelpCircle size={20} />
          Help & Resources
        </h3>
      </div>
      <div className="p-6 space-y-6">
        {/* Get API Keys Section */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <ExternalLink size={16} />
            Get API Keys
          </h4>
          <div className="space-y-2">
            {PROVIDERS.map((provider) => (
              <a
                key={provider.name}
                href={provider.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors"
              >
                <span className="text-sm font-medium text-foreground">
                  {provider.displayName}
                </span>
                <ExternalLink size={16} className="text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
          <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
            <Lightbulb size={16} />
            Why Bring Your Own Key?
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-600 dark:text-blue-300">
            <li>Unlimited AI-powered expense parsing</li>
            <li>No rate limits or usage restrictions</li>
            <li>Choose your preferred AI provider</li>
            <li>Your keys stay secure on your device</li>
            <li>Full control over your AI usage</li>
          </ul>
        </div>

        {/* Troubleshooting Section */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Common Issues
          </h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">
                Key validation fails
              </p>
              <p className="text-xs mt-1">
                Ensure you copied the entire key including any prefixes (sk-,
                gsk_, AIza). Check that the key is active in your provider's
                dashboard.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Network errors</p>
              <p className="text-xs mt-1">
                Check your internet connection. Some providers may be blocked by
                firewalls or VPNs.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Rate limit errors</p>
              <p className="text-xs mt-1">
                You've exceeded your provider's rate limit. Try using a
                different provider or wait before retrying.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
