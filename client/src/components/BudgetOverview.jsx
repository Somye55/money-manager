import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { capitalizeFirst } from "../lib/textUtils";

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
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-6 bg-secondary rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-secondary rounded"></div>
            <div className="h-4 bg-secondary rounded w-3/4"></div>
          </div>
        </CardContent>
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
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <DollarSign size={20} className="text-primary" />
            </div>
            <h3 className="font-bold text-lg">Budget Overview</h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No category budgets set. Add budgets in Settings to track your
            spending limits.
          </p>
        </CardContent>
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <DollarSign size={20} className="text-primary" />
          </div>
          <h3 className="font-bold text-lg">Budget Overview</h3>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Budget Summary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground mb-1">Total Budget</p>
            <h4 className="font-bold text-lg">
              {currencySymbol}
              {totalBudget.toLocaleString()}
            </h4>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground mb-1">Remaining</p>
            <h4
              className="font-bold text-lg"
              style={{
                color:
                  totalRemaining > 0
                    ? "hsl(var(--success))"
                    : "hsl(var(--destructive))",
              }}
            >
              {currencySymbol}
              {totalRemaining.toLocaleString()}
            </h4>
          </div>
        </div>

        {/* Status Indicators */}
        {(overBudgetCount > 0 || nearLimitCount > 0) && (
          <div className="flex gap-2 mb-4">
            {overBudgetCount > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full border bg-destructive/10 border-destructive/30">
                <AlertTriangle size={12} className="text-destructive" />
                <span className="text-xs text-destructive">
                  {overBudgetCount} over budget
                </span>
              </div>
            )}
            {nearLimitCount > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full border bg-yellow-500/10 border-yellow-500/30">
                <TrendingUp size={12} className="text-yellow-600" />
                <span className="text-xs text-yellow-600">
                  {nearLimitCount} near limit
                </span>
              </div>
            )}
          </div>
        )}

        {/* Category Budget List */}
        <div className="space-y-3">
          {categoriesWithBudgets
            .sort((a, b) => b.percentUsed - a.percentUsed) // Sort by usage percentage
            .map((category) => {
              const IconComponent =
                LucideIcons[category.icon] || LucideIcons.Tag;
              const isOverBudget = category.isOverBudget;
              const isNearLimit = !isOverBudget && category.percentUsed >= 80;

              return (
                <div
                  key={category.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                >
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: category.color + "20" }}
                  >
                    <IconComponent
                      size={16}
                      style={{ color: category.color }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate text-sm">
                        {capitalizeFirst(category.name)}
                      </p>
                      <div className="flex items-center gap-1">
                        {isOverBudget && (
                          <AlertTriangle
                            size={12}
                            className="text-destructive"
                          />
                        )}
                        {isNearLimit && (
                          <TrendingUp size={12} className="text-yellow-600" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {Math.round(category.percentUsed)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground">
                        {currencySymbol}
                        {category.spent.toLocaleString()} / {currencySymbol}
                        {category.budget.toLocaleString()}
                      </span>
                      <span
                        style={{
                          color:
                            category.remaining > 0
                              ? "hsl(var(--success))"
                              : "hsl(var(--destructive))",
                        }}
                      >
                        {category.remaining > 0 ? "+" : ""}
                        {currencySymbol}
                        {category.remaining.toLocaleString()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full rounded-full h-1.5 bg-muted">
                      <div
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, category.percentUsed)}%`,
                          backgroundColor: isOverBudget
                            ? "hsl(var(--destructive))"
                            : isNearLimit
                            ? "#eab308"
                            : category.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetOverview;
