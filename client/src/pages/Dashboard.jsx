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
import { Wallet, TrendingUp, Loader, ArrowRight } from "lucide-react";
import { useData } from "../context/DataContext";
import { useSMS } from "../context/SMSContext";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";

const Dashboard = () => {
  const { expenses, categories, settings, loading } = useData();
  const { scanSMS, importExpense, isSupported, permissionGranted } = useSMS();
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
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-gray-900">
            {currencySymbol}
            {payload[0].value.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
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
      const percentage = ((payload[0].value / totalExpense) * 100).toFixed(1);
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600">
            {currencySymbol}
            {payload[0].value.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
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
    <div className="min-h-screen pb-24">
      <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
        {/* Balance and Expenses Cards with Gradient */}
        <div className="grid grid-cols-2 gap-4 animate-fadeIn">
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm opacity-90 mb-1">Current Balance</div>
              <div className="text-2xl font-semibold mb-2">
                {currencySymbol}
                {balance.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-xs opacity-75">Available to spend</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm opacity-90 mb-1">Total Expenses</div>
              <div className="text-2xl font-semibold mb-2">
                {currencySymbol}
                {totalExpense.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-xs opacity-75">This month</div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Overview with Progress Component */}
        <Card className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-base mb-1">Monthly Budget</CardTitle>
                <CardDescription>
                  {currencySymbol}
                  {totalExpense.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  of {currencySymbol}
                  {monthlyBudget.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </CardDescription>
              </div>
              <div
                className="text-2xl font-semibold"
                style={{
                  color:
                    (totalExpense / monthlyBudget) * 100 > 100
                      ? "var(--color-destructive)"
                      : "#10b981",
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
          </CardContent>
        </Card>

        {/* 7-Day Spending Chart */}
        {dailySpending.length > 0 && dailySpending.some((d) => d.total > 0) && (
          <Card className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle>7-Day Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barChartData}>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      `${currencySymbol}${value.toLocaleString()}`
                    }
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={false} />
                  <Bar
                    dataKey="amount"
                    fill="rgba(239, 68, 68, 0.8)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Category Breakdown */}
        {analytics?.categoryTotals &&
          Object.keys(analytics.categoryTotals).length > 0 && (
            <Card className="animate-fadeIn" style={{ animationDelay: "0.3s" }}>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
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
                        <span className="text-sm text-gray-600">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

        {/* Top Categories */}
        {analytics?.categoryTotals &&
          Object.keys(analytics.categoryTotals).length > 0 && (
            <Card className="animate-fadeIn" style={{ animationDelay: "0.4s" }}>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                        <div key={name}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">
                                <IconComponent
                                  size={24}
                                  style={{ color: data.color }}
                                />
                              </span>
                              <span className="text-foreground">{name}</span>
                            </div>
                            <span className="text-foreground font-medium">
                              {currencySymbol}
                              {data.total.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                          <Progress
                            value={data.total}
                            max={totalExpense}
                            variant="default"
                            className="h-2"
                            style={{
                              "--tw-gradient-from": data.color,
                              "--tw-gradient-to": data.color,
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Quick Actions */}
        <div
          className="grid grid-cols-2 gap-4 animate-fadeIn"
          style={{ animationDelay: "0.5s" }}
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/expenses")}
            className="h-auto py-4"
            aria-label="View all expenses"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </Button>
          <Button
            size="lg"
            onClick={() => navigate("/add")}
            className="h-auto py-4 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            aria-label="Add new expense"
          >
            <TrendingUp className="w-4 h-4 mr-2" aria-hidden="true" />
            <span>Add New</span>
          </Button>
        </div>

        {/* Empty State */}
        {expenses.length === 0 && (
          <Card className="animate-fadeIn" style={{ animationDelay: "0.4s" }}>
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No Expenses Yet</CardTitle>
              <CardDescription className="mb-6">
                Start tracking your spending by adding your first expense
              </CardDescription>
              <Button
                size="lg"
                onClick={() => navigate("/add")}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                aria-label="Add your first expense"
              >
                <TrendingUp className="w-5 h-5 mr-2" aria-hidden="true" />
                Add Expense
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
