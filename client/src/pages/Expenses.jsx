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
  Plus,
} from "lucide-react";
import * as Icons from "lucide-react";
import SMSExpenseCard from "../components/SMSExpenseCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const Expenses = () => {
  const {
    expenses,
    categories,
    settings,
    removeExpense,
    modifyExpense,
    loading,
    addExpense,
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    amount: "",
    description: "",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [addingSaving, setAddingSaving] = useState(false);

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

  const handleAddExpense = async () => {
    if (!addForm.amount || !addForm.description) return;

    setAddingSaving(true);
    try {
      const expenseData = {
        amount: parseFloat(addForm.amount),
        description: addForm.description.trim(),
        categoryId: addForm.categoryId ? parseInt(addForm.categoryId) : null,
        date: new Date(addForm.date).toISOString(),
        source: "MANUAL",
      };

      await addExpense(expenseData);

      // Reset form and close modal
      setAddForm({
        amount: "",
        description: "",
        categoryId: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setAddingSaving(false);
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
    <div className="p-4 pb-24 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <Receipt className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Expenses</h1>
            <p className="text-xs text-tertiary">
              {filteredExpenses.length} transactions
            </p>
          </div>
        </div>

        {/* Add Expense Button */}
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-br from-green-500 to-green-600 shadow-lg"
          aria-label="Add new expense"
        >
          <Plus size={18} aria-hidden="true" />
          Add
        </Button>
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
          background: "linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)",
          border: "none",
          boxShadow: "0 8px 24px rgba(239, 68, 68, 0.25)",
          borderRadius: "1.25rem",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white opacity-90 font-medium mb-1">
              Total Expenses
            </p>
            <h2 className="text-3xl font-extrabold text-white">
              {currencySymbol}{" "}
              {totalAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{ background: "rgba(255, 255, 255, 0.25)" }}
          >
            <TrendingDown size={28} className="text-white" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-2.5">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search expenses..."
          icon={<Search size={18} />}
        />

        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? "default" : "outline"}
            className={
              showFilters
                ? "bg-primary/10 text-primary border-2 border-primary/30"
                : ""
            }
            aria-label={showFilters ? "Hide filters" : "Show filters"}
            aria-expanded={showFilters}
          >
            <Filter size={16} aria-hidden="true" />
            Filters
          </Button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border-0 bg-input-background outline-none focus:ring-2 focus:ring-primary/20 transition text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
            aria-label="Sort expenses by"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>

        {showFilters && (
          <Card className="p-4 space-y-3 animate-slide-up">
            <div>
              <label className="block text-xs font-semibold mb-2 text-primary">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        )}
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-secondary">
            <Receipt size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            No expenses found
          </p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-br from-indigo-500 to-purple-600"
            aria-label="Add your first expense"
          >
            Add Your First Expense
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {Object.entries(groupedExpenses).map(([date, dayExpenses]) => (
            <div key={date} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <Calendar size={14} className="text-tertiary" />
                <h3 className="text-xs font-bold text-tertiary">{date}</h3>
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-xs font-bold text-tertiary">
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
                  <Card
                    key={expense.id}
                    className="p-3.5 transition hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          width: "44px",
                          height: "44px",
                          background: `${categoryColor}20`,
                        }}
                      >
                        <IconComponent
                          size={20}
                          style={{ color: categoryColor }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {expense.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          {category && <span>{category.name}</span>}
                          {category && <span>•</span>}
                          <span className="capitalize">
                            {expense.source.toLowerCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="text-right">
                          <p className="font-bold text-sm text-destructive whitespace-nowrap">
                            - {currencySymbol}
                            {parseFloat(expense.amount).toLocaleString(
                              "en-IN",
                              { minimumFractionDigits: 2 }
                            )}
                          </p>
                        </div>

                        <div className="flex gap-0.5">
                          <Button
                            onClick={() => handleEdit(expense)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 min-h-[44px] min-w-[44px]"
                            aria-label={`Edit ${expense.description}`}
                          >
                            <Edit2
                              size={14}
                              className="text-primary"
                              aria-hidden="true"
                            />
                          </Button>
                          <Button
                            onClick={() => handleDelete(expense.id)}
                            disabled={deleting === expense.id}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 min-h-[44px] min-w-[44px]"
                            aria-label={`Delete ${expense.description}`}
                          >
                            {deleting === expense.id ? (
                              <Loader
                                size={14}
                                className="animate-spin text-destructive"
                                aria-hidden="true"
                              />
                            ) : (
                              <Trash2
                                size={14}
                                className="text-destructive"
                                aria-hidden="true"
                              />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <DollarSign size={16} className="text-primary" />
                Amount
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 font-bold text-muted-foreground pointer-events-none">
                  {currencySymbol}
                </span>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.amount}
                  onChange={(e) =>
                    setEditForm({ ...editForm, amount: e.target.value })
                  }
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <FileText size={16} className="text-primary" />
                Description
              </label>
              <Input
                type="text"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <TagIcon size={16} className="text-primary" />
                Category
              </label>
              <Select
                value={editForm.categoryId}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="No Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Category</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <Calendar size={16} className="text-primary" />
                Date
              </label>
              <Input
                type="date"
                value={editForm.date}
                onChange={(e) =>
                  setEditForm({ ...editForm, date: e.target.value })
                }
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-2">
            <Button
              onClick={() => setShowEditModal(false)}
              variant="secondary"
              className="flex-1 sm:flex-none"
              aria-label="Cancel editing"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={saving || !editForm.amount || !editForm.description}
              loading={saving}
              className="flex-1 sm:flex-none bg-gradient-to-br from-indigo-500 to-purple-600"
              aria-label={saving ? "Saving changes" : "Save changes"}
            >
              <Save size={18} aria-hidden="true" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Expense Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <DollarSign size={16} className="text-primary" />
                Amount
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 font-bold text-muted-foreground pointer-events-none">
                  {currencySymbol}
                </span>
                <Input
                  type="number"
                  step="0.01"
                  value={addForm.amount}
                  onChange={(e) =>
                    setAddForm({ ...addForm, amount: e.target.value })
                  }
                  placeholder="0.00"
                  className="pl-8"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <FileText size={16} className="text-primary" />
                Description
              </label>
              <Input
                type="text"
                value={addForm.description}
                onChange={(e) =>
                  setAddForm({ ...addForm, description: e.target.value })
                }
                placeholder="What did you spend on?"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <TagIcon size={16} className="text-primary" />
                Category
              </label>
              <Select
                value={addForm.categoryId}
                onValueChange={(value) =>
                  setAddForm({ ...addForm, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="No Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Category</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <Calendar size={16} className="text-primary" />
                Date
              </label>
              <Input
                type="date"
                value={addForm.date}
                onChange={(e) =>
                  setAddForm({ ...addForm, date: e.target.value })
                }
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-2">
            <Button
              onClick={() => setShowAddModal(false)}
              variant="secondary"
              className="flex-1 sm:flex-none"
              aria-label="Cancel adding expense"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddExpense}
              disabled={addingSaving || !addForm.amount || !addForm.description}
              loading={addingSaving}
              className="flex-1 sm:flex-none bg-gradient-to-br from-green-500 to-green-600"
              aria-label={addingSaving ? "Adding expense" : "Add expense"}
            >
              <Plus size={18} aria-hidden="true" />
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div style={{ height: "20px" }} />

      {/* Floating Action Button */}
      <Button
        onClick={() => setShowAddModal(true)}
        size="icon"
        className="fixed bottom-20 right-4 w-14 h-14 min-w-[56px] min-h-[56px] rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-40 bg-gradient-to-br from-green-500 to-green-600"
        aria-label="Add new expense"
      >
        <Plus size={24} className="text-white" aria-hidden="true" />
        <span className="sr-only">Add new expense</span>
      </Button>
    </div>
  );
};

export default Expenses;
