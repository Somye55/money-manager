import { useState, useEffect } from "react";
import { useSavings } from "../context/SavingsContext";
import { useData } from "../context/DataContext";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, TrendingUp, Calendar } from "lucide-react";
import SavingsTrendChart from "../components/SavingsTrendChart";
import CategoryPieChart from "../components/CategoryPieChart";
import CategoryProgressBars from "../components/CategoryProgressBars";
import StreakDisplay from "../components/StreakDisplay";
import AchievementsGrid from "../components/AchievementsGrid";

const SavingsDashboard = () => {
  const {
    calculateSavings,
    savings,
    loading,
    error,
    fetchAchievements,
    fetchStreaks,
    achievements,
    streaks,
  } = useSavings();
  const { settings } = useData();
  const [selectedInterval, setSelectedInterval] = useState("month");
  const [achievementFilter, setAchievementFilter] = useState("all");

  // Currency symbol based on settings
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

  // Time interval options
  const intervals = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "quarter", label: "Quarter" },
    { value: "year", label: "Year" },
  ];

  // Fetch savings data when interval changes
  useEffect(() => {
    calculateSavings(selectedInterval);
  }, [selectedInterval, calculateSavings]);

  // Fetch achievements and streaks on mount
  useEffect(() => {
    fetchAchievements();
    fetchStreaks();
  }, [fetchAchievements, fetchStreaks]);

  // Handle interval change
  const handleIntervalChange = (interval) => {
    setSelectedInterval(interval);
  };

  // Handle achievement share
  const handleAchievementShare = async (achievement) => {
    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Achievement Unlocked: ${achievement.name}`,
          text: `I just earned the "${achievement.name}" badge in Money Manager! ${achievement.description}`,
          url: window.location.origin,
        });
      } catch (err) {
        console.log("Share cancelled or failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `Achievement Unlocked: ${achievement.name}\n${achievement.description}`;
      try {
        await navigator.clipboard.writeText(text);
        console.log("Achievement copied to clipboard");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  // Loading state
  if (loading && !savings) {
    return <SavingsDashboardSkeleton />;
  }

  return (
    <div className="bg-page-gradient min-h-full">
      <div className="w-full px-3 py-6 space-y-6">
        {/* Header */}
        <div className="animate-fadeIn">
          <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-primary" />
            Savings Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your savings across different time periods
          </p>
        </div>

        {/* Time Interval Selector */}
        <div
          className="animate-fadeIn card-elevated rounded-2xl overflow-hidden bg-card"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Time Period
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {intervals.map((interval) => (
                <button
                  key={interval.value}
                  onClick={() => handleIntervalChange(interval.value)}
                  className={`
                    px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap
                    ${
                      selectedInterval === interval.value
                        ? "bg-gradient-primary text-white shadow-lg scale-105"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    }
                  `}
                  aria-label={`Select ${interval.label} view`}
                  aria-pressed={selectedInterval === interval.value}
                >
                  {interval.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Total Savings Card */}
        {savings && (
          <div
            className="animate-fadeIn relative overflow-hidden rounded-2xl shadow-xl transition-smooth hover:shadow-2xl hover:scale-[1.02]"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-100"></div>
            <div className="absolute inset-0 shimmer"></div>
            <div className="relative p-6 flex flex-col">
              <div className="text-sm text-white/80 mb-1 font-medium">
                Total Savings
              </div>
              <div
                className="font-bold mb-2 text-white"
                style={{
                  fontSize: (() => {
                    const totalSavings = savings.totalSavings || 0;
                    const formatted = `${currencySymbol}${totalSavings.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: totalSavings % 1 === 0 ? 0 : 2,
                      },
                    )}`;
                    const len = formatted.length;
                    if (len > 12) return "1.25rem";
                    if (len > 10) return "1.5rem";
                    if (len > 8) return "1.75rem";
                    if (len > 6) return "2rem";
                    return "2.5rem";
                  })(),
                  lineHeight: "1.2",
                  whiteSpace: "nowrap",
                }}
              >
                {currencySymbol}
                {(savings.totalSavings || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits:
                    (savings.totalSavings || 0) % 1 === 0 ? 0 : 2,
                })}
              </div>
              <div className="text-xs text-white/70">
                For the selected {selectedInterval}
              </div>
            </div>
          </div>
        )}

        {/* Streak Display */}
        {streaks && (
          <div className="animate-fadeIn" style={{ animationDelay: "0.25s" }}>
            <StreakDisplay streakData={streaks} />
          </div>
        )}

        {/* Achievements Grid */}
        {achievements && achievements.length > 0 && (
          <div className="animate-fadeIn" style={{ animationDelay: "0.28s" }}>
            <AchievementsGrid
              achievements={achievements}
              newAchievements={[]} // Could track new achievements in state
              onShare={handleAchievementShare}
              filter={achievementFilter}
              onFilterChange={setAchievementFilter}
            />
          </div>
        )}

        {/* Savings Trend Chart */}
        {savings && (
          <div className="animate-fadeIn" style={{ animationDelay: "0.3s" }}>
            <SavingsTrendChart
              categoryBreakdown={savings.categoryBreakdown || []}
              totalSavings={savings.totalSavings || 0}
              interval={selectedInterval}
              currencySymbol={currencySymbol}
            />
          </div>
        )}

        {/* Category Pie Chart */}
        {savings && (
          <div className="animate-fadeIn" style={{ animationDelay: "0.35s" }}>
            <CategoryPieChart
              categoryBreakdown={savings.categoryBreakdown || []}
              currencySymbol={currencySymbol}
              onCategoryClick={(category) => {
                // Handle category click - could show detailed modal in future
                console.log("Category clicked:", category);
              }}
            />
          </div>
        )}

        {/* Category Breakdown */}
        {savings?.categoryBreakdown && savings.categoryBreakdown.length > 0 && (
          <div className="animate-fadeIn" style={{ animationDelay: "0.45s" }}>
            <CategoryProgressBars
              categoryBreakdown={savings.categoryBreakdown}
              currencySymbol={currencySymbol}
              onCategoryClick={(category) => {
                // Handle category click - could show detailed modal in future
                console.log("Category clicked:", category);
              }}
            />
          </div>
        )}

        {/* Empty State */}
        {savings &&
          (!savings.categoryBreakdown ||
            savings.categoryBreakdown.length === 0) && (
            <div
              className="animate-fadeIn card-elevated rounded-2xl overflow-hidden bg-card"
              style={{ animationDelay: "0.45s" }}
            >
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Savings Data
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Set budgets for your categories to start tracking savings
                </p>
              </div>
            </div>
          )}

        {/* Loading Overlay */}
        {loading && savings && (
          <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-foreground font-medium">
                  Updating savings...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading skeleton component
const SavingsDashboardSkeleton = () => {
  return (
    <div className="bg-page-gradient min-h-full">
      <div className="w-full px-3 py-6 space-y-6">
        {/* Header Skeleton */}
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>

        {/* Time Interval Selector Skeleton */}
        <div className="card-elevated rounded-2xl overflow-hidden bg-card">
          <div className="p-4">
            <Skeleton className="h-4 w-24 mb-3" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-9 w-20 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Total Savings Card Skeleton */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-primary opacity-100"></div>
          <div className="relative p-6 flex flex-col min-h-[140px]">
            <Skeleton className="h-[14px] w-28 bg-white/40 mb-1" />
            <Skeleton className="h-[40px] w-40 bg-white/50 mb-2" />
            <Skeleton className="h-[12px] w-32 bg-white/35" />
          </div>
        </div>

        {/* Category Breakdown Skeleton */}
        <div className="card-elevated rounded-2xl overflow-hidden bg-card">
          <div className="p-6 pb-4">
            <Skeleton className="h-[18px] w-36 mb-1" />
            <Skeleton className="h-[14px] w-48 mb-6" />
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-[45px] h-[45px] rounded-xl" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 mb-1 ml-auto" />
                      <Skeleton className="h-3 w-12 ml-auto" />
                    </div>
                  </div>
                  <Skeleton className="h-2.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsDashboard;
