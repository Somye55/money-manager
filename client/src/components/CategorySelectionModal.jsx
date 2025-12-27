import React, { useState } from "react";
import { X, Check, Loader } from "lucide-react";
import * as Icons from "lucide-react";
import { useData } from "../context/DataContext";

const CategorySelectionModal = ({ expense, isOpen, onClose, onConfirm }) => {
  const { categories, settings } = useData();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
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

  const handleConfirm = async () => {
    if (!selectedCategoryId) return;

    setSaving(true);
    try {
      await onConfirm(expense, selectedCategoryId);
      onClose();
    } catch (error) {
      console.error("Error saving expense:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDismiss = () => {
    setSelectedCategoryId(null);
    onClose();
  };

  if (!isOpen || !expense) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 animate-fade-in"
      onClick={handleDismiss}
    >
      <div
        className="bg-surface w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-modal max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-primary">
              New Transaction Detected
            </h3>
            <p className="text-sm text-tertiary">Choose a category to save</p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-bg-secondary rounded-lg transition"
          >
            <X size={20} className="text-tertiary" />
          </button>
        </div>

        {/* Transaction Details */}
        <div className="p-4 border-b border-border bg-bg-secondary/50">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-lg text-primary">
                {expense.merchant || "Unknown Merchant"}
              </h4>
              <p className="text-sm text-tertiary">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-danger">
                {currencySymbol}
                {expense.amount.toFixed(2)}
              </span>
            </div>
          </div>

          {expense.suggestedCategory && (
            <div className="mt-2 text-xs text-tertiary">
              Suggested:{" "}
              <span className="font-medium text-primary">
                {expense.suggestedCategory}
              </span>
            </div>
          )}
        </div>

        {/* Category Selection */}
        <div className="p-4">
          <label className="block text-sm font-medium text-secondary mb-3">
            Select Category
          </label>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {categories.map((category) => {
              const IconComponent = Icons[category.icon] || Icons.Tag;
              const isSelected = selectedCategoryId === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`
                    p-3 rounded-xl border-2 transition-all
                    ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-bg-secondary"
                    }
                  `}
                  style={{
                    borderColor: isSelected ? category.color : undefined,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: `${category.color}20`,
                        color: category.color,
                      }}
                    >
                      <IconComponent size={18} />
                    </div>
                    <span className="text-sm font-medium text-primary flex-1 text-left">
                      {category.name}
                    </span>
                    {isSelected && (
                      <Check size={16} style={{ color: category.color }} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleDismiss}
              className="flex-1 py-3 px-4 rounded-xl border border-border text-sm font-medium hover:bg-bg-secondary transition"
              disabled={saving}
            >
              Dismiss
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedCategoryId || saving}
              className={`
                flex-1 py-3 px-4 rounded-xl text-sm font-medium transition
                flex items-center justify-center gap-2
                ${
                  selectedCategoryId && !saving
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-border text-tertiary cursor-not-allowed"
                }
              `}
            >
              {saving ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Save Expense
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelectionModal;
