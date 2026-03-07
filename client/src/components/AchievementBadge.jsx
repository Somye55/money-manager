import React, { useState } from "react";
import * as Icons from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Share2 } from "lucide-react";

/**
 * AchievementBadge Component
 *
 * Displays a single achievement badge with icon, color, and description.
 * Supports celebration animations and social sharing.
 *
 * Requirements: 7.4, 7.6
 *
 * @param {Object} props
 * @param {Object} props.achievement - Achievement data
 * @param {string} props.achievement.name - Achievement name
 * @param {string} props.achievement.description - Achievement description
 * @param {string} props.achievement.icon - Lucide icon name
 * @param {string} props.achievement.color - Badge color (hex or tailwind color)
 * @param {string} props.achievement.type - Achievement type (MILESTONE, STREAK, CHALLENGE, CATEGORY)
 * @param {number} props.achievement.threshold - Achievement threshold value
 * @param {Date} props.achievement.earnedAt - Date when achievement was earned
 * @param {boolean} props.isNew - Whether this is a newly earned badge (triggers animation)
 * @param {Function} props.onShare - Callback for sharing the achievement
 * @param {string} props.className - Optional additional CSS classes
 */
const AchievementBadge = ({
  achievement,
  isNew = false,
  onShare,
  className,
}) => {
  const [isAnimating, setIsAnimating] = useState(isNew);

  if (!achievement) {
    return null;
  }

  const {
    name,
    description,
    icon = "Award",
    color = "#10b981",
    type,
    threshold,
    earnedAt,
  } = achievement;

  // Get the icon component from Lucide
  const IconComponent = Icons[icon] || Icons.Award;

  // Format the earned date
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle share button click
  const handleShare = async (e) => {
    e.stopPropagation();

    if (onShare) {
      onShare(achievement);
      return;
    }

    // Default share implementation using Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Achievement Unlocked: ${name}`,
          text: `I just earned the "${name}" badge in Money Manager! ${description}`,
          url: window.location.origin,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log("Share cancelled or failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `Achievement Unlocked: ${name}\n${description}`;
      try {
        await navigator.clipboard.writeText(text);
        // Could show a toast here
        console.log("Achievement copied to clipboard");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  // Animation end handler
  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-card p-4 transition-all hover:shadow-lg",
        isAnimating && "animate-bounce-in",
        className,
      )}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Badge Icon */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
            isAnimating && "animate-pulse",
          )}
          style={{
            backgroundColor: `${color}20`,
          }}
        >
          <IconComponent
            className="h-6 w-6"
            style={{ color }}
            strokeWidth={2}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Badge Name */}
          <h3 className="font-semibold text-sm mb-1 truncate">{name}</h3>

          {/* Badge Description */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>

          {/* Badge Metadata */}
          <div className="flex items-center gap-2 mt-2">
            {/* Type Badge */}
            <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
              {type}
            </span>

            {/* Earned Date */}
            {earnedAt && (
              <span className="text-xs text-muted-foreground">
                {formatDate(earnedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Share Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleShare}
          title="Share achievement"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* New Badge Indicator */}
      {isNew && (
        <div className="absolute -top-2 -right-2">
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg animate-pulse">
            NEW!
          </span>
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;
