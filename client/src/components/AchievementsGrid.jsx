import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trophy, Sparkles } from "lucide-react";
import AchievementBadge from "./AchievementBadge";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

/**
 * AchievementsGrid Component
 *
 * Displays a grid of achievement badges with celebration animations.
 * Shows confetti animation when new badges are earned.
 * Supports filtering by achievement type.
 *
 * Requirements: 7.4, 7.5, 7.6
 *
 * @param {Object} props
 * @param {Array} props.achievements - Array of user achievements
 * @param {Array} props.newAchievements - Array of newly earned achievement IDs
 * @param {Function} props.onShare - Callback for sharing achievements
 * @param {string} props.filter - Filter by achievement type (all, MILESTONE, STREAK, CHALLENGE, CATEGORY)
 * @param {Function} props.onFilterChange - Callback when filter changes
 * @param {string} props.className - Optional additional CSS classes
 */
const AchievementsGrid = ({
  achievements = [],
  newAchievements = [],
  onShare,
  filter = "all",
  onFilterChange,
  className,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  // Trigger confetti when new achievements are earned
  useEffect(() => {
    if (newAchievements.length > 0) {
      setShowConfetti(true);
      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [newAchievements]);

  // Filter achievements based on selected filter
  const filteredAchievements =
    filter === "all"
      ? achievements
      : achievements.filter((a) => a.achievement?.type === filter);

  // Sort achievements: new ones first, then by earned date (most recent first)
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    const aIsNew = newAchievements.includes(a.achievementId);
    const bIsNew = newAchievements.includes(b.achievementId);

    if (aIsNew && !bIsNew) return -1;
    if (!aIsNew && bIsNew) return 1;

    // Sort by earned date
    return new Date(b.earnedAt) - new Date(a.earnedAt);
  });

  // Filter options
  const filterOptions = [
    { value: "all", label: "All Badges" },
    { value: "MILESTONE", label: "Milestones" },
    { value: "STREAK", label: "Streaks" },
    { value: "CHALLENGE", label: "Challenges" },
    { value: "CATEGORY", label: "Categories" },
  ];

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Achievements
              {achievements.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({filteredAchievements.length})
                </span>
              )}
            </CardTitle>

            {/* New Badge Indicator */}
            {newAchievements.length > 0 && (
              <div className="flex items-center gap-1 text-sm font-medium text-orange-600 dark:text-orange-500">
                <Sparkles className="h-4 w-4" />
                {newAchievements.length} New!
              </div>
            )}
          </div>

          {/* Filter Buttons */}
          {onFilterChange && achievements.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFilterChange(option.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    filter === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Empty State */}
          {achievements.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Achievements Yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Start saving money to unlock your first achievement badge! Reach
                savings milestones, maintain streaks, and complete challenges to
                earn rewards.
              </p>
            </div>
          )}

          {/* Filtered Empty State */}
          {achievements.length > 0 && filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No {filter} Achievements
              </h3>
              <p className="text-sm text-muted-foreground">
                You haven't earned any {filter.toLowerCase()} badges yet.
              </p>
            </div>
          )}

          {/* Achievements Grid */}
          {filteredAchievements.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedAchievements.map((userAchievement) => (
                <AchievementBadge
                  key={userAchievement.id}
                  achievement={{
                    ...userAchievement.achievement,
                    earnedAt: userAchievement.earnedAt,
                  }}
                  isNew={newAchievements.includes(
                    userAchievement.achievementId,
                  )}
                  onShare={onShare}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AchievementsGrid;
