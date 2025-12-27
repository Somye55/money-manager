import React from "react";
import { Plus, Receipt, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickActionsCardProps {
  onNavigate: (path: string) => void;
  expenseCount: number;
  className?: string;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onNavigate,
  expenseCount,
  className,
}) => {
  const actions = [
    {
      id: "add-expense",
      title: "Add Expense",
      description: "Track new expense",
      icon: Plus,
      path: "/add",
      bgColor: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
    {
      id: "view-expenses",
      title: "View All",
      description: `${expenseCount} expenses`,
      icon: Receipt,
      path: "/expenses",
      bgColor: "bg-violet-500",
      hoverColor: "hover:bg-violet-600",
    },
    {
      id: "settings",
      title: "Settings",
      description: "App preferences",
      icon: Settings,
      path: "/settings",
      bgColor: "bg-emerald-500",
      hoverColor: "hover:bg-emerald-600",
    },
  ];

  return (
    <Card
      className={cn("animate-slide-up", className)}
      style={{ animationDelay: "0.5s" }}
    >
      <CardContent className="p-5">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.path)}
                className={cn(
                  "group relative p-4 rounded-xl text-center transition-all duration-200",
                  "text-white shadow-md",
                  "hover:scale-105 hover:shadow-lg active:scale-95 active:opacity-90",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "touch-manipulation min-h-[80px]", // Mobile optimization
                  action.bgColor,
                  action.hoverColor
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-xs sm:text-sm text-white leading-tight">
                      {action.title}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
