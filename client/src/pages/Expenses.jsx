import React, { useState, useMemo, useEffect } from "react";
import { useData } from "../context/DataContext";
import { useSMS } from "../context/SMSContext";
import { useNavigate } from "react-router-dom";
import {
  Receipt,
  Filter,
  Search,
  Calendar,
  TrendingDown,
  Smartphone,
  Plus,
  Loader,
} from "lucide-react";
import * as Icons from "lucide-react";
import SMSExpenseCard from "../components/SMSExpenseCard";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../components/ui/use-toast";

const Expenses = () => {
  const { expenses, categories, settings, loading } = useData();
  const {
    extractedExpenses,
    importExpense,
    dismissExpense,
    isSupported,
    permissionGranted,
    scanSMS,
  } = useSMS();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [importingId, setImportingId] = useState(null);

  // Auto-scan on load if permitted
  useEffect(() => {
    if (isSupported && permissionGranted) {
      scanSMS(10);
    }
  }, [isSupported, permissionGranted]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(false);

  // Get currency symbol
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

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (exp) =>
          exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (exp) => exp.categoryId === parseInt(selectedCategory)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date) - new Date(a.date);
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "amount-desc":
          return parseFloat(b.amount) - parseFloat(a.amount);
        case "amount-asc":
          return parseFloat(a.amount) - parseFloat(b.amount);
        default:
          return 0;
      }
    });

    return filtered;
  }, [expenses, searchQuery, selectedCategory, sortBy]);

  // Calculate totals
  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce(
      (sum, exp) => sum + parseFloat(exp.amount),
      0
    );
  }, [filteredExpenses]);

  // Group by date
  const groupedExpenses = useMemo(() => {
    const groups = {};
    filteredExpenses.forEach((expense) => {
      const date = new Date(expense.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(expense);
    });
    return groups;
  }, [filteredExpenses]);

  const handleSaveDescription = async () => {
    // Removed - now handled in ExpenseDetail page
  };

  const handleDelete = async () => {
    // Removed - now handled in ExpenseDetail page
  };

  const openExpenseDetail = (expenseId) => {
    navigate(`/expenses/${expenseId}`);
  };

  const handleImport = async (expense) => {
    setImportingId(expense.rawSMS);
    try {
      await importExpense(expense);
      toast({
        variant: "success",
        title: "Expense imported",
        description: `${currencySymbol}${parseFloat(expense.amount).toFixed(
          2
        )} - ${expense.merchant || "Expense"}`,
      });
    } catch (error) {
      toast({
        variant: "error",
        title: "Import failed",
        description: "Failed to import expense",
      });
    } finally {
      setImportingId(null);
    }
  };

  const handleAddExpense = () => {
    navigate("/add");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="pb-24 space-y-6 animate-fade-in bg-page-gradient min-h-screen px-4 py-6">
      {/* New Expenses Found Section */}
      {extractedExpenses.length > 0 && (
        <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Smartphone className="text-primary" size={20} />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                New Expenses Found
              </h3>
            </div>
            <span className="bg-gradient-primary text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
              {extractedExpenses.length}
            </span>
          </div>

          <div className="space-y-2">
            {extractedExpenses.slice(0, 3).map((expense, idx) => (
              <SMSExpenseCard
                key={idx}
                expense={expense}
                onImport={handleImport}
                onDismiss={dismissExpense}
                saving={importingId === expense.rawSMS}
              />
            ))}
            {extractedExpenses.length > 3 && (
              <div className="text-center">
                <button className="text-sm text-primary font-medium hover:underline">
                  View all {extractedExpenses.length} pending expenses
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary Card */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl transition-smooth hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-danger"></div>
        <div className="absolute inset-0 shimmer"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/80 font-medium mb-1">
                Total Expenses
              </p>
              <h2 className="text-3xl font-extrabold text-white">
                {currencySymbol}{" "}
                {totalAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
              <p className="text-xs text-white/70 mt-1">
                {filteredExpenses.length} transaction
                {filteredExpenses.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/25">
              <TrendingDown size={28} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search expenses..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border-2 border-border focus:border-primary outline-none transition-smooth text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Filters Row */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold transition-smooth ${
            showFilters
              ? "bg-primary text-white shadow-lg"
              : "bg-card border-2 border-border text-foreground hover:border-primary/50"
          }`}
          aria-label={showFilters ? "Hide filters" : "Show filters"}
        >
          <Filter size={18} />
          Filters
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl bg-card border-2 border-border focus:border-primary outline-none transition-smooth text-foreground font-semibold"
          aria-label="Sort expenses by"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="animate-slide-up bg-card rounded-2xl p-4 border-2 border-border">
          <label className="block text-sm font-bold mb-2 text-foreground">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  <div className="flex items-center gap-2">
                    {cat.icon && Icons[cat.icon] && (
                      <span style={{ color: cat.color }}>
                        {React.createElement(Icons[cat.icon], { size: 16 })}
                      </span>
                    )}
                    {cat.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <div className="bg-card rounded-2xl p-12 text-center border-2 border-border">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-secondary">
            <Receipt size={40} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            No Expenses Found
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            {searchQuery || selectedCategory !== "all"
              ? "Try adjusting your filters"
              : "Start tracking your spending"}
          </p>
          <Button
            onClick={handleAddExpense}
            className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-smooth"
          >
            <Plus size={20} />
            Add Expense
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedExpenses).map(([date, dayExpenses]) => (
            <div key={date} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <h3 className="text-sm font-bold text-foreground">{date}</h3>
                </div>
                <span className="text-sm font-bold text-muted-foreground">
                  {currencySymbol}
                  {dayExpenses
                    .reduce((sum, e) => sum + parseFloat(e.amount), 0)
                    .toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </span>
              </div>

              {/* Expense Cards */}
              {dayExpenses.map((expense) => {
                const category = expense.category;
                const IconComponent = category?.icon
                  ? Icons[category.icon]
                  : Icons.Receipt;
                const categoryColor = category?.color || "#6366f1";

                return (
                  <button
                    key={expense.id}
                    onClick={() => openExpenseDetail(expense.id)}
                    className="w-full p-4 rounded-2xl bg-card border-2 border-border transition-smooth hover:shadow-lg hover:border-primary/50 hover:scale-[1.01] text-left"
                  >
                    <div className="flex items-center gap-3">
                      {/* Category Icon */}
                      <div
                        className="rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          width: "48px",
                          height: "48px",
                          background: `${categoryColor}20`,
                        }}
                      >
                        <IconComponent
                          size={24}
                          style={{ color: categoryColor }}
                          strokeWidth={2.5}
                        />
                      </div>

                      {/* Expense Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-base truncate text-foreground">
                          {expense.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          {category && (
                            <span className="font-medium">{category.name}</span>
                          )}
                          {category && <span>•</span>}
                          <span className="capitalize">
                            {expense.source.toLowerCase()}
                          </span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <p className="font-bold text-lg text-destructive whitespace-nowrap">
                          {currencySymbol}
                          {parseFloat(expense.amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Expenses;
