import { useNavigate } from "react-router-dom";
import {
  User,
  Palette,
  DollarSign,
  Smartphone,
  Tag,
  Database,
  ChevronRight,
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

  return (
    <div className="space-y-4 animate-fade-in w-full bg-page-gradient min-h-full px-3 py-6">
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
