import React, { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DailySpending {
  date: string;
  label: string;
  total: number;
}

interface SpendingTrendCardProps {
  dailySpending: DailySpending[];
  currencySymbol: string;
  className?: string;
}

export const SpendingTrendCard: React.FC<SpendingTrendCardProps> = ({
  dailySpending,
  currencySymbol,
  className,
}) => {
  const barData = useMemo(() => {
    return {
      labels: dailySpending.map((d) => d.label),
      datasets: [
        {
          label: "Daily Spending",
          data: dailySpending.map((d) => d.total),
          backgroundColor: dailySpending.map((d) =>
            d.total > 0 ? "rgba(59, 130, 246, 0.8)" : "rgba(148, 163, 184, 0.3)"
          ),
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    };
  }, [dailySpending]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: 16,
        titleFont: { size: 14, weight: "600" as const },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context: any) =>
            ` ${currencySymbol}${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148, 163, 184, 0.1)", drawBorder: false },
        ticks: {
          color: "rgba(100, 116, 139, 1)",
          font: { size: 11 },
          callback: (value: any) => currencySymbol + value.toLocaleString(),
        },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "rgba(100, 116, 139, 1)",
          font: { size: 11, weight: "500" as const },
        },
        border: { display: false },
      },
    },
    animation: { duration: 1000 },
  };

  const totalWeekSpending = dailySpending.reduce(
    (sum, day) => sum + day.total,
    0
  );
  const averageDailySpending = totalWeekSpending / 7;
  const highestDay = dailySpending.reduce(
    (max, day) => (day.total > max.total ? day : max),
    dailySpending[0]
  );

  if (!dailySpending.length || dailySpending.every((d) => d.total === 0)) {
    return null;
  }

  return (
    <Card
      className={cn("animate-slide-up", className)}
      style={{ animationDelay: "0.3s" }}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Spending Trend</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Weekly Total</p>
            <p className="font-bold text-foreground">
              {currencySymbol}
              {totalWeekSpending.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div style={{ height: "180px" }} className="mb-4">
          <Bar data={barData} options={barOptions} />
        </div>

        {/* Insights */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
          <div className="text-center p-3 bg-muted/40 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Daily Average</p>
            <p className="font-semibold text-foreground">
              {currencySymbol}
              {averageDailySpending.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
          <div className="text-center p-3 bg-muted/40 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Highest Day</p>
            <p className="font-semibold text-foreground">
              {highestDay.label} ({currencySymbol}
              {highestDay.total.toLocaleString()})
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
