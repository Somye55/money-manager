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
import { useData } from "../context/DataContext";
import { useSMS } from "../context/SMSContext";
import { useNavigate } from "react-router-dom";
import SMSExpenseCard from "../components/SMSExpenseCard";
import {
  BalanceCard,
  ExpenseSummaryCard,
  CategoryBreakdownCard,
  SpendingTrendCard,
  QuickActionsCard,
  EmptyStateCard,
} from "../components/dashboard";

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
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="page-container fade-in">
      {/* Hero Section - Balance and Expense Summary */}
      <div className="stack section">
        <BalanceCard
          balance={balance}
          monthlyBudget={monthlyBudget}
          totalExpense={totalExpense}
          currencySymbol={currencySymbol}
        />

        <ExpenseSummaryCard
          totalExpense={totalExpense}
          expenseCount={expenses.length}
          currencySymbol={currencySymbol}
          currentMonth={currentMonth}
        />
      </div>

      {/* SMS Expense Cards */}
      {extractedExpenses.length > 0 && (
        <div className="stack section slide-up delay-1">
          <h3 className="heading-3 px-1">SMS Expenses Found</h3>
          {extractedExpenses.map((expense, index) => (
            <SMSExpenseCard
              key={expense.rawSMS}
              expense={expense}
              onImport={() => handleImport(expense)}
              onDismiss={() => dismissExpense(expense.rawSMS)}
              isImporting={importingId === expense.rawSMS}
            />
          ))}
        </div>
      )}

      {/* Analytics Section */}
      {expenses.length > 0 ? (
        <>
          {/* Spending Trend */}
          {dailySpending.length > 0 &&
            dailySpending.some((d) => d.total > 0) && (
              <div className="section slide-up delay-2">
                <SpendingTrendCard
                  dailySpending={dailySpending}
                  currencySymbol={currencySymbol}
                />
              </div>
            )}

          {/* Category Breakdown */}
          <div className="section slide-up delay-3">
            <CategoryBreakdownCard
              categoryTotals={analytics?.categoryTotals || {}}
              totalExpense={totalExpense}
              currencySymbol={currencySymbol}
              categories={categories}
            />
          </div>

          {/* Quick Actions */}
          <div className="section slide-up delay-4">
            <QuickActionsCard
              onNavigate={navigate}
              expenseCount={expenses.length}
            />
          </div>
        </>
      ) : (
        /* Empty State */
        <EmptyStateCard onAddExpense={() => navigate("/add")} />
      )}
    </div>
  );
};

export default Dashboard;
