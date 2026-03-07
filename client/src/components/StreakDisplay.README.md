# StreakDisplay Component

## Overview

The `StreakDisplay` component shows the user's current savings streak and their longest streak ever achieved. It provides visual feedback with color-coded status indicators and milestone progress tracking.

## Requirements

- **6.3**: Display the current streak count on the Savings Dashboard
- **6.4**: Display the longest streak achieved by the user

## Features

- **Current Streak Display**: Shows consecutive days under budget with dynamic color coding
- **Longest Streak Display**: Shows personal best streak achievement
- **Status Indicators**: Visual feedback based on streak length (inactive, building, strong, legendary)
- **Milestone Progress**: Visual indicators for 7, 30, 60, and 90-day milestones
- **Motivational Messages**: Context-aware messages to encourage users
- **Responsive Design**: Works on all screen sizes

## Props

| Prop                         | Type   | Required | Description                                              |
| ---------------------------- | ------ | -------- | -------------------------------------------------------- |
| `streakData`                 | Object | Yes      | Streak data object containing current and longest streak |
| `streakData.currentStreak`   | Number | Yes      | Current consecutive days under budget                    |
| `streakData.longestStreak`   | Number | Yes      | Longest streak ever achieved                             |
| `streakData.streakStartDate` | String | No       | ISO date when current streak started                     |
| `className`                  | String | No       | Additional CSS classes                                   |

## Usage

```jsx
import StreakDisplay from "../components/StreakDisplay";
import { useSavings } from "../context/SavingsContext";

function MyComponent() {
  const { streaks } = useSavings();

  return <StreakDisplay streakData={streaks} />;
}
```

## Streak Status Levels

- **Inactive** (0 days): Gray color, encourages starting a streak
- **Building** (1-6 days): Orange color, shows progress to 1 week
- **Strong** (7-29 days): Darker orange, shows progress to 1 month
- **Legendary** (30+ days): Red color, celebrates achievement

## Milestone Indicators

The component shows progress toward four key milestones:

- 7 days (1 week)
- 30 days (1 month)
- 60 days (2 months)
- 90 days (3 months)

## Accessibility

- Semantic HTML structure
- Color is not the only indicator (text labels included)
- Responsive text sizing
- Dark mode support

## Example Data

```javascript
const streakData = {
  currentStreak: 15,
  longestStreak: 45,
  streakStartDate: "2024-01-01T00:00:00Z",
};
```
