import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { Card, Typography } from "../design-system";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

const BudgetOverview = () => {
  const { getBudgetAnalysis, settings } = useData();
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get currency symbol
  const currencySymbol =
    settings?.currency === "USD"
      ? "$"
      : settings?.currency === "EUR"
      ? "€"
      : settings?.currency === "GBP"
      ? "£"
      : settings?.currency === "JPY"
      ? "¥"
      : "₹";

  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        setLoading(true);
        const data = await getBudgetAnalysis();
        setBudgetData(data);
      } catch (error) {
        console.error("Error loading budget data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBudgetData();
  }, [getBudgetAnalysis]);

  if (loading) {
    return (
      <Card padding="md" className="animate-pulse">
        <div className="h-6 bg-bg-secondary rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-bg-secondary rounded"></div>
          <div className="h-4 bg-bg-secondary rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  if (!budgetData) {
    return null;
  }

  // Filter categories that have budgets
  const categoriesWithBudgets = Object.values(budgetData).filter(
    (category) => category.budget && category.budget > 0
  );

  if (categoriesWithBudgets.length === 0) {
    return (
      <Card padding="md">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <DollarSign size={20} className="text-primary" />
          </div>
          <Typography variant="h3" className="font-bold">
            Budget Overview
          </Typography>
        </div>
        <Typography
          variant="body2"
          color="tertiary"
          className="text-center py-4"
        >
          No category budgets set. Add budgets in Settings to track your
          spending limits.
        </Typography>
      </Card>
    );
  }

  // Calculate totals
  const totalBudget = categoriesWithBudgets.reduce(
    (sum, cat) => sum + cat.budget,
    0
  );
  const totalSpent = categoriesWithBudgets.reduce(
    (sum, cat) => sum + cat.spent,
    0
  );
  const totalRemaining = Math.max(0, totalBudget - totalSpent);
  const overallPercentUsed =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Count categories by status
  const overBudgetCount = categoriesWithBudgets.filter(
    (cat) => cat.isOverBudget
  ).length;
  const nearLimitCount = categoriesWithBudgets.filter(
    (cat) => !cat.isOverBudget && cat.percentUsed >= 80
  ).length;

  return (
    <Card padding="md">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <DollarSign size={20} className="text-primary" />
        </div>
        <Typography variant="h3" className="font-bold">
          Budget Overview
        </Typography>
      </div>

      {/* Overall Budget Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 rounded-lg bg-bg-secondary/50">
          <Typography variant="body2" color="tertiary" className="text-xs mb-1">
            Total Budget
          </Typography>
          <Typography variant="h4" className="font-bold">
            {currencySymbol}
            {totalBudget.toLocaleString()}
          </Typography>
        </div>
        <div className="text-center p-3 rounded-lg bg-bg-secondary/50">
          <Typography variant="body2" color="tertiary" className="text-xs mb-1">
            Remaining
          </Typography>
          <Typography
            variant="h4"
            className="font-bold"
            style={{
              color: totalRemaining > 0 ? "var(--success)" : "var(--danger)",
            }}
          >
            {currencySymbol}
            {totalRemaining.toLocaleString()}
          </Typography>
        </div>
      </div>

      {/* Status Indicators */}
      {(overBudgetCount > 0 || nearLimitCount > 0) && (
        <div className="flex gap-2 mb-4">
          {overBudgetCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/30">
              <AlertTriangle size={12} className="text-red-600" />
              <Typography variant="caption" className="text-red-600 text-xs">
                {overBudgetCount} over budget
              </Typography>
            </div>
          )}
          {nearLimitCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30">
              <TrendingUp size={12} className="text-yellow-600" />
              <Typography variant="caption" className="text-yellow-600 text-xs">
                {nearLimitCount} near limit
              </Typography>
            </div>
          )}
        </div>
      )}

      {/* Category Budget List */}
      <div className="space-y-3">
        {categoriesWithBudgets
          .sort((a, b) => b.percentUsed - a.percentUsed) // Sort by usage percentage
          .map((category) => {
            const IconComponent = LucideIcons[category.icon] || LucideIcons.Tag;
            const isOverBudget = category.isOverBudget;
            const isNearLimit = !isOverBudget && category.percentUsed >= 80;

            return (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-bg-secondary/30"
              >
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: category.color + "20" }}
                >
                  <IconComponent size={16} style={{ color: category.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <Typography
                      variant="body2"
                      className="font-medium truncate"
                    >
                      {category.name}
                    </Typography>
                    <div className="flex items-center gap-1">
                      {isOverBudget && (
                        <AlertTriangle size={12} className="text-red-600" />
                      )}
                      {isNearLimit && (
                        <TrendingUp size={12} className="text-yellow-600" />
                      )}
                      <Typography
                        variant="caption"
                        color="tertiary"
                        className="text-xs"
                      >
                        {Math.round(category.percentUsed)}%
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-2">
                    <Typography variant="caption" color="tertiary">
                      {currencySymbol}
                      {category.spent.toLocaleString()} / {currencySymbol}
                      {category.budget.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="caption"
                      style={{
                        color:
                          category.remaining > 0
                            ? "var(--success)"
                            : "var(--danger)",
                      }}
                    >
                      {category.remaining > 0 ? "+" : ""}
                      {currencySymbol}
                      {category.remaining.toLocaleString()}
                    </Typography>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-bg-secondary rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, category.percentUsed)}%`,
                        backgroundColor: isOverBudget
                          ? "#ef4444"
                          : isNearLimit
                          ? "#f59e0b"
                          : category.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Card>
  );
};

export default BudgetOverview;
