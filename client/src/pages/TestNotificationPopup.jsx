import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NotificationTestSettings from "../components/settings/NotificationTestSettings";

const TestNotificationPopup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page-gradient px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate("/settings")}
            className="p-2.5 rounded-xl hover:bg-white/50 dark:hover:bg-card/50 transition-smooth"
            aria-label="Back to settings"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Test Notification Capture
            </h1>
            <p className="text-sm text-muted-foreground">
              Send a real notification and verify the popup works
            </p>
          </div>
        </div>

        {/* Test Component */}
        <NotificationTestSettings />
      </div>
    </div>
  );
};

export default TestNotificationPopup;
