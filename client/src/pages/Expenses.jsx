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
  Loader,
  ChevronDown,
  X,
  Save,
  DollarSign,
  FileText,
  Tag as TagIcon,
  Smartphone,
} from "lucide-react";
import * as Icons from "lucide-react";
import SMSExpenseCard from "../components/SMSExpenseCard";

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
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="p-3 rounded-xl"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Receipt className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-sm text-tertiary">
            {filteredExpenses.length} transactions
          </p>
        </div>
      </div>

      {/* New Expenses Found Section */}
      {extractedExpenses.length > 0 && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="text-primary" size={20} />
              <h3 className="text-lg font-bold">New Expenses Found</h3>
            </div>
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-bold">
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
      <div
        className="card p-4"
        style={{
          background: "var(--gradient-danger)",
          border: "none",
          boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white opacity-90 font-medium">
              Total Expenses
            </p>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              {currencySymbol}{" "}
              {totalAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{ background: "rgba(255, 255, 255, 0.2)" }}
          >
            <TrendingDown size={32} className="text-white" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expenses..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-border bg-bg-secondary outline-none focus:border-primary transition"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
              showFilters ? "border-primary bg-primary/10" : "border-border"
            }`}
          >
            <Filter size={18} />
            Filters
            <ChevronDown
              size={16}
              className={`transition ${showFilters ? "rotate-180" : ""}`}
            />
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border-2 border-border bg-bg-secondary outline-none focus:border-primary transition"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>

        {showFilters && (
          <div className="card p-4 space-y-3 animate-slide-up">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-border bg-bg-secondary outline-none focus:border-primary transition"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <div className="card p-8 text-center">
          <Receipt size={48} className="mx-auto text-tertiary mb-3" />
          <p className="text-tertiary">No expenses found</p>
          <button
            onClick={() => navigate("/add")}
            className="btn btn-primary mt-4"
            style={{ background: "var(--gradient-primary)" }}
          >
            Add Your First Expense
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedExpenses).map(([date, dayExpenses]) => (
            <div key={date} className="space-y-2">
              <div className="flex items-center gap-2 px-2">
                <Calendar size={16} className="text-tertiary" />
                <h3 className="text-sm font-bold text-tertiary">{date}</h3>
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-sm font-bold text-tertiary">
                  {currencySymbol}{" "}
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
                  <div
                    key={expense.id}
                    className="card p-4 transition hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          width: "48px",
                          height: "48px",
                          background: `${categoryColor}20`,
                        }}
                      >
                        <IconComponent
                          size={22}
                          style={{ color: categoryColor }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate">
                          {expense.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-tertiary">
                          {category && <span>{category.name}</span>}
                          <span>•</span>
                          <span className="capitalize">
                            {expense.source.toLowerCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="font-bold text-base text-danger whitespace-nowrap">
                            - {currencySymbol}
                            {parseFloat(expense.amount).toLocaleString(
                              "en-IN",
                              { minimumFractionDigits: 2 }
                            )}
                          </p>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="p-2 hover:bg-primary/10 rounded-lg transition"
                          >
                            <Edit2 size={16} className="text-primary" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            disabled={deleting === expense.id}
                            className="p-2 hover:bg-danger/10 rounded-lg transition"
                          >
                            {deleting === expense.id ? (
                              <Loader
                                size={16}
                                className="animate-spin text-danger"
                              />
                            ) : (
                              <Trash2 size={16} className="text-danger" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full animate-slide-up shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Edit Expense</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-bg-secondary rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                  <DollarSign size={16} className="text-primary" />
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-tertiary">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm({ ...editForm, amount: e.target.value })
                    }
                    className="w-full pl-8 pr-4 py-3 rounded-lg border-2 border-border bg-bg-secondary outline-none focus:border-primary transition"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                  <FileText size={16} className="text-primary" />
                  Description
                </label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border-2 border-border bg-bg-secondary outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                  <TagIcon size={16} className="text-primary" />
                  Category
                </label>
                <select
                  value={editForm.categoryId}
                  onChange={(e) =>
                    setEditForm({ ...editForm, categoryId: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border-2 border-border bg-bg-secondary outline-none focus:border-primary transition"
                >
                  <option value="">No Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
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
                  className="w-full p-3 rounded-lg border-2 border-border bg-bg-secondary outline-none focus:border-primary transition"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving || !editForm.amount || !editForm.description}
                  className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {saving ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: "20px" }} />
    </div>
  );
};

export default Expenses;
