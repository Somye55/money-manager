import React, { useMemo } from "react";
import { PieChart } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryData {
  total: number;
  color: string;
  count: number;
}

interface CategoryBreakdownCardProps {
  categoryTotals: Record<string, CategoryData>;
  totalExpense: number;
  currencySymbol: string;
  categories: Array<{ name: string; icon?: string; color: string }>;
  className?: string;
}

export const CategoryBreakdownCard: React.FC<CategoryBreakdownCardProps> = ({
  categoryTotals,
  totalExpense,
  currencySymbol,
  categories,
  className,
}) => {
  const doughnutData = useMemo(() => {
    if (!categoryTotals || Object.keys(categoryTotals).length === 0) {
      return {
        labels: [],
        datasets: [
          { label: "Expenses", data: [], backgroundColor: [], borderWidth: 0 },
        ],
      };
    }

    const labels = Object.keys(categoryTotals);
    const data = labels.map((label) => categoryTotals[label].total);
    const colors = labels.map((label) => categoryTotals[label].color);

    return {
      labels,
      datasets: [
        {
          label: "Expenses",
          data,
          backgroundColor: colors.map((color) => `${color}E6`),
          borderColor: colors,
          borderWidth: 0,
          hoverBorderWidth: 2,
          hoverBorderColor: "#ffffff",
        },
      ],
    };
  }, [categoryTotals]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: 16,
        titleFont: { size: 14, weight: "600" as const },
        bodyFont: { size: 13 },
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            const percentage = ((context.parsed / totalExpense) * 100).toFixed(
              1
            );
            return ` ${currencySymbol}${context.parsed.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    animation: { animateRotate: true, animateScale: true, duration: 1000 },
  };

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 4);

  if (!categoryTotals || Object.keys(categoryTotals).length === 0) {
    return (
      <Card
        className={cn("animate-slide-up", className)}
        style={{ animationDelay: "0.4s" }}
      >
        <CardContent className="p-6 text-center">
          <PieChart size={48} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No expense categories yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn("animate-slide-up", className)}
      style={{ animationDelay: "0.4s" }}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PieChart size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Category Breakdown
              </h3>
              <p className="text-xs text-muted-foreground">
                Spending distribution
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-bold text-foreground">
              {currencySymbol}
              {totalExpense.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="relative mb-5">
          <div style={{ height: "180px", position: "relative" }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Categories</p>
                <p className="text-lg font-bold text-foreground">
                  {Object.keys(categoryTotals).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category list */}
        <div className="space-y-2.5">
          {topCategories.map(([name, data]) => {
            const percentage = ((data.total / totalExpense) * 100).toFixed(1);
            return (
              <div
                key={name}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: data.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm text-foreground truncate">
                      {name}
                    </p>
                    <p className="font-semibold text-sm text-foreground">
                      {currencySymbol}
                      {data.total.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: data.color,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium w-10 text-right">
                      {percentage}%
                    </span>
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
