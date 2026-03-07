import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

/**
 * SavingsTrendChart Component
 *
 * Displays a line chart showing savings trends over time for the selected interval.
 * Implements Requirements 5.1 and 5.4 from the savings-celebration-system spec.
 *
 * Features:
 * - Responsive design for mobile support
 * - Interactive tooltips with detailed information
 * - Consistent color scheme with app theme
 * - Smooth animations
 *
 * @param {Object} props
 * @param {Array} props.categoryBreakdown - Array of category savings data
 * @param {number} props.totalSavings - Total savings amount
 * @param {string} props.interval - Time interval (day/week/month/quarter/year)
 * @param {string} props.currencySymbol - Currency symbol to display
 */
const SavingsTrendChart = ({
  categoryBreakdown = [],
  totalSavings = 0,
  interval = "month",
  currencySymbol = "₹",
}) => {
  /**
   * Transform category breakdown data into chart format
   * Creates data points for each category showing budget, spent, and saved amounts
   */
  const chartData = useMemo(() => {
    if (!categoryBreakdown || categoryBreakdown.length === 0) {
      return [];
    }

    // Transform each category into a data point
    return categoryBreakdown.map((category) => ({
      name: category.categoryName,
      budget: parseFloat(category.budgetAmount.toFixed(2)),
      spent: parseFloat(category.spentAmount.toFixed(2)),
      saved: parseFloat(category.savedAmount.toFixed(2)),
      savingsPercentage: parseFloat(category.savingsPercentage.toFixed(1)),
      color: category.categoryColor,
    }));
  }, [categoryBreakdown]);

  /**
   * Custom tooltip component with detailed information
   * Implements Requirement 5.4: Display detailed information on tap/hover
   */
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    const data = payload[0].payload;

    return (
      <div className="bg-card border border-border rounded-xl shadow-xl p-4 min-w-[200px]">
        <p className="font-semibold text-foreground mb-3 text-sm">
          {data.name}
        </p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Budget:</span>
            <span className="font-medium text-foreground">
              {currencySymbol}
              {data.budget.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Spent:</span>
            <span className="font-medium text-orange-600">
              {currencySymbol}
              {data.spent.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Saved:</span>
            <span
              className={`font-semibold ${
                data.saved >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {data.saved >= 0 ? "+" : ""}
              {currencySymbol}
              {data.saved.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Savings Rate:</span>
            <span
              className={`font-semibold ${
                data.savingsPercentage >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {data.savingsPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Custom legend component
   */
  const CustomLegend = () => {
    return (
      <div className="flex justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">Budget</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-muted-foreground">Spent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-muted-foreground">Saved</span>
        </div>
      </div>
    );
  };

  // Empty state
  if (chartData.length === 0) {
    return (
      <div className="card-elevated rounded-2xl overflow-hidden bg-card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Savings Trend
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Track your savings over time
          </p>
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              No data available for the selected period
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated rounded-2xl overflow-hidden bg-card">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Savings Trend
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Budget vs Spending across categories
        </p>

        {/* Responsive Chart Container */}
        <div className="w-full" style={{ height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                opacity={0.3}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                tickLine={{ stroke: "#e5e7eb" }}
                axisLine={{ stroke: "#e5e7eb" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 11 }}
                tickLine={{ stroke: "#e5e7eb" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value) =>
                  `${currencySymbol}${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />

              {/* Budget Line */}
              <Line
                type="monotone"
                dataKey="budget"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={500}
              />

              {/* Spent Line */}
              <Line
                type="monotone"
                dataKey="spent"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: "#f97316", r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={500}
              />

              {/* Saved Line */}
              <Line
                type="monotone"
                dataKey="saved"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Total Savings for {interval}
            </span>
            <span
              className={`text-lg font-bold ${
                totalSavings >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalSavings >= 0 ? "+" : ""}
              {currencySymbol}
              {totalSavings.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsTrendChart;
