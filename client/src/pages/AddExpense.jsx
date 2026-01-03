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
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ThemeToggle } from "../components/ui/theme-toggle";

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
    <div className="min-h-screen pb-24">
      <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="animate-fadeIn">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <Card className="animate-fadeIn">
            <CardContent className="p-6">
              <label className="flex items-center gap-2 mb-3 font-semibold text-sm">
                <DollarSign size={16} />
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
                  className="w-full pl-10 pr-4 py-3 text-3xl font-bold rounded-xl border border-input bg-input-background focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-colors"
                  autoFocus
                  aria-invalid={!!error && !formData.amount}
                />
              </div>
            </CardContent>
          </Card>

          {/* Description Input */}
          <Card className="animate-fadeIn" style={{ animationDelay: "0.05s" }}>
            <CardContent className="p-6">
              <label className="flex items-center gap-2 mb-3 font-semibold text-sm">
                <FileText size={16} />
                Description
              </label>
              <Input
                type="text"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="e.g., Grocery shopping"
                className="text-base"
                aria-invalid={!!error && !formData.description.trim()}
              />
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-6">
              <label className="flex items-center gap-2 mb-3 font-semibold text-sm">
                <Tag size={16} />
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
                          // Toggle category selection - click again to deselect
                          if (isSelected) {
                            handleChange("categoryId", "");
                          } else {
                            handleChange("categoryId", category.id.toString());
                          }
                        }}
                        className="p-4 flex flex-col items-center gap-2 rounded-xl transition-all min-h-[44px] border-2"
                        style={{
                          background: isSelected
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : `${category.color}15`,
                          borderColor: isSelected
                            ? "transparent"
                            : "transparent",
                        }}
                        aria-label={`Select ${category.name} category`}
                        aria-pressed={isSelected}
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
                        <span
                          className={`text-xs font-semibold ${
                            isSelected ? "text-white" : ""
                          }`}
                        >
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date Input */}
          <Card className="animate-fadeIn" style={{ animationDelay: "0.15s" }}>
            <CardContent className="p-6">
              <label className="flex items-center gap-2 mb-3 font-semibold text-sm">
                <Calendar size={16} />
                Date
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="text-base"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div
            className="flex gap-3 pt-2 animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1"
              type="button"
              aria-label="Cancel adding expense"
            >
              <X size={18} aria-hidden="true" />
              Cancel
            </Button>

            <Button
              variant="default"
              size="lg"
              type="submit"
              disabled={saving}
              loading={saving}
              className="flex-1 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              aria-label={saving ? "Saving expense" : "Add expense"}
            >
              <Save size={18} aria-hidden="true" />
              {saving ? "Saving..." : "Add Expense"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
