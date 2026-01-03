import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import ProfileSettings from "../components/settings/ProfileSettings";
import CategorySettings from "../components/settings/CategorySettings";
import AutomationSettings from "../components/settings/AutomationSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import BudgetSettings from "../components/settings/BudgetSettings";
import SystemSettings from "../components/settings/SystemSettings";

const SettingsGroup = () => {
  const navigate = useNavigate();
  const { group } = useParams();

  const renderGroupContent = () => {
    switch (group) {
      case "profile":
        return <ProfileSettings />;
      case "categories":
        return <CategorySettings />;
      case "automation":
        return <AutomationSettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "budget":
        return <BudgetSettings />;
      case "system":
        return <SystemSettings />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Settings group not found</p>
          </div>
        );
    }
  };

  return (
    <div className="pb-24 space-y-4 animate-fade-in w-full bg-page-gradient min-h-screen px-3 py-6">
      {renderGroupContent()}
    </div>
  );
};

export default SettingsGroup;
