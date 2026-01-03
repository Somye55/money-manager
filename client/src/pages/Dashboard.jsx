import React, { useMemo, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Wallet,
  TrendingUp,
  Loader,
  Smartphone,
  RefreshCw,
  ArrowRight,
  Receipt,
  Calendar,
  TrendingDown,
  PieChart,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { useSMS } from "../context/SMSContext";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import SMSExpenseCard from "../components/SMSExpenseCard";
import BudgetOverview from "../components/BudgetOverview";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { expenses, categories, settings, loading } = useData();
  const {
    extractedExpenses,
    scanSMS,
    importExpense,
    dismissExpense,
    isSupported,
    permissionGranted,
  } = useSMS();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [importingId, setImportingId] = useState(null);
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

  const handleImport = async (expense) => {
    setImportingId(expense.rawSMS);
    try {
      await importExpense(expense);
    } finally {
      setImportingId(null);
    }
  };

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

  const doughnutData = useMemo(() => {
    if (!analytics?.categoryTotals) {
      return {
        labels: [],
        datasets: [
          {
            label: "Expenses",
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 3,
          },
        ],
      };
    }

    const labels = Object.keys(analytics.categoryTotals);
    const data = labels.map((label) => analytics.categoryTotals[label].total);
    const colors = labels.map((label) => analytics.categoryTotals[label].color);

    return {
      labels,
      datasets: [
        {
          label: "Expenses",
          data,
          backgroundColor: colors.map((color) => `${color}CC`),
          borderColor: colors,
          borderWidth: 3,
        },
      ],
    };
  }, [analytics]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "var(--text-secondary)",
          padding: 15,
          font: {
            size: 12,
            weight: "500",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "600",
        },
        bodyFont: {
          size: 13,
        },
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const percentage = ((context.parsed / totalExpense) * 100).toFixed(
              1
            );
            return ` ${currencySymbol}${context.parsed.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barData = useMemo(() => {
    return {
      labels: dailySpending.map((d) => d.label),
      datasets: [
        {
          label: "Daily Spending",
          data: dailySpending.map((d) => d.total),
          backgroundColor: dailySpending.map((d) =>
            d.total > 0 ? "rgba(239, 68, 68, 0.8)" : "rgba(156, 163, 175, 0.3)"
          ),
          borderColor: dailySpending.map((d) =>
            d.total > 0 ? "rgba(239, 68, 68, 1)" : "rgba(156, 163, 175, 0.5)"
          ),
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  }, [dailySpending]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "600",
        },
        bodyFont: {
          size: 13,
        },
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return ` ${currencySymbol}${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
        ticks: {
          color: "var(--text-tertiary)",
          font: {
            size: 11,
          },
          callback: function (value) {
            return currencySymbol + value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "var(--text-tertiary)",
          font: {
            size: 11,
            weight: "500",
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-40">
        <div className="max-w-screen-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="gradient-text">Money Manager</h1>
          </div>
        </div>
      </header>

      <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
        {/* Balance and Expenses Cards */}
        <div className="grid grid-cols-2 gap-4 animate-fadeIn">
          <div className="p-6 bg-gradient-to-br from-primary to-secondary text-primary-foreground border-0 rounded-lg shadow-lg">
            <div className="text-sm opacity-90 mb-1">Current Balance</div>
            <div className="text-2xl mb-2">
              {currencySymbol}
              {balance.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-xs opacity-75">Available to spend</div>
          </div>

          <div className="p-6 bg-gradient-to-br from-primary to-secondary text-primary-foreground border-0 rounded-lg shadow-lg">
            <div className="text-sm opacity-90 mb-1">Total Expenses</div>
            <div className="text-2xl mb-2">
              {currencySymbol}
              {totalExpense.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-xs opacity-75">This month</div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div
          className="card p-6 animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-foreground">Monthly Budget</h3>
              <p className="text-sm text-muted-foreground">
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
              </p>
            </div>
            <div
              className="text-2xl"
              style={{
                color:
                  (totalExpense / monthlyBudget) * 100 > 100
                    ? "var(--destructive)"
                    : "var(--success)",
              }}
            >
              {((totalExpense / monthlyBudget) * 100).toFixed(0)}%
            </div>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 bg-gradient-to-r from-primary to-secondary"
              style={{
                width: `${Math.min(
                  (totalExpense / monthlyBudget) * 100,
                  100
                )}%`,
                opacity: (totalExpense / monthlyBudget) * 100 > 100 ? 0.7 : 1,
              }}
            />
          </div>
        </div>

        {/* 7-Day Spending Chart */}
        {dailySpending.length > 0 && dailySpending.some((d) => d.total > 0) && (
          <div
            className="card p-6 animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-foreground mb-4">7-Day Spending</h3>
            <div style={{ height: "220px" }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {analytics?.categoryTotals &&
          Object.keys(analytics.categoryTotals).length > 0 && (
            <div
              className="card p-6 animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="text-foreground mb-4">Category Breakdown</h3>
              <div style={{ height: "280px" }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          )}

        {/* Top Categories */}
        {analytics?.categoryTotals &&
          Object.keys(analytics.categoryTotals).length > 0 && (
            <div
              className="card p-6 animate-fadeIn"
              style={{ animationDelay: "0.4s" }}
            >
              <h3 className="text-foreground mb-4">Top Categories</h3>
              <div className="space-y-4">
                {Object.entries(analytics.categoryTotals)
                  .sort((a, b) => b[1].total - a[1].total)
                  .slice(0, 5)
                  .map(([name, data], index) => {
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
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                              backgroundColor: data.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

        {/* Quick Actions */}
        <div
          className="grid grid-cols-2 gap-4 animate-fadeIn"
          style={{ animationDelay: "0.5s" }}
        >
          <button
            onClick={() => navigate("/expenses")}
            className="card p-4 hover:shadow-xl transition flex items-center justify-center"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          <button
            onClick={() => navigate("/add")}
            className="bg-gradient-to-br from-primary to-secondary text-primary-foreground p-4 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            <span>Add New</span>
          </button>
        </div>

        {/* Empty State */}
        {expenses.length === 0 && (
          <div
            className="card p-12 text-center animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-foreground mb-2">No Expenses Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start tracking your spending by adding your first expense
            </p>
            <button
              onClick={() => navigate("/add")}
              className="bg-gradient-to-br from-primary to-secondary text-primary-foreground px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition inline-flex items-center"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Add Expense
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
