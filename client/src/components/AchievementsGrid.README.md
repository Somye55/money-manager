# AchievementsGrid Component

## Overview

The `AchievementsGrid` component displays a grid of achievement badges with celebration animations, filtering capabilities, and confetti effects for newly earned achievements.

## Requirements

- **7.4**: Display earned badges in a dedicated achievements section
- **7.5**: Display a celebration animation when a badge is earned
- **7.6**: Allow users to share their achievements on social media

## Features

- **Grid Layout**: Responsive grid that adapts to screen size
- **Confetti Animation**: Celebrates new achievements with confetti effect
- **Filtering**: Filter badges by type (All, Milestones, Streaks, Challenges, Categories)
- **Sorting**: New badges appear first, then sorted by earned date
- **Empty States**: Helpful messages when no badges are earned
- **New Badge Counter**: Shows count of newly earned badges
- **Social Sharing**: Integrated sharing for each badge

## Props

| Prop              | Type     | Required | Description                                         |
| ----------------- | -------- | -------- | --------------------------------------------------- |
| `achievements`    | Array    | No       | Array of user achievement objects (default: [])     |
| `newAchievements` | Array    | No       | Array of newly earned achievement IDs (default: []) |
| `onShare`         | Function | No       | Callback for sharing achievements                   |
| `filter`          | String   | No       | Current filter value (default: "all")               |
| `onFilterChange`  | Function | No       | Callback when filter changes                        |
| `className`       | String   | No       | Additional CSS classes                              |

## Usage

```jsx
import AchievementsGrid from "../components/AchievementsGrid";
import { useSavings } from "../context/SavingsContext";

function MyComponent() {
  const { achievements } = useSavings();
  const [filter, setFilter] = useState("all");
  const [newAchievements, setNewAchievements] = useState([]);

  const handleShare = async (achievement) => {
    // Custom share logic
    console.log("Sharing:", achievement);
  };

  return (
    <AchievementsGrid
      achievements={achievements}
      newAchievements={newAchievements}
      onShare={handleShare}
      filter={filter}
      onFilterChange={setFilter}
    />
  );
}
```

## Filter Options

- **all**: Show all badges
- **MILESTONE**: Show only milestone badges
- **STREAK**: Show only streak badges
- **CHALLENGE**: Show only challenge badges
- **CATEGORY**: Show only category-specific badges

## Achievement Data Structure

Each achievement in the `achievements` array should have this structure:

```javascript
{
  id: 1,
  achievementId: 5,
  earnedAt: "2024-01-15T10:30:00Z",
  achievement: {
    name: "First ₹1000 Saved",
    description: "You've saved your first ₹1000!",
    icon: "Trophy",
    color: "#f59e0b",
    type: "MILESTONE",
    threshold: 1000
  }
}
```

## Confetti Animation

The confetti animation automatically triggers when:

- `newAchievements` array is not empty
- Duration: 5 seconds
- Uses `react-confetti` library
- Responsive to window size

## Empty States

The component shows different empty states:

1. **No Achievements**: When user has no badges at all
2. **No Filtered Achievements**: When filter returns no results

Both states include helpful messages to guide the user.

## Sorting Logic

Achievements are sorted in this order:

1. New achievements first (based on `newAchievements` array)
2. Then by earned date (most recent first)

## Accessibility

- Semantic HTML structure
- ARIA labels for filter buttons
- Keyboard navigation support
- Screen reader friendly
- Dark mode support
- Focus management

## Dependencies

- `react-confetti`: For celebration animations
- `react-use`: For window size hook
- `AchievementBadge`: Individual badge component
- Lucide React icons

## Example Implementation

```jsx
import { useState, useEffect } from "react";
import AchievementsGrid from "../components/AchievementsGrid";
import { useSavings } from "../context/SavingsContext";

function AchievementsPage() {
  const { achievements, fetchAchievements } = useSavings();
  const [filter, setFilter] = useState("all");
  const [newAchievements, setNewAchievements] = useState([]);

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Track new achievements
  useEffect(() => {
    const lastSeenIds = JSON.parse(
      localStorage.getItem("lastSeenAchievements") || "[]",
    );
    const currentIds = achievements.map((a) => a.achievementId);
    const newIds = currentIds.filter((id) => !lastSeenIds.includes(id));

    setNewAchievements(newIds);

    // Update last seen after 5 seconds
    setTimeout(() => {
      localStorage.setItem("lastSeenAchievements", JSON.stringify(currentIds));
      setNewAchievements([]);
    }, 5000);
  }, [achievements]);

  const handleShare = async (achievement) => {
    if (navigator.share) {
      await navigator.share({
        title: `Achievement: ${achievement.name}`,
        text: achievement.description,
        url: window.location.origin,
      });
    }
  };

  return (
    <div className="p-6">
      <AchievementsGrid
        achievements={achievements}
        newAchievements={newAchievements}
        onShare={handleShare}
        filter={filter}
        onFilterChange={setFilter}
      />
    </div>
  );
}
```

## Performance Considerations

- Confetti animation is limited to 5 seconds
- Sorting is memoized through array operations
- Filter operations are efficient with array methods
- Component only re-renders when props change
