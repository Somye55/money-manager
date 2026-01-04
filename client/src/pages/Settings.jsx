import { useNavigate } from "react-router-dom";
import {
  User,
  Palette,
  DollarSign,
  Smartphone,
  Tag,
  Database,
  ChevronRight,
  TestTube,
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  const settingsGroups = [
    {
      id: "profile",
      title: "Profile",
      description: "Manage your account information",
      icon: User,
      color: "from-purple-500 to-indigo-600",
    },
    {
      id: "categories",
      title: "Categories",
      description: "Organize your expenses",
      icon: Tag,
      color: "from-cyan-500 to-blue-600",
    },
    {
      id: "automation",
      title: "Automation",
      description: "SMS and notification tracking",
      icon: Smartphone,
      color: "from-emerald-500 to-teal-600",
    },
    {
      id: "appearance",
      title: "Appearance",
      description: "Theme and visual preferences",
      icon: Palette,
      color: "from-pink-500 to-rose-600",
    },
    {
      id: "budget",
      title: "Budget & Currency",
      description: "Financial preferences",
      icon: DollarSign,
      color: "from-amber-500 to-orange-600",
    },
    {
      id: "system",
      title: "System",
      description: "App status and information",
      icon: Database,
      color: "from-slate-500 to-gray-600",
    },
  ];

  const testOption = {
    id: "test-expense-save",
    title: "🧪 Test Expense Save",
    description: "Test the overlay expense save fix",
    icon: TestTube,
    color: "from-red-500 to-pink-600",
  };

  const testPopupOption = {
    id: "test-notification-popup",
    title: "🔔 Test Notification Popup",
    description: "Trigger a test notification and see the popup",
    icon: TestTube,
    color: "from-purple-500 to-indigo-600",
  };

  return (
    <div className="space-y-4 animate-fade-in w-full bg-page-gradient min-h-full px-3 py-6">
      {/* Test Notification Popup - NEW */}
      <div
        className="animate-slide-up cursor-pointer card-elevated rounded-2xl overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-600 transition-smooth hover:scale-[1.01] shadow-xl"
        onClick={() => navigate("/test-notification-popup")}
      >
        <div className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-white/20 backdrop-blur-sm">
              <TestTube className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base text-white">
                🔔 Test Notification Popup
              </h3>
              <p className="text-xs text-white/90 mt-0.5">
                Trigger a test notification and see the popup!
              </p>
            </div>
            <ChevronRight size={20} className="text-white/80 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Test Expense Save */}
      <div
        className="animate-slide-up cursor-pointer card-elevated rounded-2xl overflow-hidden bg-gradient-to-r from-red-500 to-pink-600 transition-smooth hover:scale-[1.01] shadow-xl"
        onClick={() => navigate("/test-expense-save")}
      >
        <div className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-white/20 backdrop-blur-sm">
              <TestTube className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base text-white">
                🧪 Test Expense Save
              </h3>
              <p className="text-xs text-white/90 mt-0.5">
                Test the database save functionality directly
              </p>
            </div>
            <ChevronRight size={20} className="text-white/80 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-3">
        {settingsGroups.map((group, index) => {
          const Icon = group.icon;
          return (
            <div
              key={group.id}
              className="animate-slide-up cursor-pointer card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card transition-smooth hover:scale-[1.01]"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => navigate(`/settings/${group.id}`)}
            >
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3.5 rounded-xl bg-gradient-to-r ${group.color} shadow-lg`}
                  >
                    <Icon className="text-white" size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-foreground">
                      {group.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {group.description}
                    </p>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-muted-foreground flex-shrink-0"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;
