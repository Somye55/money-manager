import React from "react";
import { Receipt, Plus, Sparkles, PieChart, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateCardProps {
  onAddExpense: () => void;
  className?: string;
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  onAddExpense,
  className,
}) => {
  return (
    <Card
      className={cn(
        "animate-slide-up text-center border-none shadow-xl shadow-indigo-100 dark:shadow-none bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl relative overflow-hidden",
        className
      )}
      style={{ animationDelay: "0.3s" }}
    >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
        
        <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
          {/* Illustration */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-3xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center rotate-3 transform transition-transform duration-500 hover:rotate-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 -rotate-3">
                <Plus size={40} className="text-white" strokeWidth={3} />
              </div>
            </div>
            <Sparkles 
              className="absolute -top-2 -right-2 text-amber-400 drop-shadow-sm animate-pulse" 
              size={28} 
              fill="currentColor"
            />
          </div>

          {/* Content */}
          <div className="space-y-8 w-full">
            <div>
              <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Welcome to Money Manager
              </h3>
              <p className="text-muted-foreground text-sm max-w-[260px] mx-auto leading-relaxed">
                Take control of your financial journey. Add your first expense to unlock powerful analytics.
              </p>
            </div>

            {/* Call to action */}
            <button
              onClick={onAddExpense}
              className="btn btn-primary w-full max-w-[280px] h-14 rounded-2xl shadow-xl shadow-blue-500/20 text-lg relative overflow-hidden group hover:scale-[1.02] transition-all duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Plus size={22} strokeWidth={3} className="mr-2" />
              Add First Expense
            </button>
          </div>

          {/* Value Props */}
          <div className="mt-10 pt-8 border-t border-dashed border-gray-100 dark:border-gray-800 w-full">
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-900/10 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-900/20 transition-colors">
                  <Receipt size={22} strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Track</span>
              </div>
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/20 transition-colors">
                  <PieChart size={22} strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Analyze</span>
              </div>
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-900/20 transition-colors">
                  <TrendingUp size={22} strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Grow</span>
              </div>
            </div>
          </div>
        </CardContent>
    </Card>
  );
};
