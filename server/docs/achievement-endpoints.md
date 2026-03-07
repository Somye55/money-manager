# Achievement and Streak API Endpoints

## Overview

These endpoints provide access to user achievements and streak data for the Savings Celebration System.

## Endpoints

### GET /api/savings/achievements

Retrieves all achievements earned by the authenticated user, along with progress toward the next milestone.

#### Query Parameters

- `type` (optional): Filter achievements by type
  - Valid values: `MILESTONE`, `STREAK`, `CHALLENGE`, `CATEGORY`

#### Response

```json
{
  "success": true,
  "data": {
    "earned": [
      {
        "id": 1,
        "achievementId": 5,
        "name": "First ₹500 Saved",
        "description": "You've saved your first ₹500!",
        "type": "MILESTONE",
        "threshold": 500,
        "icon": "Trophy",
        "color": "#10b981",
        "earnedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "totalEarned": 1,
    "totalSavings": 750.5,
    "nextMilestone": {
      "id": 6,
      "name": "₹1000 Milestone",
      "description": "Save ₹1000 in total",
      "threshold": 1000,
      "icon": "Award",
      "color": "#3b82f6",
      "progress": 75.05
    }
  }
}
```

#### Features

- Returns all earned achievements with full details
- Calculates total savings across all categories
- Identifies next milestone achievement
- Shows progress percentage toward next milestone
- Supports filtering by achievement type
- User-specific filtering (only shows authenticated user's achievements)

---

### GET /api/savings/streaks

Retrieves streak data for the authenticated user, including current streak, longest streak, and progress toward streak milestones.

#### Response

```json
{
  "success": true,
  "data": {
    "currentStreak": 5,
    "longestStreak": 12,
    "lastUpdated": "2024-01-15T00:00:00Z",
    "streakStartDate": "2024-01-10T00:00:00Z",
    "nextMilestone": {
      "days": 7,
      "daysRemaining": 2,
      "progress": 71.43
    },
    "achievements": [
      {
        "id": 2,
        "name": "7-Day Streak",
        "description": "Stayed under budget for 7 consecutive days",
        "threshold": 7,
        "icon": "Flame",
        "color": "#f59e0b",
        "earnedAt": "2024-01-08T00:00:00Z"
      }
    ]
  }
}
```

#### Features

- Returns current and longest streak counts
- Shows last update timestamp and streak start date
- Calculates next streak milestone (7, 30, 60, or 90 days)
- Shows days remaining to next milestone
- Displays progress percentage toward next milestone
- Includes all earned streak-related achievements
- Auto-creates streak record if none exists for user
- User-specific filtering (only shows authenticated user's streak)

---

## Authentication

All endpoints require authentication via the `authenticateUser` middleware. The authenticated user is available as `req.dbUser`.

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid achievement type",
  "message": "Type must be one of: MILESTONE, STREAK, CHALLENGE, CATEGORY"
}
```

### 500 Internal Server Error

```json
{
  "error": "Failed to fetch achievements",
  "message": "Database connection error"
}
```

## Implementation Notes

### Achievement Progress Calculation

The `/api/savings/achievements` endpoint calculates progress toward the next milestone by:

1. Fetching all categories with budgets for the user
2. Fetching all expenses for the user
3. Calculating total savings using `calculateSavingsFromData()`
4. Finding the next unearned milestone achievement
5. Computing progress percentage: `(totalSavings / threshold) * 100`

### Streak Milestone Logic

The `/api/savings/streaks` endpoint identifies the next streak milestone from the predefined list: [7, 30, 60, 90] days. It finds the first milestone greater than the current streak count.

### User-Specific Filtering

Both endpoints automatically filter data by the authenticated user's ID (`req.dbUser.id`), ensuring users can only access their own achievements and streaks.

## Related Requirements

- **Requirement 6.3**: Display current and longest streak on dashboard
- **Requirement 6.6**: Allow users to view streak history
- **Requirement 7.4**: Display earned badges in achievements section
- **Requirement 7.7**: Track progress toward next milestone
