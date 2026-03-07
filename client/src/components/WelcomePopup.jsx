import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { TrendingUp, Sparkles, Heart } from "lucide-react";
import { useSavings } from "../context/SavingsContext";

/**
 * Custom hook to get window dimensions
 */
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

/**
 * WelcomePopup Component
 *
 * Displays a celebratory popup when the user opens the app, showing:
 * - Total weekly savings
 * - Most improved category
 * - Contextual encouraging messages
 * - Confetti animation for milestones
 *
 * Features:
 * - Auto-dismisses after 5 seconds
 * - Shows once per day using localStorage
 * - Keyboard support (Escape key)
 * - Confetti animation for milestone achievements
 *
 * @component
 */
const WelcomePopup = () => {
  const { calculateSavings, savings, loading } = useSavings();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("positive");
  const [mostImprovedCategory, setMostImprovedCategory] = useState(null);
  const { width, height } = useWindowSize();

  const STORAGE_KEY = "welcome_popup_last_shown";
  const AUTO_DISMISS_DELAY = 5000; // 5 seconds

  /**
   * Check if popup should be shown (once per day)
   */
  const shouldShowPopup = () => {
    try {
      const lastShown = localStorage.getItem(STORAGE_KEY);
      if (!lastShown) return true;

      const lastShownDate = new Date(lastShown);
      const today = new Date();

      // Check if it's a different day
      return (
        lastShownDate.getDate() !== today.getDate() ||
        lastShownDate.getMonth() !== today.getMonth() ||
        lastShownDate.getFullYear() !== today.getFullYear()
      );
    } catch (err) {
      console.error("Error checking popup display status:", err);
      return true;
    }
  };

  /**
   * Mark popup as shown for today
   */
  const markPopupShown = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch (err) {
      console.error("Error marking popup as shown:", err);
    }
  };

  /**
   * Generate contextual message based on savings performance
   */
  const generateMessage = (totalSavings, improvedCategory) => {
    if (totalSavings > 0) {
      // Positive messages for savings
      const positiveMessages = [
        `Amazing! You've saved ₹${totalSavings.toFixed(0)} this week! 🎉`,
        `Great job! ₹${totalSavings.toFixed(0)} saved this week keeps you on track! 💪`,
        `You're doing fantastic! ₹${totalSavings.toFixed(0)} saved this week! ⭐`,
        `Wonderful progress! ₹${totalSavings.toFixed(0)} saved this week! 🌟`,
      ];

      // Check for milestones (₹500, ₹1000, ₹5000, etc.)
      const milestones = [500, 1000, 5000, 10000, 50000, 100000];
      const achievedMilestone = milestones.find(
        (milestone) =>
          totalSavings >= milestone && totalSavings < milestone + 100, // Within 100 of milestone
      );

      if (achievedMilestone) {
        setShowConfetti(true);
        setMessageType("milestone");
        return `🎊 Milestone Achieved! You've saved ₹${achievedMilestone}! 🎊`;
      }

      setMessageType("positive");
      return positiveMessages[
        Math.floor(Math.random() * positiveMessages.length)
      ];
    } else {
      // Supportive messages for no savings or overspending
      const supportiveMessages = [
        "Every journey starts with a single step. Let's make today count! 💙",
        "New week, new opportunities to save! You've got this! 🌱",
        "Small changes lead to big results. Let's start fresh! ✨",
        "Your financial journey is unique. Keep moving forward! 🚀",
      ];

      setMessageType("supportive");
      return supportiveMessages[
        Math.floor(Math.random() * supportiveMessages.length)
      ];
    }
  };

  /**
   * Find the most improved category compared to previous period
   */
  const findMostImprovedCategory = (categoryBreakdown) => {
    if (!categoryBreakdown || categoryBreakdown.length === 0) return null;

    // For now, return the category with highest savings percentage
    // In a full implementation, this would compare with previous period
    const sorted = [...categoryBreakdown].sort(
      (a, b) => b.savingsPercentage - a.savingsPercentage,
    );

    return sorted[0]?.savingsPercentage > 0 ? sorted[0] : null;
  };

  /**
   * Initialize popup on component mount
   */
  useEffect(() => {
    const initializePopup = async () => {
      // Check if popup should be shown today
      if (!shouldShowPopup()) {
        console.log("Welcome popup already shown today");
        return;
      }

      // Calculate weekly savings
      const weeklySavings = await calculateSavings("week");

      if (!weeklySavings) {
        console.log("No savings data available");
        return;
      }

      // Find most improved category
      const improved = findMostImprovedCategory(
        weeklySavings.categoryBreakdown,
      );
      setMostImprovedCategory(improved);

      // Generate contextual message
      const msg = generateMessage(weeklySavings.totalSavings, improved);
      setMessage(msg);

      // Show popup within 1 second of app launch (Requirement 3.1)
      setTimeout(() => {
        setIsOpen(true);
        markPopupShown();
      }, 500);
    };

    initializePopup();
  }, []);

  /**
   * Auto-dismiss timer
   */
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, AUTO_DISMISS_DELAY);

    return () => clearTimeout(timer);
  }, [isOpen]);

  /**
   * Handle popup dismissal
   */
  const handleDismiss = () => {
    setIsOpen(false);
    setShowConfetti(false);
  };

  /**
   * Handle keyboard events (Escape key)
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (loading || !savings) {
    return null;
  }

  return (
    <>
      {/* Confetti animation for milestones */}
      {showConfetti && isOpen && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {messageType === "milestone" && (
                <Sparkles className="h-6 w-6 text-yellow-500" />
              )}
              {messageType === "positive" && (
                <TrendingUp className="h-6 w-6 text-green-500" />
              )}
              {messageType === "supportive" && (
                <Heart className="h-6 w-6 text-pink-500" />
              )}
              Welcome Back!
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              {message}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Weekly Savings Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                This Week's Savings
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                ₹{savings.totalSavings?.toFixed(0) || 0}
              </p>
            </div>

            {/* Most Improved Category */}
            {mostImprovedCategory && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Most Improved Category
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {mostImprovedCategory.categoryIcon || "📊"}
                  </span>
                  <div>
                    <p className="font-semibold text-lg">
                      {mostImprovedCategory.categoryName}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {mostImprovedCategory.savingsPercentage.toFixed(0)}% saved
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dismiss Button */}
          <div className="flex justify-end">
            <Button onClick={handleDismiss} variant="default">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WelcomePopup;
