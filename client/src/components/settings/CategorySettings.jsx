import { useState } from "react";
import { useData } from "../../context/DataContext";
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  GripVertical,
  X,
  Save,
  FileText,
  DollarSign,
  Palette,
  Check,
  Loader,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const CategorySettings = () => {
  const {
    categories,
    addCategory,
    modifyCategory,
    removeCategory,
    reorderCategories,
    loading: dataLoading,
  } = useData();

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "Tag",
    color: "#6366f1",
    budget: "",
  });
  const [categoryFormErrors, setCategoryFormErrors] = useState({});
  const [savingCategory, setSavingCategory] = useState(false);
  const [categorySuccessMessage, setCategorySuccessMessage] = useState("");

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newCategories = [...categories];
    const draggedItem = newCategories[draggedIndex];
    newCategories.splice(draggedIndex, 1);
    newCategories.splice(index, 0, draggedItem);

    reorderCategories(newCategories);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        icon: category.icon || "Tag",
        color: category.color || "#6366f1",
        budget: category.budget ? category.budget.toString() : "",
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: "",
        icon: "Tag",
        color: "#6366f1",
        budget: "",
      });
    }
    setCategoryFormErrors({});
    setSavingCategory(false);
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCategoryFormErrors({});
    setSavingCategory(false);
  };

  const validateCategoryForm = () => {
    const errors = {};

    if (!categoryForm.name.trim()) {
      errors.name = "Category name is required";
    } else if (categoryForm.name.trim().length < 2) {
      errors.name = "Category name must be at least 2 characters";
    } else if (categoryForm.name.trim().length > 30) {
      errors.name = "Category name must be less than 30 characters";
    }

    if (categoryForm.budget && categoryForm.budget.trim()) {
      const budgetValue = parseFloat(categoryForm.budget);
      if (isNaN(budgetValue) || budgetValue < 0) {
        errors.budget = "Budget must be a valid positive number";
      } else if (budgetValue > 999999.99) {
        errors.budget = "Budget cannot exceed 999,999.99";
      }
    }

    const existingCategory = categories.find(
      (cat) =>
        cat.name.toLowerCase() === categoryForm.name.trim().toLowerCase() &&
        (!editingCategory || cat.id !== editingCategory.id)
    );

    if (existingCategory) {
      errors.name = "A category with this name already exists";
    }

    setCategoryFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCategory = async () => {
    if (!validateCategoryForm()) {
      return;
    }

    setSavingCategory(true);
    setCategoryFormErrors({});

    try {
      const categoryData = {
        ...categoryForm,
        name: categoryForm.name.trim(),
      };

      if (editingCategory) {
        await modifyCategory(editingCategory.id, categoryData);
        setCategorySuccessMessage(
          `✓ "${categoryData.name}" updated successfully!`
        );
      } else {
        const maxOrder = Math.max(...categories.map((c) => c.order || 0), -1);
        categoryData.order = maxOrder + 1;
        await addCategory(categoryData);
        setCategorySuccessMessage(
          `✓ "${categoryData.name}" created successfully!`
        );
      }

      closeCategoryModal();
      setTimeout(() => setCategorySuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving category:", error);
      setCategoryFormErrors({
        general: error.message || "Failed to save category. Please try again.",
      });
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      window.confirm(
        "Delete this category? Expenses will become uncategorized."
      )
    ) {
      try {
        await removeCategory(id);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const iconOptions = [
    "Tag",
    "Coffee",
    "Car",
    "ShoppingBag",
    "Home",
    "Film",
    "Heart",
    "BookOpen",
    "Utensils",
    "Plane",
    "Smartphone",
    "Shirt",
    "Zap",
    "Gift",
    "Music",
    "Dumbbell",
    "Pizza",
    "Bus",
    "Train",
    "Bike",
    "Fuel",
    "ShoppingCart",
    "Briefcase",
    "GraduationCap",
    "Stethoscope",
    "Pill",
    "Gamepad2",
    "Tv",
    "Headphones",
    "Camera",
    "Palette",
    "Scissors",
  ];

  const colorOptions = [
    "#f59e0b",
    "#3b82f6",
    "#ec4899",
    "#8b5cf6",
    "#10b981",
    "#ef4444",
    "#f97316",
    "#6366f1",
    "#14b8a6",
    "#f43f5e",
    "#06b6d4",
    "#a855f7",
  ];

  const IconComponent = LucideIcons[categoryForm.icon] || Tag;

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="p-3 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Tag className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-xs text-muted-foreground">
            Organize your expenses
          </p>
        </div>
      </div>

      <Card className="animate-slide-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Manage Categories</CardTitle>
            <Button
              variant="default"
              size="sm"
              onClick={() => openCategoryModal()}
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600"
              aria-label="Add new category"
            >
              <Plus size={16} aria-hidden="true" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {categorySuccessMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm font-medium animate-slide-up">
              {categorySuccessMessage}
            </div>
          )}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">
              Drag to reorder categories
            </p>
            <p className="text-xs text-muted-foreground">
              {categories.length} categories
            </p>
          </div>
          <div className="space-y-2">
            {categories.length === 0 ? (
              <div className="text-center py-6">
                <div className="p-4 rounded-xl bg-secondary border-2 border-dashed border-border">
                  <Tag
                    size={28}
                    className="mx-auto mb-2 text-muted-foreground"
                  />
                  <p className="text-muted-foreground text-sm mb-1">
                    No categories yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Create your first category to get started
                  </p>
                </div>
              </div>
            ) : (
              categories.map((category, index) => {
                const Icon = LucideIcons[category.icon] || Tag;
                return (
                  <div
                    key={category.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all cursor-move ${
                      draggedIndex === index
                        ? "border-indigo-600 bg-indigo-50 opacity-50 scale-105"
                        : "border-border hover:border-indigo-500/50 bg-secondary hover:shadow-md"
                    }`}
                  >
                    <GripVertical
                      size={18}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: category.color + "20" }}
                    >
                      <Icon size={20} style={{ color: category.color }} />
                    </div>
                    <span className="flex-1 font-semibold text-sm">
                      {category.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openCategoryModal(category)}
                      title="Edit category"
                      className="h-8 w-8 min-h-[44px] min-w-[44px]"
                      aria-label={`Edit ${category.name} category`}
                    >
                      <Edit2
                        size={16}
                        className="text-indigo-600"
                        aria-hidden="true"
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                      title="Delete category"
                      className="h-8 w-8 min-h-[44px] min-w-[44px]"
                      aria-label={`Delete ${category.name} category`}
                    >
                      <Trash2
                        size={16}
                        className="text-destructive"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Modal */}
      <Dialog
        open={showCategoryModal}
        onOpenChange={(open) =>
          !open && !savingCategory && closeCategoryModal()
        }
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
                <IconComponent size={24} style={{ color: "white" }} />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {editingCategory ? "Edit Category" : "Create Category"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {editingCategory
                    ? "Update your category details"
                    : "Add a new category to organize your expenses"}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5">
            {/* Preview */}
            <Card className="border-2">
              <CardHeader>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Preview
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: categoryForm.color + "20" }}
                  >
                    <IconComponent
                      size={32}
                      style={{ color: categoryForm.color }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {categoryForm.name || "Category Name"}
                    </h4>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Name Input */}
            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <FileText size={16} className="text-indigo-600" />
                Category Name
                <span className="text-destructive">*</span>
              </label>
              <Input
                value={categoryForm.name}
                onChange={(e) => {
                  setCategoryForm({
                    ...categoryForm,
                    name: e.target.value,
                  });
                  if (categoryFormErrors.name) {
                    setCategoryFormErrors({
                      ...categoryFormErrors,
                      name: null,
                    });
                  }
                }}
                placeholder="e.g., Groceries, Transport, Entertainment"
                error={categoryFormErrors.name}
                maxLength={30}
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">
                  {categoryForm.name.length}/30 characters
                </span>
              </div>
            </div>

            {/* Budget Input */}
            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <DollarSign size={16} className="text-indigo-600" />
                Monthly Budget (Optional)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="999999.99"
                value={categoryForm.budget}
                onChange={(e) => {
                  setCategoryForm({
                    ...categoryForm,
                    budget: e.target.value,
                  });
                  if (categoryFormErrors.budget) {
                    setCategoryFormErrors({
                      ...categoryFormErrors,
                      budget: null,
                    });
                  }
                }}
                placeholder="0.00"
                error={categoryFormErrors.budget}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Set a monthly spending limit for this category
              </p>
            </div>

            {/* Icon Selection */}
            <div>
              <label className="flex items-center gap-2 mb-3 font-semibold text-sm">
                <Tag size={16} className="text-indigo-600" />
                Choose Icon
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-2 max-h-48 overflow-y-auto rounded-lg border bg-secondary">
                {iconOptions.map((iconName) => {
                  const Icon = LucideIcons[iconName] || Tag;
                  const isSelected = categoryForm.icon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() =>
                        setCategoryForm({ ...categoryForm, icon: iconName })
                      }
                      className={`w-full aspect-square min-h-[3rem] p-2 rounded-lg border-2 transition-all flex items-center justify-center ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-transparent bg-card hover:border-indigo-300"
                      }`}
                      title={iconName}
                    >
                      <Icon size={22} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="flex items-center gap-2 mb-3 font-semibold text-sm">
                <Palette size={16} className="text-indigo-600" />
                Choose Color
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {colorOptions.map((color) => {
                  const isSelected = categoryForm.color === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setCategoryForm({ ...categoryForm, color })
                      }
                      style={{
                        backgroundColor: color,
                        transform: isSelected ? "scale(1.05)" : "scale(1)",
                        boxShadow: isSelected
                          ? "0 8px 16px rgba(0, 0, 0, 0.2)"
                          : "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                      className={`w-full aspect-[2.5/1] min-h-[3.5rem] rounded-xl border-2 transition-all flex items-center justify-center ${
                        isSelected ? "border-indigo-600" : "border-border"
                      }`}
                      title={color}
                    >
                      {isSelected && (
                        <Check
                          size={24}
                          style={{
                            color: "white",
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                          }}
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {categoryFormErrors.general && (
              <div className="p-3 rounded-lg text-sm bg-red-500/10 border border-red-500/30 text-red-600">
                {categoryFormErrors.general}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={closeCategoryModal}
                disabled={savingCategory}
                aria-label="Cancel category changes"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={handleSaveCategory}
                disabled={!categoryForm.name.trim() || savingCategory}
                loading={savingCategory}
                aria-label={
                  savingCategory
                    ? editingCategory
                      ? "Updating category"
                      : "Creating category"
                    : editingCategory
                    ? "Update category"
                    : "Create category"
                }
              >
                {!savingCategory && <Save size={20} aria-hidden="true" />}
                {savingCategory
                  ? editingCategory
                    ? "Updating..."
                    : "Creating..."
                  : editingCategory
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategorySettings;
