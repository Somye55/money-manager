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
  Edit2,
  Trash2,
  Loader2,
  ChevronDown,
  X,
  Save,
  DollarSign,
  FileText,
  Tag as TagIcon,
  Smartphone,
  Plus,
} from "lucide-react";
import * as Icons from "lucide-react";
import SMSExpenseCard from "../components/SMSExpenseCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Expenses = () => {
  const {
    expenses,
    categories,
    settings,
    removeExpense,
    modifyExpense,
    loading,
  } = useData();
  const {
    extractedExpenses,
    importExpense,
    dismissExpense,
    isSupported,
    permissionGranted,
    scanSMS,
  } = useSMS();
  const navigate = useNavigate();
  const [importingId, setImportingId] = useState(null);

  useEffect(() => {
    if (isSupported && permissionGranted) {
      scanSMS(10);
    }
  }, [isSupported, permissionGranted]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    amount: "",
    description: "",
    categoryId: "",
    date: "",
  });
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];
    if (searchQuery) {
      filtered = filtered.filter(
        (exp) =>
          exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (exp) => exp.categoryId === parseInt(selectedCategory)
      );
    }
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

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce(
      (sum, exp) => sum + parseFloat(exp.amount),
      0
    );
  }, [filteredExpenses]);

  const groupedExpenses = useMemo(() => {
    const groups = {};
    filteredExpenses.forEach((expense) => {
      const date = new Date(expense.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(expense);
    });
    return groups;
  }, [filteredExpenses]);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setEditForm({
      amount: expense.amount.toString(),
      description: expense.description,
      categoryId: expense.categoryId?.toString() || "",
      date: new Date(expense.date).toISOString().split("T")[0],
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm.amount || !editForm.description) return;
    setSaving(true);
    try {
      await modifyExpense(editingExpense.id, {
        amount: parseFloat(editForm.amount),
        description: editForm.description,
        categoryId: editForm.categoryId ? parseInt(editForm.categoryId) : null,
        date: new Date(editForm.date).toISOString(),
      });
      setShowEditModal(false);
      setEditingExpense(null);
    } catch (error) {
      console.error("Error updating expense:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    setDeleting(id);
    try {
      await removeExpense(id);
    } catch (error) {
      console.error("Error deleting expense:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handleImport = async (expense) => {
    setImportingId(expense.rawSMS);
    try {
      await importExpense(expense);
    } finally {
      setImportingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-icon">
          <Receipt />
        </div>
        <div className="page-header-content">
          <h1 className="page-header-title">Expenses</h1>
          <p className="page-header-subtitle">
            {filteredExpenses.length} transactions
          </p>
        </div>
      </div>

      <div className="stack">
        {/* SMS Expenses */}
        {extractedExpenses.length > 0 && (
          <div className="slide-up stack-sm">
            <div className="flex items-center justify-between">
              <div className="section-title">
                <Smartphone size={18} />
                <span>New Expenses Found</span>
              </div>
              <span className="badge badge-primary font-semibold">
                {extractedExpenses.length}
              </span>
            </div>
            <div className="stack-sm">
              {extractedExpenses.slice(0, 3).map((expense, idx) => (
                <SMSExpenseCard
                  key={idx}
                  expense={expense}
                  onImport={() => handleImport(expense)}
                  onDismiss={() => dismissExpense(expense.rawSMS)}
                  isImporting={importingId === expense.rawSMS}
                />
              ))}
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-rose-500 via-red-500 to-orange-600 text-white shadow-lg shadow-red-500/25">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <div className="absolute inset-0 bg-white rounded-full transform translate-x-8 -translate-y-8" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-white/80 font-medium">
                Total Expenses
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {currencySymbol}
                {totalAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <TrendingDown size={28} className="text-white" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="stack-sm">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses..."
              className="form-input pl-11"
            />
          </div>

          <div className="grid-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all min-h-[48px] touch-manipulation",
                showFilters
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground active:border-primary/50"
              )}
            >
              <Filter size={16} />
              Filters
              <ChevronDown
                size={14}
                className={cn(
                  "transition-transform",
                  showFilters && "rotate-180"
                )}
              />
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input form-select"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>

          {showFilters && (
            <Card className="slide-up">
              <CardContent className="card-body">
                <label className="form-label">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-input form-select"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Expenses List */}
        {filteredExpenses.length === 0 ? (
          <Card>
            <CardContent className="empty-state">
              <Receipt className="empty-state-icon" />
              <p className="empty-state-title">No expenses found</p>
              <p className="empty-state-description">
                Start tracking your spending by adding your first expense
              </p>
              <Button onClick={() => navigate("/add")}>
                <Plus size={18} />
                Add Your First Expense
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="stack">
            {Object.entries(groupedExpenses).map(([date, dayExpenses]) => (
              <div key={date} className="stack-sm">
                <div className="flex items-center gap-2 px-1">
                  <Calendar size={14} className="text-muted-foreground" />
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {date}
                  </h3>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    {currencySymbol}
                    {dayExpenses
                      .reduce((sum, e) => sum + parseFloat(e.amount), 0)
                      .toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {dayExpenses.map((expense) => {
                  const category = expense.category;
                  const IconComponent = category?.icon
                    ? Icons[category.icon]
                    : Icons.Circle;
                  const categoryColor = category?.color || "#6366f1";

                  return (
                    <Card key={expense.id} className="card-interactive">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${categoryColor}20` }}
                          >
                            <IconComponent
                              size={20}
                              style={{ color: categoryColor }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate text-[15px]">
                              {expense.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {category && <span>{category.name}</span>}
                              <span>•</span>
                              <span className="capitalize">
                                {expense.source.toLowerCase()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <div className="text-right mr-1">
                              <p className="font-bold text-destructive whitespace-nowrap text-[15px]">
                                -{currencySymbol}
                                {parseFloat(expense.amount).toLocaleString(
                                  "en-IN",
                                  { minimumFractionDigits: 2 }
                                )}
                              </p>
                            </div>

                            <button
                              onClick={() => handleEdit(expense)}
                              className="btn-icon-sm btn-ghost"
                            >
                              <Edit2 size={16} className="text-primary" />
                            </button>
                            <button
                              onClick={() => handleDelete(expense.id)}
                              disabled={deleting === expense.id}
                              className="btn-icon-sm btn-ghost"
                            >
                              {deleting === expense.id ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin text-destructive"
                                />
                              ) : (
                                <Trash2
                                  size={16}
                                  className="text-destructive"
                                />
                              )}
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <Card
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl scale-in"
            style={{ maxHeight: "90vh" }}
          >
            <CardContent className="card-body overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-3">Edit Expense</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="btn-icon-sm btn-ghost"
                >
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>

              <div className="stack">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label inline-sm">
                    <DollarSign size={16} className="text-primary" />
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      inputMode="decimal"
                      value={editForm.amount}
                      onChange={(e) =>
                        setEditForm({ ...editForm, amount: e.target.value })
                      }
                      className="form-input pl-10"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label inline-sm">
                    <FileText size={16} className="text-primary" />
                    Description
                  </label>
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label inline-sm">
                    <TagIcon size={16} className="text-primary" />
                    Category
                  </label>
                  <select
                    value={editForm.categoryId}
                    onChange={(e) =>
                      setEditForm({ ...editForm, categoryId: e.target.value })
                    }
                    className="form-input form-select"
                  >
                    <option value="">No Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label inline-sm">
                    <Calendar size={16} className="text-primary" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, date: e.target.value })
                    }
                    max={new Date().toISOString().split("T")[0]}
                    className="form-input"
                  />
                </div>

                <div className="grid-2 pt-2">
                  <Button
                    variant="outline"
                    className="btn-full"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="btn-full"
                    onClick={handleSaveEdit}
                    disabled={
                      saving || !editForm.amount || !editForm.description
                    }
                  >
                    {saving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Expenses;
