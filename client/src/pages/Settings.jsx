import { useNavigate } from "react-router-dom";
import {
  Settings as SettingsIcon,
  User,
  Palette,
  DollarSign,
  Smartphone,
  Tag,
  Database,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

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

  return (
    <div className="p-4 pb-24 space-y-4 animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-3 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <SettingsIcon className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-xs text-muted-foreground">
            Manage your preferences
          </p>
        </div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-3">
        {settingsGroups.map((group, index) => {
          const Icon = group.icon;
          return (
            <Card
              key={group.id}
              className="animate-slide-up cursor-pointer hover:shadow-lg transition-all border-2 hover:border-indigo-500/50"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => navigate(`/settings/${group.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${group.color}`}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{group.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {group.description}
                    </p>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-muted-foreground flex-shrink-0"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;
