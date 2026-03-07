import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Flame, Trophy } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * StreakDisplay Component
 *
 * Displays current and longest streak information for the user.
 * Shows visual indicators with fire icon for current streak and trophy for longest.
 *
 * Requirements: 6.3, 6.4
 *
 * @param {Object} props
 * @param {Object} props.streakData - Streak data object
 * @param {number} props.streakData.currentStreak - Current consecutive days under budget
 * @param {number} props.streakData.longestStreak - Longest streak ever achieved
 * @param {string} props.streakData.streakStartDate - ISO date when current streak started
 * @param {string} props.className - Optional additional CSS classes
 */
const StreakDisplay = ({ streakData, className }) => {
  if (!streakData) {
    return null;
  }

  const { currentStreak = 0, longestStreak = 0 } = streakData;

  // Determine streak status for visual feedback
  const getStreakStatus = (streak) => {
    if (streak === 0) return "inactive";
    if (streak < 7) return "building";
    if (streak < 30) return "strong";
    return "legendary";
  };

  const currentStatus = getStreakStatus(currentStreak);

  // Color schemes based on streak status
  const statusColors = {
    inactive: "text-gray-400",
    building: "text-orange-500",
    strong: "text-orange-600",
    legendary: "text-red-500",
  };

  const statusBgColors = {
    inactive: "bg-gray-100 dark:bg-gray-800",
    building: "bg-orange-50 dark:bg-orange-950",
    strong: "bg-orange-100 dark:bg-orange-900",
    legendary: "bg-red-50 dark:bg-red-950",
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Savings Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Streak */}
        <div
          className={cn(
            "rounded-lg p-4 transition-colors",
            statusBgColors[currentStatus],
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Current Streak
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className={cn(
                    "text-3xl font-bold",
                    statusColors[currentStatus],
                  )}
                >
                  {currentStreak}
                </span>
                <span className="text-sm text-muted-foreground">
                  {currentStreak === 1 ? "day" : "days"}
                </span>
              </div>
            </div>
            <Flame
              className={cn("h-12 w-12", statusColors[currentStatus])}
              strokeWidth={1.5}
            />
          </div>

          {/* Status message */}
          {currentStreak === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Stay under budget to start your streak!
            </p>
          )}
          {currentStreak > 0 && currentStreak < 7 && (
            <p className="text-xs text-muted-foreground mt-2">
              Keep going! {7 - currentStreak} more{" "}
              {7 - currentStreak === 1 ? "day" : "days"} to reach 1 week
            </p>
          )}
          {currentStreak >= 7 && currentStreak < 30 && (
            <p className="text-xs text-muted-foreground mt-2">
              Great job! {30 - currentStreak} more{" "}
              {30 - currentStreak === 1 ? "day" : "days"} to reach 1 month
            </p>
          )}
          {currentStreak >= 30 && (
            <p className="text-xs text-muted-foreground mt-2">
              Amazing! You're on fire! 🔥
            </p>
          )}
        </div>

        {/* Longest Streak */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Longest Streak
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-500">
                  {longestStreak}
                </span>
                <span className="text-sm text-muted-foreground">
                  {longestStreak === 1 ? "day" : "days"}
                </span>
              </div>
            </div>
            <Trophy
              className="h-10 w-10 text-amber-600 dark:text-amber-500"
              strokeWidth={1.5}
            />
          </div>

          {longestStreak === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Start your first streak today!
            </p>
          )}
          {longestStreak > 0 && currentStreak === longestStreak && (
            <p className="text-xs text-green-600 dark:text-green-500 mt-2 font-medium">
              ✨ New personal record!
            </p>
          )}
          {longestStreak > 0 && currentStreak < longestStreak && (
            <p className="text-xs text-muted-foreground mt-2">
              Your personal best
            </p>
          )}
        </div>

        {/* Milestone indicators */}
        {currentStreak > 0 && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-2">Milestones</p>
            <div className="flex gap-2">
              {[7, 30, 60, 90].map((milestone) => (
                <div
                  key={milestone}
                  className={cn(
                    "flex-1 h-2 rounded-full transition-colors",
                    currentStreak >= milestone
                      ? "bg-orange-500"
                      : "bg-gray-200 dark:bg-gray-700",
                  )}
                  title={`${milestone} days`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">7d</span>
              <span className="text-xs text-muted-foreground">30d</span>
              <span className="text-xs text-muted-foreground">60d</span>
              <span className="text-xs text-muted-foreground">90d</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakDisplay;
