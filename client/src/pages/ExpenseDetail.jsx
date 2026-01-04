import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import {
  Trash2,
  Edit2,
  Save,
  Loader,
  FileText,
  Tag as TagIcon,
  Calendar,
  Clock,
} from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { useToast } from "../components/ui/use-toast";
import { capitalizeFirst } from "../lib/textUtils";

const ExpenseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { expenses, settings, modifyExpense, removeExpense } = useData();
  const { toast } = useToast();

  const [expense, setExpense] = useState(null);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  useEffect(() => {
    const foundExpense = expenses.find((exp) => exp.id === parseInt(id));
    if (foundExpense) {
      setExpense(foundExpense);
      setEditedDescription(foundExpense.description);
    } else {
      // Expense not found, redirect back
      navigate("/expenses");
    }
  }, [id, expenses, navigate]);

  const handleSaveDescription = async () => {
    if (!editedDescription.trim() || !expense) return;

    setSaving(true);
    try {
      await modifyExpense(expense.id, {
        description: editedDescription.trim(),
      });
      setExpense({
        ...expense,
        description: editedDescription.trim(),
      });
      setEditingDescription(false);
      toast({
        variant: "success",
        title: "Expense updated",
        description: "Description saved successfully",
      });
    } catch (error) {
      console.error("Error updating description:", error);
      toast({
        variant: "error",
        title: "Update failed",
        description: "Failed to update description",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!expense) return;

    setDeleting(true);
    try {
      await removeExpense(expense.id);
      toast({
        variant: "success",
        title: "Expense deleted",
        description: "Expense removed successfully",
      });
      navigate("/expenses");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        variant: "error",
        title: "Delete failed",
        description: "Failed to delete expense",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (!expense) {
    return (
      <div className="flex items-center justify-center py-32 bg-page-gradient">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const category = expense.category;
  const IconComponent = category?.icon ? Icons[category.icon] : Icons.Receipt;
  const categoryColor = category?.color || "#6366f1";

  return (
    <div className="bg-page-gradient min-h-full animate-fade-in">
      {/* Content with staggered animations */}
      <div className="px-3 py-6 space-y-6 w-full">
        {/* Amount Card */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-xl animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="absolute inset-0 bg-gradient-danger"></div>
          <div className="absolute inset-0 shimmer"></div>
          <div className="relative text-center py-8">
            <p className="text-sm text-white/80 font-medium mb-2">Amount</p>
            <h2 className="text-5xl font-extrabold text-white mb-1">
              {currencySymbol}
              {parseFloat(expense.amount).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
            <p className="text-xs text-white/70 mt-2">
              {new Date(expense.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Description Card */}
        <div
          className="bg-card rounded-2xl p-5 border-2 border-border space-y-3 animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-bold text-foreground">
              <FileText size={18} className="text-primary" />
              Description
            </label>
            {!editingDescription && (
              <button
                onClick={() => setEditingDescription(true)}
                className="p-2 rounded-lg hover:bg-primary/10 transition-smooth"
                aria-label="Edit description"
              >
                <Edit2 size={18} className="text-primary" />
              </button>
            )}
          </div>
          {editingDescription ? (
            <div className="space-y-3">
              <Input
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full text-base"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveDescription}
                  disabled={
                    saving ||
                    !editedDescription.trim() ||
                    editedDescription === expense.description
                  }
                  className="flex-1 bg-gradient-primary text-white py-3"
                >
                  {saving ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setEditingDescription(false);
                    setEditedDescription(expense.description);
                  }}
                  variant="secondary"
                  className="flex-1 py-3"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-foreground text-base leading-relaxed bg-secondary rounded-xl p-4">
              {capitalizeFirst(expense.description)}
            </p>
          )}
        </div>

        {/* Category Card */}
        <div
          className="bg-card rounded-2xl p-5 border-2 border-border space-y-3 animate-fadeIn"
          style={{ animationDelay: "0.3s" }}
        >
          <label className="flex items-center gap-2 text-sm font-bold text-foreground">
            <TagIcon size={18} className="text-primary" />
            Category
          </label>
          {category ? (
            <div className="flex items-center gap-4 bg-secondary rounded-xl p-4">
              <div
                className="rounded-xl flex items-center justify-center"
                style={{
                  width: "56px",
                  height: "56px",
                  background: `${categoryColor}20`,
                }}
              >
                <IconComponent
                  size={28}
                  style={{ color: categoryColor }}
                  strokeWidth={2.5}
                />
              </div>
              <div>
                <p className="font-bold text-lg text-foreground">
                  {capitalizeFirst(category.name)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Expense category
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground bg-secondary rounded-xl p-4">
              No category assigned
            </p>
          )}
        </div>

        {/* Date Card */}
        <div
          className="bg-card rounded-2xl p-5 border-2 border-border space-y-3 animate-fadeIn"
          style={{ animationDelay: "0.4s" }}
        >
          <label className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Calendar size={18} className="text-primary" />
            Date
          </label>
          <div className="bg-secondary rounded-xl p-4">
            <p className="text-foreground text-base font-semibold">
              {new Date(expense.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(expense.date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Source Card */}
        <div
          className="bg-card rounded-2xl p-5 border-2 border-border space-y-3 animate-fadeIn"
          style={{ animationDelay: "0.5s" }}
        >
          <label className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Clock size={18} className="text-primary" />
            Source
          </label>
          <div className="bg-secondary rounded-xl p-4">
            <p className="text-foreground text-base font-semibold capitalize">
              {expense.source.toLowerCase()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {expense.source === "SMS"
                ? "Automatically detected from SMS"
                : "Manually added"}
            </p>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full py-4 rounded-2xl bg-card border-2 border-destructive/30 text-destructive font-bold hover:bg-destructive/10 transition-smooth flex items-center justify-center gap-2 animate-fadeIn"
          style={{ animationDelay: "0.6s" }}
        >
          <Trash2 size={20} />
          Delete Expense
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-foreground">
              Delete Expense?
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-muted-foreground text-center text-sm">
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </p>

            {/* Amount Display */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-danger"></div>
              <div className="relative text-center py-6">
                <h2 className="text-4xl font-extrabold text-white mb-2">
                  {currencySymbol}
                  {parseFloat(expense.amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h2>
                <p className="text-white/90 font-semibold">
                  {capitalizeFirst(expense.description)}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 mt-6">
            <Button
              onClick={() => setShowDeleteConfirm(false)}
              variant="secondary"
              className="flex-1 py-3"
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-3 bg-gradient-danger text-white hover:opacity-90"
            >
              {deleting ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseDetail;
