import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * CategoryProgressBars Component
 *
 * Displays enhanced progress bars for each category with:
 * - Category icon, name, and savings percentage
 * - Category colors for visual consistency
 * - Smooth animations for progress bar filling
 * - Hover effects and transitions
 *
 * @param {Object} props
 * @param {Array} props.categoryBreakdown - Array of category savings data
 * @param {string} props.currencySymbol - Currency symbol to display
 * @param {Function} props.onCategoryClick - Optional callback when category is clicked
 */
const CategoryProgressBars = ({
  categoryBreakdown = [],
  currencySymbol = "₹",
  onCategoryClick,
}) => {
  const [animatedCategories, setAnimatedCategories] = useState([]);

  // Trigger animation when category data changes
  useEffect(() => {
    // Reset animation state
    setAnimatedCategories([]);

    // Trigger animation after a brief delay for smooth effect
    const timer = setTimeout(() => {
      setAnimatedCategories(categoryBreakdown);
    }, 100);

    return () => clearTimeout(timer);
  }, [categoryBreakdown]);

  if (!categoryBreakdown || categoryBreakdown.length === 0) {
    return (
      <div className="card-elevated rounded-2xl overflow-hidden bg-card">
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            No category data available. Set budgets to track savings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated rounded-2xl overflow-hidden bg-card">
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Category Savings
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Savings breakdown by category
        </p>
        <div className="space-y-5">
          {categoryBreakdown.map((category, index) => {
            const savingsPercentage = category.savingsPercentage || 0;
            const isSaving = category.savedAmount > 0;
            const isAnimated = animatedCategories.includes(category);

            return (
              <CategoryProgressBar
                key={category.categoryId}
                category={category}
                savingsPercentage={savingsPercentage}
                isSaving={isSaving}
                isAnimated={isAnimated}
                currencySymbol={currencySymbol}
                onCategoryClick={onCategoryClick}
                animationDelay={index * 50}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Individual Category Progress Bar Component
 *
 * Displays a single category's progress with animations
 */
const CategoryProgressBar = ({
  category,
  savingsPercentage,
  isSaving,
  isAnimated,
  currencySymbol,
  onCategoryClick,
  animationDelay,
}) => {
  const [progressWidth, setProgressWidth] = useState(0);

  // Animate progress bar filling
  useEffect(() => {
    if (isAnimated) {
      const timer = setTimeout(() => {
        setProgressWidth(Math.min(savingsPercentage, 100));
      }, animationDelay);

      return () => clearTimeout(timer);
    } else {
      setProgressWidth(0);
    }
  }, [isAnimated, savingsPercentage, animationDelay]);

  const handleClick = () => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  return (
    <div
      className={`
        transition-all duration-300 ease-out
        ${onCategoryClick ? "cursor-pointer hover:scale-[1.02]" : ""}
      `}
      onClick={handleClick}
      role={onCategoryClick ? "button" : "article"}
      tabIndex={onCategoryClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onCategoryClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`${category.categoryName}: ${isSaving ? "Saved" : "Overspent"} ${currencySymbol}${Math.abs(category.savedAmount).toLocaleString("en-IN")}`}
    >
      {/* Category Header */}
      <div className="flex items-center justify-between mb-2">
        {/* Left: Icon and Name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Category Icon */}
          <div
            className="p-2.5 rounded-xl flex-shrink-0 transition-transform duration-300 hover:scale-110"
            style={{
              background: `${category.categoryColor}20`,
            }}
          >
            <div
              className="w-5 h-5 rounded-full"
              style={{
                background: category.categoryColor,
              }}
              aria-hidden="true"
            />
          </div>

          {/* Category Name and Budget Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-medium block truncate">
                {category.categoryName}
              </span>
              {isSaving ? (
                <TrendingUp
                  className="w-4 h-4 text-green-600 flex-shrink-0"
                  aria-label="Saving"
                />
              ) : (
                <TrendingDown
                  className="w-4 h-4 text-red-600 flex-shrink-0"
                  aria-label="Overspending"
                />
              )}
            </div>
            <span className="text-xs text-muted-foreground block truncate">
              {currencySymbol}
              {category.spentAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: category.spentAmount % 1 === 0 ? 0 : 2,
              })}{" "}
              of {currencySymbol}
              {category.budgetAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: category.budgetAmount % 1 === 0 ? 0 : 2,
              })}
            </span>
          </div>
        </div>

        {/* Right: Savings Amount and Percentage */}
        <div className="text-right flex-shrink-0 ml-3">
          <span
            className={`font-semibold text-sm ${
              isSaving ? "text-green-600" : "text-red-600"
            }`}
          >
            {isSaving ? "+" : ""}
            {currencySymbol}
            {category.savedAmount.toLocaleString("en-IN", {
              minimumFractionDigits: 0,
              maximumFractionDigits: category.savedAmount % 1 === 0 ? 0 : 2,
            })}
          </span>
          <span className="text-xs text-muted-foreground block">
            {savingsPercentage.toFixed(0)}% saved
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2.5 bg-secondary rounded-full overflow-hidden">
        {/* Background shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

        {/* Progress fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progressWidth}%`,
            background: isSaving
              ? `linear-gradient(90deg, #10b981 0%, #059669 100%)`
              : `linear-gradient(90deg, #ef4444 0%, #dc2626 100%)`,
            boxShadow: isSaving
              ? "0 0 10px rgba(16, 185, 129, 0.3)"
              : "0 0 10px rgba(239, 68, 68, 0.3)",
          }}
        >
          {/* Animated shine effect on the progress bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
        </div>
      </div>
    </div>
  );
};

export default CategoryProgressBars;
