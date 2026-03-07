# AchievementBadge Component

## Overview

The `AchievementBadge` component displays a single achievement badge with icon, color, description, and social sharing functionality. It supports celebration animations for newly earned badges.

## Requirements

- **7.4**: Display earned badges in a dedicated achievements section
- **7.6**: Allow users to share their achievements on social media

## Features

- **Dynamic Icons**: Uses Lucide React icons based on achievement type
- **Color Customization**: Each badge has a unique color scheme
- **Celebration Animation**: Bounce-in animation for newly earned badges
- **Social Sharing**: Web Share API integration with clipboard fallback
- **Achievement Metadata**: Shows type, earned date, and description
- **Hover Effects**: Interactive hover states with share button reveal
- **New Badge Indicator**: Visual "NEW!" badge for recently earned achievements

## Props

| Prop                      | Type     | Required | Description                                               |
| ------------------------- | -------- | -------- | --------------------------------------------------------- |
| `achievement`             | Object   | Yes      | Achievement data object                                   |
| `achievement.name`        | String   | Yes      | Achievement name                                          |
| `achievement.description` | String   | Yes      | Achievement description                                   |
| `achievement.icon`        | String   | No       | Lucide icon name (default: "Award")                       |
| `achievement.color`       | String   | No       | Badge color hex or tailwind (default: "#10b981")          |
| `achievement.type`        | String   | Yes      | Achievement type (MILESTONE, STREAK, CHALLENGE, CATEGORY) |
| `achievement.threshold`   | Number   | No       | Achievement threshold value                               |
| `achievement.earnedAt`    | Date     | No       | Date when achievement was earned                          |
| `isNew`                   | Boolean  | No       | Whether this is a newly earned badge (triggers animation) |
| `onShare`                 | Function | No       | Callback for sharing the achievement                      |
| `className`               | String   | No       | Additional CSS classes                                    |

## Usage

```jsx
import AchievementBadge from "../components/AchievementBadge";

function MyComponent() {
  const achievement = {
    name: "First ₹1000 Saved",
    description: "You've saved your first ₹1000! Keep up the great work!",
    icon: "Trophy",
    color: "#f59e0b",
    type: "MILESTONE",
    threshold: 1000,
    earnedAt: new Date("2024-01-15"),
  };

  const handleShare = (achievement) => {
    console.log("Sharing:", achievement);
  };

  return (
    <AchievementBadge
      achievement={achievement}
      isNew={true}
      onShare={handleShare}
    />
  );
}
```

## Achievement Types

- **MILESTONE**: Total savings milestones (₹500, ₹1000, ₹5000, etc.)
- **STREAK**: Consecutive periods under budget (7, 30, 60, 90 days)
- **CHALLENGE**: Challenge completion badges
- **CATEGORY**: Category-specific achievements

## Social Sharing

The component uses the Web Share API when available, allowing users to share achievements through their device's native share menu. If the Web Share API is not available, it falls back to copying the achievement text to the clipboard.

### Share Format

```
Achievement Unlocked: [Achievement Name]
I just earned the "[Achievement Name]" badge in Money Manager! [Description]
```

## Animations

- **Bounce-in**: Plays when `isNew` is true
- **Pulse**: Icon pulses during bounce-in animation
- **Hover**: Share button fades in on hover

## Accessibility

- Semantic HTML structure
- Keyboard accessible share button
- Screen reader friendly
- Focus management
- Dark mode support

## Example Data Structure

```javascript
const achievement = {
  id: 1,
  name: "Savings Superstar",
  description: "Saved ₹10,000 in total",
  icon: "Star",
  color: "#f59e0b",
  type: "MILESTONE",
  threshold: 10000,
  earnedAt: "2024-01-15T10:30:00Z",
};
```
