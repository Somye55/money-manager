import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Save, X, Calendar, FileText, Loader2 } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const AddExpense = () => {
  const { categories, addExpense, settings } = useData();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
  });

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await addExpense({
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        date: new Date(formData.date).toISOString(),
        source: "MANUAL",
      });
      setSubmitStatus("success");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setSubmitStatus("error");
      console.error("Error adding expense:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="page-header">
        <div
          className="page-header-icon"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
          }}
        >
          <PlusCircle />
        </div>
        <div className="page-header-content">
          <h1 className="page-header-title">Add Expense</h1>
          <p className="page-header-subtitle">Track your spending</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="stack">
        {/* Amount */}
        <Card className="slide-up">
          <CardContent className="card-body">
            <label className="form-label">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-primary">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                inputMode="decimal"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="0.00"
                autoFocus
                className={cn(
                  "form-input pl-10 text-2xl font-bold",
                  errors.amount && "form-input-error"
                )}
              />
            </div>
            {errors.amount && <p className="form-error">{errors.amount}</p>}
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="slide-up delay-1">
          <CardContent className="card-body">
            <label className="form-label inline-sm">
              <FileText size={16} className="text-primary" />
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g., Grocery shopping, Coffee, Gas"
              maxLength={100}
              className={cn(
                "form-input",
                errors.description && "form-input-error"
              )}
            />
            {errors.description && (
              <p className="form-error">{errors.description}</p>
            )}
          </CardContent>
        </Card>

        {/* Category */}
        <Card className="slide-up delay-2">
          <CardContent className="card-body">
            <label className="form-label">Category (Optional)</label>
            <div className="grid-4">
              <button
                type="button"
                onClick={() => handleChange("categoryId", "")}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all min-h-[72px] touch-manipulation",
                  !formData.categoryId
                    ? "border-primary bg-primary/10"
                    : "border-border active:border-primary/50"
                )}
              >
                <Icons.Circle
                  size={20}
                  className={
                    !formData.categoryId
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                />
                <span className="text-xs font-medium">None</span>
              </button>
              {categories.slice(0, 7).map((category) => {
                const IconComponent = Icons[category.icon] || Icons.Tag;
                const isSelected =
                  formData.categoryId === category.id.toString();
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      handleChange("categoryId", category.id.toString())
                    }
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all min-h-[72px] touch-manipulation",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border active:border-primary/50"
                    )}
                  >
                    <IconComponent
                      size={20}
                      style={{ color: category.color }}
                    />
                    <span className="text-xs font-medium truncate w-full text-center">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
            {categories.length > 7 && (
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                className="form-input form-select mt-3"
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </CardContent>
        </Card>

        {/* Date */}
        <Card className="slide-up delay-3">
          <CardContent className="card-body">
            <label className="form-label inline-sm">
              <Calendar size={16} className="text-primary" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className={cn("form-input", errors.date && "form-input-error")}
            />
            {errors.date && <p className="form-error">{errors.date}</p>}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid-2 slide-up delay-4">
          <Button
            type="button"
            variant="outline"
            className="btn-full"
            onClick={() => navigate("/")}
            disabled={isSubmitting}
          >
            <X size={18} />
            Cancel
          </Button>
          <Button
            type="submit"
            className={cn(
              "btn-full",
              submitStatus === "success" &&
                "bg-emerald-500 hover:bg-emerald-600"
            )}
            disabled={isSubmitting || submitStatus === "success"}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Adding...
              </>
            ) : submitStatus === "success" ? (
              <>
                <Icons.Check size={18} />
                Added!
              </>
            ) : (
              <>
                <Save size={18} />
                Add Expense
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;
