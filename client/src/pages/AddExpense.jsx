import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Save,
  X,
  Calendar,
  Tag,
  FileText,
  DollarSign,
  Loader,
} from "lucide-react";
import * as Icons from "lucide-react";
import { Button, Card, Input, Typography, ThemeToggle } from "../design-system";

const AddExpense = () => {
  const { categories, addExpense, settings } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    categoryId: "",
    date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user makes changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter a description");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const expenseData = {
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        date: new Date(formData.date).toISOString(),
        source: "MANUAL",
      };

      await addExpense(expenseData);

      // Reset form and navigate back
      navigate("/");
    } catch (err) {
      setError("Failed to add expense. Please try again.");
      console.error("Error adding expense:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

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
      : "₹"; // Default to INR

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
            <PlusCircle className="text-white" size={24} />
          </div>
          <div>
            <Typography variant="h1" className="text-2xl font-bold">
              Add Expense
            </Typography>
            <Typography variant="body2" color="tertiary" className="text-xs">
              Track your spending
            </Typography>
          </div>
        </div>
        <ThemeToggle size="md" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 animate-fade-in">
          <Typography variant="body2" color="error" className="text-sm">
            {error}
          </Typography>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <Card
          padding="md"
          className="animate-slide-up"
          style={{ borderRadius: "1.25rem" }}
        >
          <label className="flex items-center gap-2 mb-2 font-semibold text-xs text-primary">
            <DollarSign size={16} className="text-primary" />
            Amount
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-base font-medium text-tertiary pointer-events-none">
              {currencySymbol}
            </span>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 text-3xl font-bold rounded-xl border-0 bg-bg-secondary outline-none focus:ring-2 focus:ring-primary/20 transition"
              style={{ color: "var(--text-primary)" }}
              autoFocus
            />
          </div>
        </Card>

        {/* Description Input */}
        <Card
          padding="md"
          className="animate-slide-up"
          style={{ animationDelay: "0.05s", borderRadius: "1.25rem" }}
        >
          <label className="flex items-center gap-2 mb-2 font-semibold text-xs text-primary">
            <FileText size={16} className="text-primary" />
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="e.g., Grocery shopping"
            className="w-full px-4 py-3 text-base rounded-xl border-0 bg-bg-secondary outline-none focus:ring-2 focus:ring-primary/20 transition"
            style={{ color: "var(--text-primary)" }}
          />
        </Card>

        {/* Category Selection */}
        <Card
          padding="md"
          className="animate-slide-up"
          style={{ animationDelay: "0.1s", borderRadius: "1.25rem" }}
        >
          <label className="flex items-center gap-2 mb-3 font-semibold text-xs text-primary">
            <Tag size={16} className="text-primary" />
            Category
          </label>

          {categories.length === 0 ? (
            <Typography variant="body2" color="tertiary" className="text-sm">
              Loading categories...
            </Typography>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {categories.map((category) => {
                const IconComponent = Icons[category.icon] || Icons.Circle;
                const isSelected =
                  formData.categoryId === category.id.toString();

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      handleChange("categoryId", category.id.toString())
                    }
                    className="p-3.5 flex flex-col items-center gap-2 rounded-xl transition-all"
                    style={{
                      background: isSelected
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : `${category.color}15`,
                      border: isSelected
                        ? "2px solid transparent"
                        : "2px solid transparent",
                      minHeight: "90px",
                    }}
                  >
                    <div
                      className="rounded-xl p-2"
                      style={{
                        background: isSelected
                          ? "rgba(255, 255, 255, 0.25)"
                          : `${category.color}20`,
                      }}
                    >
                      <IconComponent
                        size={22}
                        style={{
                          color: isSelected ? "white" : category.color,
                        }}
                      />
                    </div>
                    <Typography
                      variant="body2"
                      className={`text-xs font-semibold ${
                        isSelected ? "text-white" : ""
                      }`}
                    >
                      {category.name}
                    </Typography>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        {/* Date Input */}
        <Card
          padding="md"
          className="animate-slide-up"
          style={{ animationDelay: "0.15s", borderRadius: "1.25rem" }}
        >
          <label className="flex items-center gap-2 mb-2 font-semibold text-xs text-primary">
            <Calendar size={16} className="text-primary" />
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-3 text-base rounded-xl border-0 bg-bg-secondary outline-none focus:ring-2 focus:ring-primary/20 transition"
            style={{ color: "var(--text-primary)" }}
          />
        </Card>

        {/* Action Buttons */}
        <div
          className="flex gap-3 pt-2 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <Button
            variant="secondary"
            fullWidth
            onClick={handleCancel}
            disabled={saving}
            style={{
              borderRadius: "0.75rem",
              padding: "0.875rem",
              fontSize: "0.9375rem",
            }}
          >
            <X size={18} />
            Cancel
          </Button>

          <Button
            variant="primary"
            fullWidth
            type="submit"
            disabled={saving}
            loading={saving}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.875rem",
              fontSize: "0.9375rem",
            }}
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Save size={18} />
                Add Expense
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Bottom spacing */}
      <div style={{ height: "20px" }} />
    </div>
  );
};

export default AddExpense;
