import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { PieChartIcon } from "lucide-react";

/**
 * CategoryPieChart Component
 *
 * Displays a pie chart showing category distribution of savings.
 * Implements Requirements 5.2, 5.4, and 5.6 from the savings-celebration-system spec.
 *
 * Features:
 * - Uses category colors consistently (Requirement 5.6)
 * - Interactive with click/tap handlers for detailed view (Requirement 5.4)
 * - Shows labels with category names and amounts (Requirement 5.2)
 * - Responsive design for mobile support
 *
 * @param {Object} props
 * @param {Array} props.categoryBreakdown - Array of category savings data
 * @param {string} props.currencySymbol - Currency symbol to display
 * @param {Function} props.onCategoryClick - Callback when a category is clicked
 */
const CategoryPieChart = ({
  categoryBreakdown = [],
  currencySymbol = "₹",
  onCategoryClick = null,
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  /**
   * Transform category breakdown data into pie chart format
   * Only includes categories with positive savings for better visualization
   */
  const chartData = useMemo(() => {
    if (!categoryBreakdown || categoryBreakdown.length === 0) {
      return [];
    }

    // Filter and transform categories with savings
    return categoryBreakdown
      .filter((category) => category.savedAmount > 0)
      .map((category) => ({
        name: category.categoryName,
        value: parseFloat(category.savedAmount.toFixed(2)),
        color: category.categoryColor || "#3b82f6",
        budgetAmount: parseFloat(category.budgetAmount.toFixed(2)),
        spentAmount: parseFloat(category.spentAmount.toFixed(2)),
        savingsPercentage: parseFloat(category.savingsPercentage.toFixed(1)),
        categoryId: category.categoryId,
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
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <p className="font-semibold text-foreground text-sm">{data.name}</p>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Budget:</span>
            <span className="font-medium text-foreground">
              {currencySymbol}
              {data.budgetAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Spent:</span>
            <span className="font-medium text-orange-600">
              {currencySymbol}
              {data.spentAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Saved:</span>
            <span className="font-semibold text-green-600">
              +{currencySymbol}
              {data.value.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Savings Rate:</span>
            <span className="font-semibold text-green-600">
              {data.savingsPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Custom label component for pie chart slices
   * Shows category name and percentage
   */
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label if percentage is significant enough
    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  /**
   * Custom legend component
   * Shows category names with their colors
   */
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              if (onCategoryClick) {
                onCategoryClick(entry.payload);
              }
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Handle pie slice click
   * Implements Requirement 5.4: Interactive tap/click handler
   */
  const handlePieClick = (data, index) => {
    setActiveIndex(index);
    if (onCategoryClick) {
      onCategoryClick(data);
    }
  };

  // Empty state
  if (chartData.length === 0) {
    return (
      <div className="card-elevated rounded-2xl overflow-hidden bg-card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-primary" />
            Category Distribution
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Savings breakdown by category
          </p>
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <PieChartIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              No savings data available
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Start saving to see your category distribution
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
          <PieChartIcon className="w-5 h-5 text-primary" />
          Category Distribution
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Savings breakdown by category
        </p>

        {/* Responsive Chart Container */}
        <div className="w-full" style={{ height: "350px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                animationDuration={500}
                onClick={handlePieClick}
                style={{ cursor: onCategoryClick ? "pointer" : "default" }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={activeIndex === index ? "#fff" : "none"}
                    strokeWidth={activeIndex === index ? 3 : 0}
                    style={{
                      filter:
                        activeIndex === index
                          ? "brightness(1.1)"
                          : "brightness(1)",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Total Categories
            </span>
            <span className="text-lg font-bold text-foreground">
              {chartData.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart;
