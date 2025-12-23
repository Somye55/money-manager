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
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl"
            style={{ background: "var(--gradient-primary)" }}
          >
            <PlusCircle className="text-white" size={24} />
          </div>
          <div>
            <Typography variant="h1">Add Expense</Typography>
            <Typography variant="body2" color="tertiary">
              Track your spending
            </Typography>
          </div>
        </div>
        <ThemeToggle size="md" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 animate-fade-in">
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Amount Input */}
        <Card padding="md" className="animate-slide-up">
          <label className="flex items-center gap-2 mb-3 font-semibold text-sm">
            <DollarSign size={18} className="text-primary" />
            <Typography variant="body2">Amount</Typography>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-tertiary">
              {currencySymbol}
            </span>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 text-2xl font-bold rounded-lg border border-border bg-bg-secondary outline-none focus:border-primary transition"
              autoFocus
            />
          </div>
        </Card>

        {/* Description Input */}
        <Card
          padding="md"
          className="animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <Input
            label={
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Description
              </div>
            }
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="e.g., Grocery shopping"
            fullWidth
          />
        </Card>

        {/* Category Selection */}
        <Card
          padding="md"
          className="animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <label className="flex items-center gap-2 mb-3 font-semibold text-sm">
            <Tag size={18} className="text-primary" />
            <Typography variant="body2">Category</Typography>
          </label>

          {categories.length === 0 ? (
            <Typography variant="body2" color="tertiary">
              Loading categories...
            </Typography>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => {
                const IconComponent = Icons[category.icon] || Icons.Circle;
                const isSelected =
                  formData.categoryId === category.id.toString();

                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? "primary" : "outline"}
                    onClick={() =>
                      handleChange("categoryId", category.id.toString())
                    }
                    className="p-4 flex-col h-auto"
                    style={{
                      background: isSelected
                        ? undefined
                        : `${category.color}15`,
                    }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="rounded-full p-2"
                        style={{ background: `${category.color}20` }}
                      >
                        <IconComponent
                          size={20}
                          style={{ color: category.color }}
                        />
                      </div>
                      <Typography
                        variant="body2"
                        className={isSelected ? "text-white" : ""}
                      >
                        {category.name}
                      </Typography>
                    </div>
                  </Button>
                );
              })}
            </div>
          )}
        </Card>

        {/* Date Input */}
        <Card
          padding="md"
          className="animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Input
            type="date"
            label={
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                Date
              </div>
            }
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            fullWidth
          />
        </Card>

        {/* Action Buttons */}
        <div
          className="flex gap-3 animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Button
            variant="secondary"
            fullWidth
            onClick={handleCancel}
            disabled={saving}
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
              background: "var(--gradient-primary)",
              border: "none",
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
