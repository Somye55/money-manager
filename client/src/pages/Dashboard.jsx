import React, { useMemo, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Wallet, TrendingUp, Loader } from 'lucide-react';
import { useData } from '../context/DataContext';
import * as Icons from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { expenses, categories, settings, loading } = useData();
  const [analytics, setAnalytics] = useState(null);

  // Calculate analytics from expenses
  useEffect(() => {
    if (!expenses || expenses.length === 0) {
      setAnalytics(null);
      return;
    }

    // Calculate totals by category
    const categoryTotals = {};
    let totalExpense = 0;

    expenses.forEach((expense) => {
      const amount = parseFloat(expense.amount);
      totalExpense += amount;

      const categoryName = expense.category?.name || 'Uncategorized';
      const categoryColor = expense.category?.color || '#6366f1';

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

    setAnalytics({ categoryTotals, totalExpense });
  }, [expenses]);

  const totalExpense = analytics?.totalExpense || 0;
  const monthlyBudget = settings?.monthlyBudget ? parseFloat(settings.monthlyBudget) : 50000; // Default budget
  const balance = monthlyBudget - totalExpense;

  // Get currency symbol
  const currencySymbol = settings?.currency === 'USD' ? '$' 
    : settings?.currency === 'EUR' ? '€'
    : settings?.currency === 'GBP' ? '£'
    : settings?.currency === 'JPY' ? '¥'
    : '₹'; // Default to INR

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!analytics?.categoryTotals) {
      return {
        labels: [],
        datasets: [{
          label: 'Expenses',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 2,
        }],
      };
    }

    const labels = Object.keys(analytics.categoryTotals);
    const data = labels.map((label) => analytics.categoryTotals[label].total);
    const colors = labels.map((label) => analytics.categoryTotals[label].color);

    return {
      labels,
      datasets: [
        {
          label: 'Expenses',
          data,
          backgroundColor: colors.map(color => `${color}CC`), // Add transparency
          borderColor: colors,
          borderWidth: 2,
        },
      ],
    };
  }, [analytics]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'var(--text-secondary)',
          padding: 15,
          font: {
            size: 12,
            weight: '500'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return ` ${currencySymbol}${context.parsed.toLocaleString()}`;
          }
        }
      }
    },
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 animate-slide-up" style={{
          background: 'var(--gradient-success)',
          border: 'none',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
        }}>
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0.5rem',
                borderRadius: '0.75rem'
              }}>
                <Wallet size={20} className="text-white" />
              </div>
            </div>
            <p className="text-sm text-white opacity-90 font-medium">Balance</p>
            <h2 className="text-2xl font-extrabold text-white mt-auto">
              {currencySymbol} {balance.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h2>
          </div>
        </div>

        <div className="card p-4 animate-slide-up" style={{
          background: 'var(--gradient-danger)',
          border: 'none',
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
          animationDelay: '0.1s'
        }}>
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0.5rem',
                borderRadius: '0.75rem'
              }}>
                <TrendingUp size={20} className="text-white" />
              </div>
            </div>
            <p className="text-sm text-white opacity-90 font-medium">Expenses</p>
            <h2 className="text-2xl font-extrabold text-white mt-auto">
              {currencySymbol} {totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h2>
          </div>
        </div>
      </div>

      {/* Spending Overview Card */}
      <div className="card p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
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
                    width: `${Math.min((totalExpense / monthlyBudget) * 100, 100)}%`,
                    background: totalExpense > monthlyBudget ? 'var(--gradient-danger)' : 'var(--gradient-primary)'
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-tertiary font-medium">
              {((totalExpense / monthlyBudget) * 100).toFixed(1)}% of budget spent
            </span>
            <span className={`font-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
              {currencySymbol} {Math.abs(balance).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {balance >= 0 ? 'left' : 'over'}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      {analytics?.categoryTotals && Object.keys(analytics.categoryTotals).length > 0 && (
        <div className="card p-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-bold mb-4">Spend Analysis</h3>
          <div style={{ height: '280px' }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Recent Transactions</h3>
        </div>
        
        {expenses.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-tertiary">No expenses yet. Add your first expense to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.slice(0, 10).map((expense, index) => {
              const category = expense.category;
              const IconComponent = category?.icon ? Icons[category.icon] : Icons.Circle;
              const categoryColor = category?.color || '#6366f1';
              
              return (
                <div 
                  key={expense.id} 
                  className="card p-4 flex-between transition hover:shadow-lg"
                  style={{ 
                    animationDelay: `${0.5 + (index * 0.1)}s`,
                    cursor: 'pointer'
                  }}
                >
                  <div className="flex gap-3 items-center">
                    <div 
                      className="rounded-xl flex items-center justify-center"
                      style={{
                        width: '48px',
                        height: '48px',
                        background: `${categoryColor}20`
                      }}
                    >
                      <IconComponent size={22} style={{ color: categoryColor }} />
                    </div>
                    <div>
                      <p className="font-semibold text-base">{expense.description}</p>
                      <p className="text-sm text-tertiary">
                        {new Date(expense.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        {category && ` • ${category.name}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-base text-danger">
                      - {currencySymbol}{parseFloat(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-tertiary capitalize">{expense.source.toLowerCase()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add some bottom padding for the nav */}
      <div style={{ height: '20px' }} />
    </div>
  );
};

export default Dashboard;
