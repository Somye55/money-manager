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
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div
          className="card p-4 animate-slide-up"
          style={{
            background: "var(--gradient-success)",
            border: "none",
            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "0.5rem",
                  borderRadius: "0.75rem",
                }}
              >
                <Wallet size={20} className="text-white" />
              </div>
            </div>
            <p className="text-sm text-white opacity-90 font-medium">Balance</p>
            <h2 className="text-2xl font-extrabold text-white mt-auto">
              {currencySymbol}{" "}
              {balance.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </h2>
          </div>
        </div>

        <div
          className="card p-4 animate-slide-up"
          style={{
            background: "var(--gradient-danger)",
            border: "none",
            boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)",
            animationDelay: "0.1s",
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "0.5rem",
                  borderRadius: "0.75rem",
                }}
              >
                <TrendingDown size={20} className="text-white" />
              </div>
            </div>
            <p className="text-sm text-white opacity-90 font-medium">
              Expenses
            </p>
            <h2 className="text-2xl font-extrabold text-white mt-auto">
              {currencySymbol}{" "}
              {totalExpense.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </h2>
          </div>
        </div>
      </div>

      <div
        className="card p-4 animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold">Monthly Overview</h3>
          <TrendingUp size={20} className="text-primary" />
        </div>
        <p className="text-sm text-tertiary mb-4">{currentMonth}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
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
                        ? "var(--gradient-danger)"
                        : "var(--gradient-primary)",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
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

      <div
        className="grid grid-cols-2 gap-3 animate-slide-up"
        style={{ animationDelay: "0.6s" }}
      >
        <button
          onClick={() => navigate("/expenses")}
          className="card p-4 flex items-center justify-between hover:shadow-lg transition"
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Receipt size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">View All</p>
              <p className="text-xs text-tertiary">
                {expenses.length} expenses
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="text-tertiary" />
        </button>

        <button
          onClick={() => navigate("/add")}
          className="card p-4 flex items-center justify-between hover:shadow-lg transition"
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: "var(--gradient-secondary)" }}
            >
              <TrendingUp size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Add New</p>
              <p className="text-xs text-tertiary">Track expense</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-tertiary" />
        </button>
      </div>

      {expenses.length === 0 && (
        <div
          className="card p-8 text-center animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Receipt size={48} className="mx-auto text-tertiary mb-3" />
          <p className="text-tertiary mb-4">
            No expenses yet. Add your first expense to get started!
          </p>
          <button
            onClick={() => navigate("/add")}
            className="btn btn-primary"
            style={{ background: "var(--gradient-primary)" }}
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
