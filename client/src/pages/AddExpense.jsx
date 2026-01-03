import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import { Save, X, Calendar, Tag, FileText, DollarSign } from "lucide-react";
import * as Icons from "lucide-react";
import { Input } from "../components/ui/input";
import { AlertDescription } from "../components/ui/alert";
import { useToast } from "../components/ui/use-toast";

const AddExpense = () => {
  const { categories, addExpense, settings } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

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

      toast({
        variant: "success",
        title: "Expense added",
        description: `${currencySymbol}${parseFloat(formData.amount).toFixed(
          2
        )} - ${formData.description.trim()}`,
      });

      // Reset form and navigate back
      navigate("/");
    } catch (err) {
      setError("Failed to add expense. Please try again.");
      toast({
        variant: "error",
        title: "Failed to add expense",
        description: "Please try again",
      });
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
    <div className="min-h-screen pb-24 bg-page-gradient">
      <div className="w-full px-3 py-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="animate-fadeIn card-elevated rounded-2xl p-4 bg-gradient-danger text-white">
            <AlertDescription className="text-white font-medium">
              {error}
            </AlertDescription>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div className="animate-fadeIn card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card">
            <div className="p-6">
              <label className="flex items-center gap-2 mb-3 font-semibold text-sm text-foreground">
                <DollarSign size={16} className="text-primary" />
                Amount
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-base font-medium text-muted-foreground pointer-events-none">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 text-3xl font-bold rounded-xl border-2 border-border bg-input-background focus-visible:outline-none focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-4 transition-all"
                  autoFocus
                  aria-invalid={!!error && !formData.amount}
                />
              </div>
            </div>
          </div>

          {/* Description Input */}
          <div
            className="animate-fadeIn card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card"
            style={{ animationDelay: "0.05s" }}
          >
            <div className="p-6">
              <label className="flex items-center gap-2 mb-3 font-semibold text-sm text-foreground">
                <FileText size={16} className="text-primary" />
                Description
              </label>
              <Input
                type="text"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="e.g., Grocery shopping"
                className="text-base border-2 h-12"
                aria-invalid={!!error && !formData.description.trim()}
              />
            </div>
          </div>

          {/* Category Selection */}
          <div
            className="animate-fadeIn card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="p-6">
              <label className="flex items-center gap-2 mb-4 font-semibold text-sm text-foreground">
                <Tag size={16} className="text-primary" />
                Category
              </label>

              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Loading categories...
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => {
                    const IconComponent = Icons[category.icon] || Icons.Circle;
                    const isSelected =
                      formData.categoryId === category.id.toString();

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            handleChange("categoryId", "");
                          } else {
                            handleChange("categoryId", category.id.toString());
                          }
                        }}
                        className={`category-btn ${
                          isSelected ? "category-btn-selected" : ""
                        }`}
                        style={{
                          background: isSelected
                            ? undefined
                            : `${category.color}15`,
                        }}
                        aria-label={`Select ${category.name} category`}
                        aria-pressed={isSelected}
                      >
                        <div
                          className="rounded-xl p-2 transition-smooth"
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
                            strokeWidth={2.5}
                          />
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            isSelected ? "text-white" : "text-foreground"
                          }`}
                        >
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Date Input */}
          <div
            className="animate-fadeIn card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="p-6">
              <label className="flex items-center gap-2 mb-3 font-semibold text-sm text-foreground">
                <Calendar size={16} className="text-primary" />
                Date
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="text-base border-2 h-12"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex gap-3 pt-2 animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <button
              onClick={handleCancel}
              disabled={saving}
              type="button"
              className="flex-1 py-4 px-6 rounded-2xl bg-secondary text-secondary-foreground font-semibold transition-smooth hover:bg-secondary/80 flex items-center justify-center gap-2 border-2 border-border"
              aria-label="Cancel adding expense"
            >
              <X size={18} aria-hidden="true" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 px-6 rounded-2xl btn-gradient-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              aria-label={saving ? "Saving expense" : "Add expense"}
            >
              {!saving && <div className="absolute inset-0 shimmer"></div>}
              <Save size={18} aria-hidden="true" />
              {saving ? "Saving..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
