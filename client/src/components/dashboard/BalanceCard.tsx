import React from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  balance: number;
  monthlyBudget: number;
  totalExpense: number;
  currencySymbol: string;
  className?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  monthlyBudget,
  totalExpense,
  currencySymbol,
  className,
}) => {
  const isPositive = balance >= 0;
  const budgetUsedPercentage = Math.min(
    (totalExpense / monthlyBudget) * 100,
    100
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl p-6",
        "bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700",
        "text-white shadow-xl shadow-blue-500/25",
        "animate-slide-up ring-1 ring-white/10",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-white rounded-full mix-blend-overlay blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="absolute bottom-0 left-0 w-48 h-48 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-white rounded-full mix-blend-overlay blur-3xl transform -translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
            <Wallet size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium tracking-wide">
              Current Balance
            </p>
            <p className="text-white/90 text-xs mt-0.5 font-semibold">
              {budgetUsedPercentage.toFixed(1)}% used
            </p>
          </div>
        </div>

        {/* Trend indicator */}
        <div
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-sm border",
            isPositive
              ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-50"
              : "bg-rose-500/20 border-rose-400/30 text-rose-50"
          )}
        >
          {isPositive ? (
            <TrendingUp size={14} strokeWidth={3} />
          ) : (
            <TrendingDown size={14} strokeWidth={3} />
          )}
          {isPositive ? "On Track" : "Over Budget"}
        </div>
      </div>

      {/* Balance amount */}
      <div className="relative z-10">
        <h2 className="text-5xl font-black text-white mb-8 tracking-tight drop-shadow-sm flex items-baseline">
          <span className="text-3xl mr-1 opacity-80 font-bold">{currencySymbol}</span>
          {Math.abs(balance).toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </h2>

        {/* Budget progress bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-end text-xs">
            <span className="text-white/70 font-medium">Budget Progress</span>
            <span className="text-white font-bold tracking-wide text-sm">
              {currencySymbol}
              {monthlyBudget.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/5 p-0.5">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out shadow-sm relative",
                budgetUsedPercentage > 100
                  ? "bg-gradient-to-r from-rose-400 to-red-500"
                  : budgetUsedPercentage > 80
                  ? "bg-gradient-to-r from-amber-300 to-orange-400"
                  : "bg-gradient-to-r from-emerald-300 to-emerald-500"
              )}
              style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
            >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
