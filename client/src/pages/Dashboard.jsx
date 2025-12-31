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
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      {/* Balance and Expenses Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="card p-5 animate-slide-up"
          style={{
            background: "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
            border: "none",
            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.25)",
            borderRadius: "1.25rem",
            minHeight: "140px",
          }}
        >
          <div className="flex flex-col h-full justify-between">
            <div
              style={{
                background: "rgba(255, 255, 255, 0.25)",
                padding: "0.5rem",
                borderRadius: "0.75rem",
                width: "fit-content",
              }}
            >
              <Wallet size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-white opacity-90 font-medium mb-1">
                Balance
              </p>
              <h2 className="text-2xl font-extrabold text-white">
                {currencySymbol}{" "}
                {balance.toLocaleString("en-IN", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </h2>
            </div>
          </div>
        </div>

        <div
          className="card p-5 animate-slide-up"
          style={{
            background: "linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)",
            border: "none",
            boxShadow: "0 8px 24px rgba(239, 68, 68, 0.25)",
            borderRadius: "1.25rem",
            minHeight: "140px",
            animationDelay: "0.05s",
          }}
        >
          <div className="flex flex-col h-full justify-between">
            <div
              style={{
                background: "rgba(255, 255, 255, 0.25)",
                padding: "0.5rem",
                borderRadius: "0.75rem",
                width: "fit-content",
              }}
            >
              <TrendingDown size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-white opacity-90 font-medium mb-1">
                Expenses
              </p>
              <h2 className="text-2xl font-extrabold text-white">
                {currencySymbol}{" "}
                {totalExpense.toLocaleString("en-IN", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div
        className="card p-4 animate-slide-up"
        style={{ animationDelay: "0.1s", borderRadius: "1.25rem" }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold">Monthly Overview</h3>
          <TrendingUp size={18} className="text-primary" />
        </div>
        <p className="text-xs text-tertiary mb-4">{currentMonth}</p>

        <div className="space-y-2">
          <div className="w-full bg-bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  (totalExpense / monthlyBudget) * 100,
                  100
                )}%`,
                background:
                  totalExpense > monthlyBudget
                    ? "linear-gradient(90deg, #f43f5e 0%, #ec4899 100%)"
                    : "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-tertiary font-medium">
              {((totalExpense / monthlyBudget) * 100).toFixed(1)}% of budget
              spent
            </span>
            <span
              className={`font-bold ${
                balance >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {currencySymbol}{" "}
              {Math.abs(balance).toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              {balance >= 0 ? "left" : "over"}
            </span>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
        <BudgetOverview />
      </div>

      {dailySpending.length > 0 && dailySpending.some((d) => d.total > 0) && (
        <div
          className="card p-4 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">Last 7 Days</h3>
              <p className="text-sm text-tertiary">Daily spending trend</p>
            </div>
            <Calendar size={20} className="text-primary" />
          </div>
          <div style={{ height: "220px" }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      )}

      {analytics?.categoryTotals &&
        Object.keys(analytics.categoryTotals).length > 0 && (
          <div
            className="card p-4 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Category Breakdown</h3>
                <p className="text-sm text-tertiary">Spending by category</p>
              </div>
              <PieChart size={20} className="text-primary" />
            </div>
            <div style={{ height: "280px" }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        )}

      {analytics?.categoryTotals &&
        Object.keys(analytics.categoryTotals).length > 0 && (
          <div
            className="card p-4 animate-slide-up"
            style={{ animationDelay: "0.5s" }}
          >
            <h3 className="text-lg font-bold mb-4">Top Categories</h3>
            <div className="space-y-3">
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
                    <div key={name} className="flex items-center gap-3">
                      <div
                        className="rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          width: "40px",
                          height: "40px",
                          background: `${data.color}20`,
                        }}
                      >
                        <IconComponent
                          size={20}
                          style={{ color: data.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm">{name}</p>
                          <p className="font-bold text-sm text-danger">
                            {currencySymbol}
                            {data.total.toLocaleString("en-IN", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-bg-secondary rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: data.color,
                              }}
                            />
                          </div>
                          <span className="text-xs text-tertiary font-medium">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

      {/* Quick Actions */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up"
        style={{ animationDelay: "0.15s" }}
      >
        <button
          onClick={() => navigate("/expenses")}
          className="card p-5 flex flex-col items-start hover:shadow-lg transition min-h-[120px]"
          style={{ borderRadius: "1.25rem" }}
        >
          <div
            className="p-2.5 rounded-xl mb-3"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <Receipt size={20} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-base mb-0.5">View All</p>
            <p className="text-xs text-tertiary">{expenses.length} expenses</p>
          </div>
          <ArrowRight size={16} className="text-tertiary mt-auto self-end" />
        </button>

        <button
          onClick={() => navigate("/add")}
          className="card p-5 flex flex-col items-start hover:shadow-lg transition min-h-[120px]"
          style={{ borderRadius: "1.25rem" }}
        >
          <div
            className="p-2.5 rounded-xl mb-3"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
            }}
          >
            <TrendingUp size={20} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-base mb-0.5">Add New</p>
            <p className="text-xs text-tertiary">Track expense</p>
          </div>
          <ArrowRight size={16} className="text-tertiary mt-auto self-end" />
        </button>
      </div>

      {expenses.length === 0 && (
        <div
          className="card p-6 sm:p-8 text-center animate-slide-up"
          style={{ animationDelay: "0.2s", borderRadius: "1.25rem" }}
        >
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--bg-secondary)" }}
          >
            <Receipt size={32} className="text-tertiary" />
          </div>
          <p className="text-tertiary mb-4 text-sm">
            No expenses yet. Add your first expense to get started!
          </p>
          <button
            onClick={() => navigate("/add")}
            className="btn btn-primary"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              padding: "0.875rem 1.75rem",
              borderRadius: "0.75rem",
            }}
          >
            Add Your First Expense
          </button>
        </div>
      )}

      <div style={{ height: "20px" }} />
    </div>
  );
};

export default Dashboard;
