import { useMemo, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp, Loader, ArrowRight } from "lucide-react";
import { useData } from "../context/DataContext";
import { useSMS } from "../context/SMSContext";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { Progress } from "../components/ui/progress";

const Dashboard = () => {
  const { expenses, categories, settings, loading } = useData();
  const { scanSMS, isSupported, permissionGranted } = useSMS();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [dailySpending, setDailySpending] = useState([]);

  // Auto-scan on load if permitted
  useEffect(() => {
    if (isSupported && permissionGranted) {
      scanSMS(10);
    }
  }, [isSupported, permissionGranted]);

  // Calculate analytics from expenses
  useEffect(() => {
    if (!expenses || expenses.length === 0) {
      setAnalytics(null);
      setDailySpending([]);
      return;
    }

    const categoryTotals = {};
    let totalExpense = 0;

    expenses.forEach((expense) => {
      const amount = parseFloat(expense.amount);
      totalExpense += amount;

      const categoryName = expense.category?.name || "Uncategorized";
      const categoryColor = expense.category?.color || "#6366f1";

      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = {
          total: 0,
          color: categoryColor,
          count: 0,
        };
      }

      categoryTotals[categoryName].total += amount;
      categoryTotals[categoryName].count += 1;
    });

    const last7Days = [];
    const dailyTotals = {};

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      last7Days.push({
        date: dateStr,
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        total: 0,
      });
      dailyTotals[dateStr] = 0;
    }

    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date).toISOString().split("T")[0];
      if (dailyTotals.hasOwnProperty(expenseDate)) {
        dailyTotals[expenseDate] += parseFloat(expense.amount);
      }
    });

    last7Days.forEach((day) => {
      day.total = dailyTotals[day.date];
    });

    setDailySpending(last7Days);
    setAnalytics({ categoryTotals, totalExpense });
  }, [expenses]);

  const totalExpense = analytics?.totalExpense || 0;
  const monthlyBudget = settings?.monthlyBudget
    ? parseFloat(settings.monthlyBudget)
    : 50000;
  const balance = monthlyBudget - totalExpense;

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

  const pieChartData = useMemo(() => {
    if (!analytics?.categoryTotals) {
      return [];
    }

    return Object.entries(analytics.categoryTotals).map(([name, data]) => ({
      name,
      value: data.total,
      color: data.color,
    }));
  }, [analytics]);

  const barChartData = useMemo(() => {
    return dailySpending.map((d) => ({
      day: d.label,
      amount: d.total,
    }));
  }, [dailySpending]);

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-card border-2 border-primary/20 rounded-xl p-3 shadow-xl">
          <p className="text-sm font-bold text-foreground">
            {currencySymbol}
            {value.toLocaleString("en-IN", {
              minimumFractionDigits: 0,
              maximumFractionDigits: value % 1 === 0 ? 0 : 2,
            })}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percentage = ((value / totalExpense) * 100).toFixed(1);
      return (
        <div className="bg-card border-2 border-primary/20 rounded-xl p-3 shadow-xl">
          <p className="text-sm font-bold text-foreground mb-1">
            {payload[0].name}
          </p>
          <p className="text-sm text-muted-foreground">
            {currencySymbol}
            {value.toLocaleString("en-IN", {
              minimumFractionDigits: 0,
              maximumFractionDigits: value % 1 === 0 ? 0 : 2,
            })}{" "}
            ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-page-gradient">
      <div className="w-full px-3 py-6 space-y-6">
        {/* Balance and Expenses Cards with Premium Gradient */}
        <div className="grid grid-cols-2 gap-4 animate-fadeIn">
          <div className="relative overflow-hidden rounded-2xl shadow-xl transition-smooth hover:shadow-2xl hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-primary opacity-100"></div>
            <div className="absolute inset-0 shimmer"></div>
            <div className="relative p-6 flex flex-col h-full">
              <div className="text-sm text-white/80 mb-1 font-medium">
                Current Balance
              </div>
              <div
                className="font-bold mb-2 text-white"
                style={{
                  fontSize: (() => {
                    const formatted = `${currencySymbol}${balance.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: balance % 1 === 0 ? 0 : 2,
                      }
                    )}`;
                    const len = formatted.length;
                    if (len > 12) return "0.875rem";
                    if (len > 10) return "1rem";
                    if (len > 8) return "1.25rem";
                    if (len > 6) return "1.5rem";
                    return "1.875rem";
                  })(),
                  lineHeight: "1.2",
                  whiteSpace: "nowrap",
                }}
              >
                {currencySymbol}
                {balance.toLocaleString("en-IN", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: balance % 1 === 0 ? 0 : 2,
                })}
              </div>
              <div className="text-xs text-white/70 mt-auto">
                Available to spend
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-xl transition-smooth hover:shadow-2xl hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-danger opacity-100"></div>
            <div className="absolute inset-0 shimmer"></div>
            <div className="relative p-6 flex flex-col h-full">
              <div className="text-sm text-white/80 mb-1 font-medium">
                Total Expenses
              </div>
              <div
                className="font-bold mb-2 text-white"
                style={{
                  fontSize: (() => {
                    const formatted = `${currencySymbol}${totalExpense.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: totalExpense % 1 === 0 ? 0 : 2,
                      }
                    )}`;
                    const len = formatted.length;
                    if (len > 12) return "0.875rem";
                    if (len > 10) return "1rem";
                    if (len > 8) return "1.25rem";
                    if (len > 6) return "1.5rem";
                    return "1.875rem";
                  })(),
                  lineHeight: "1.2",
                  whiteSpace: "nowrap",
                }}
              >
                {currencySymbol}
                {totalExpense.toLocaleString("en-IN", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: totalExpense % 1 === 0 ? 0 : 2,
                })}
              </div>
              <div className="text-xs text-white/70 mt-auto">This month</div>
            </div>
          </div>
        </div>

        {/* Monthly Overview with Glass Effect */}
        <div
          className="animate-fadeIn card-elevated rounded-2xl overflow-hidden bg-card"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Monthly Budget
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currencySymbol}
                  {totalExpense.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: totalExpense % 1 === 0 ? 0 : 2,
                  })}{" "}
                  of {currencySymbol}
                  {monthlyBudget.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: monthlyBudget % 1 === 0 ? 0 : 2,
                  })}
                </p>
              </div>
              <div
                className="text-3xl font-bold"
                style={{
                  background:
                    (totalExpense / monthlyBudget) * 100 > 100
                      ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                      : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {((totalExpense / monthlyBudget) * 100).toFixed(0)}%
              </div>
            </div>
            <Progress
              value={totalExpense}
              max={monthlyBudget}
              variant="gradient"
              className="h-3"
            />
          </div>
        </div>

        {/* 7-Day Spending Chart with Enhanced Card */}
        {dailySpending.length > 0 && dailySpending.some((d) => d.total > 0) && (
          <div
            className="animate-fadeIn card-elevated rounded-2xl overflow-hidden bg-card"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="p-6 pb-2">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                7-Day Spending
              </h3>
              <p className="text-sm text-muted-foreground">
                Your spending trend this week
              </p>
            </div>
            <div className="px-2 pb-6">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={barChartData}
                  margin={{ top: 30, right: 15, left: 0, bottom: 5 }}
                >
                  <XAxis
                    dataKey="day"
                    tick={{
                      fill: "var(--color-muted-foreground)",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fill: "var(--color-muted-foreground)",
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={45}
                    domain={[0, "auto"]}
                    tickCount={5}
                    tickFormatter={(value) =>
                      `${currencySymbol}${Math.round(value)}`
                    }
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={false} />
                  <Bar
                    dataKey="amount"
                    fill="url(#barGradient)"
                    radius={[12, 12, 0, 0]}
                    label={{
                      position: "top",
                      fill: "var(--color-foreground)",
                      fontSize: 11,
                      fontWeight: 600,
                      formatter: (value) =>
                        value > 0
                          ? `${currencySymbol}${value.toLocaleString("en-IN", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}`
                          : "",
                    }}
                  />
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor="#dc2626"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Category Breakdown with Modern Design */}
        {analytics?.categoryTotals &&
          Object.keys(analytics.categoryTotals).length > 0 && (
            <div
              className="animate-fadeIn card-elevated rounded-2xl overflow-hidden bg-card"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="p-6 pb-2">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Category Breakdown
                </h3>
                <p className="text-sm text-muted-foreground">
                  Where your money goes
                </p>
              </div>
              <div className="px-2 pb-6">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart
                    margin={{ top: 25, right: 10, bottom: 10, left: 10 }}
                  >
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="47%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ value, percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value) => (
                        <span className="text-sm text-muted-foreground font-medium">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        {/* Top Categories with Enhanced Design */}
        {analytics?.categoryTotals &&
          Object.keys(analytics.categoryTotals).length > 0 && (
            <div
              className="animate-fadeIn card-elevated rounded-2xl overflow-hidden bg-card"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="p-6 pb-4">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Top Categories
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Your biggest spending areas
                </p>
                <div className="space-y-5">
                  {Object.entries(analytics.categoryTotals)
                    .sort((a, b) => b[1].total - a[1].total)
                    .slice(0, 5)
                    .map(([name, data]) => {
                      const percentage = (
                        (data.total / totalExpense) *
                        100
                      ).toFixed(1);
                      const category = categories.find((c) => c.name === name);
                      const IconComponent = category?.icon
                        ? Icons[category.icon]
                        : Icons.Circle;

                      return (
                        <div
                          key={name}
                          className="transition-smooth hover:scale-[1.01]"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div
                                className="p-2.5 rounded-xl"
                                style={{
                                  background: `${data.color}20`,
                                }}
                              >
                                <IconComponent
                                  size={20}
                                  style={{ color: data.color }}
                                  strokeWidth={2.5}
                                />
                              </div>
                              <span className="text-foreground font-medium">
                                {name}
                              </span>
                            </div>
                            <span className="text-foreground font-semibold">
                              {currencySymbol}
                              {data.total.toLocaleString("en-IN", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits:
                                  data.total % 1 === 0 ? 0 : 2,
                              })}
                            </span>
                          </div>
                          <div className="relative h-2.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                background: `linear-gradient(90deg, ${data.color} 0%, ${data.color}dd 100%)`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

        {/* Quick Actions with Modern Buttons */}
        <div
          className="flex items-stretch gap-4 animate-fadeIn"
          style={{ animationDelay: "0.5s" }}
        >
          <button
            onClick={() => navigate("/expenses")}
            className="flex-1 py-4 px-6 rounded-2xl bg-card border-2 border-primary/20 text-primary font-semibold transition-smooth hover:border-primary hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 whitespace-nowrap"
            aria-label="View all expenses"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          </button>
          <button
            onClick={() => navigate("/add")}
            className="flex-1 py-4 px-6 rounded-2xl text-white font-semibold transition-smooth hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 relative overflow-hidden whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
            aria-label="Add new expense"
          >
            <div className="absolute inset-0 shimmer"></div>
            <TrendingUp className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>Add New</span>
          </button>
        </div>

        {/* Empty State with Modern Design */}
        {expenses.length === 0 && (
          <div
            className="animate-fadeIn card-elevated rounded-2xl overflow-hidden bg-card"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Expenses Yet
              </h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Start tracking your spending by adding your first expense
              </p>
              <button
                onClick={() => navigate("/add")}
                className="py-3 px-8 rounded-xl text-white font-semibold transition-smooth hover:shadow-xl hover:scale-[1.05] inline-flex items-center gap-2"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
                aria-label="Add your first expense"
              >
                <TrendingUp className="w-5 h-5" aria-hidden="true" />
                Add Expense
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
