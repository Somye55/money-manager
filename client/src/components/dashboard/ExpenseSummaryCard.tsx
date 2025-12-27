import React from "react";
import { TrendingDown, Calendar, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpenseSummaryCardProps {
  totalExpense: number;
  expenseCount: number;
  currencySymbol: string;
  currentMonth: string;
  className?: string;
}

export const ExpenseSummaryCard: React.FC<ExpenseSummaryCardProps> = ({
  totalExpense,
  expenseCount,
  currencySymbol,
  currentMonth,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl p-6",
        "bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500",
        "text-white shadow-xl shadow-orange-500/25",
        "animate-slide-up ring-1 ring-white/10",
        className
      )}
      style={{
        animationDelay: "0.1s",
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-white rounded-full mix-blend-overlay blur-2xl transform translate-x-12 -translate-y-12" />
      </div>
      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-white rounded-full mix-blend-overlay blur-2xl transform -translate-x-8 translate-y-8" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
            <TrendingDown size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium tracking-wide">
              Total Expenses
            </p>
            <p className="text-white/90 text-xs flex items-center gap-1.5 mt-0.5 font-semibold">
              <Calendar size={12} strokeWidth={2.5} />
              {currentMonth}
            </p>
          </div>
        </div>

        {/* Expense count badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full text-xs font-bold text-white backdrop-blur-md border border-white/10 shadow-sm">
          <Receipt size={14} strokeWidth={2.5} />
          {expenseCount} {expenseCount === 1 ? "expense" : "expenses"}
        </div>
      </div>

      {/* Expense amount */}
      <div className="relative z-10">
        <h2 className="text-5xl font-black text-white mb-4 tracking-tight drop-shadow-sm flex items-baseline">
           <span className="text-3xl mr-1 opacity-80 font-bold">{currencySymbol}</span>
          {totalExpense.toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </h2>

        {/* Average per expense */}
        {expenseCount > 0 && (
          <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-black/10 backdrop-blur-sm border border-white/5 shadow-sm">
            <span className="text-white/70 text-xs font-medium mr-2">Avg per expense</span>
            <span className="text-white font-bold text-sm">
              {currencySymbol}
              {(totalExpense / expenseCount).toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
