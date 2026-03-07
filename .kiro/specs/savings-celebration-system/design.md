# Design Document: Savings Celebration System

## Overview

The Savings Celebration System is a comprehensive feature set that transforms the Money Manager app from a passive expense tracker into an active savings motivator. The system calculates savings by comparing budgeted amounts against actual spending, then celebrates achievements through visual feedback, gamification, and personalized insights.

### Core Philosophy

Rather than focusing on negative aspects of overspending, this system emphasizes positive reinforcement for good financial behavior. Every interaction is designed to motivate users through:

- **Immediate Feedback**: Real-time savings calculations and visual progress indicators
- **Gamification**: Streaks, badges, challenges, and milestones that make saving fun
- **Personalization**: Context-aware messages and recommendations based on individual patterns
- **Celebration**: Animations, notifications, and rewards for achievements

### Key Design Principles

1. **Performance First**: All calculations must complete within 1 second; UI updates within 500ms
2. **Progressive Enhancement**: Features work offline with local storage, sync when online
3. **Non-Intrusive**: Celebrations enhance rather than interrupt the user experience
4. **Data-Driven**: All insights and recommendations based on actual user behavior patterns
5. **Privacy-Focused**: All calculations happen client-side or on user's server; no third-party analytics

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Savings    │  │  Welcome     │  │  Savings     │          │
│  │  Dashboard   │  │   Popup      │  │  Timeline    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┼──────────────────┘                   │
│                            │                                      │
│  ┌─────────────────────────▼──────────────────────────┐          │
│  │         Savings Context Provider                    │          │
│  │  - State Management                                 │          │
│  │  - Real-time Calculations                           │          │
│  │  - Achievement Tracking                             │          │
│  └─────────────────────────┬──────────────────────────┘          │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                      Service Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Savings    │  │  Achievement │  │  Analytics   │           │
│  │  Calculator  │  │   Manager    │  │   Engine     │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                  │                  │                    │
│  ┌──────▼──────────────────▼──────────────────▼───────┐           │
│  │         Notification Service                        │           │
│  │  - Push Notifications                               │           │
│  │  - Scheduled Jobs                                   │           │
│  └─────────────────────────┬─────────────────────────┘           │
└────────────────────────────┼───────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                      Data Layer                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Savings    │  │ Achievements │  │   Savings    │           │
│  │    Goals     │  │   & Badges   │  │    Jars      │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Challenges  │  │   Streaks    │  │  Auto-Save   │           │
│  │              │  │              │  │    Rules     │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└───────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

#### Client Layer

**Savings Dashboard**

- Primary interface for viewing savings metrics
- Displays charts, progress bars, and category breakdowns
- Handles time interval selection (day/week/month/quarter/year)
- Renders top categories and comparison analytics

**Welcome Popup**

- Modal dialog shown on app launch
- Displays weekly savings summary
- Shows most improved category
- Triggers celebration animations for milestones
- Auto-dismisses after 5 seconds

**Savings Timeline**

- Chronological view of achievements
- Filterable by achievement type
- Social sharing integration
- Historical milestone tracking

**Savings Context Provider**

- Centralized state management for all savings data
- Real-time calculation engine
- Achievement detection and triggering
- Local storage persistence
- API synchronization

#### Service Layer

**Savings Calculator**

- Computes savings as (budget - actual spending)
- Handles negative savings (overspending)
- Aggregates across time intervals
- Category-wise breakdown calculations
- Recalculates on expense/budget changes

**Achievement Manager**

- Tracks progress toward milestones
- Awards badges when thresholds reached
- Manages streak counting
- Challenge progress tracking
- Triggers celebration events

**Analytics Engine**

- Pattern identification (recurring expenses, peak days)
- Comparison analytics (period-over-period)
- Predictive projections
- Recommendation generation
- Insight summarization

**Notification Service**

- Schedules daily/weekly summaries
- Sends milestone achievement notifications
- Manages budget warning alerts
- Respects user preferences and system permissions
- Handles notification delivery via Capacitor

#### Data Layer

All data persists in PostgreSQL via Prisma ORM, with local caching for offline support.

## Components and Interfaces

### Frontend Components

#### SavingsDashboard Component

```typescript
interface SavingsDashboardProps {
  timeInterval: "day" | "week" | "month" | "quarter" | "year";
  onIntervalChange: (interval: string) => void;
}

interface SavingsMetrics {
  totalSavings: number;
  categoryBreakdown: CategorySavings[];
  comparisonData: ComparisonMetrics;
  projections: ProjectionData;
  topCategories: CategorySavings[];
}

interface CategorySavings {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  budgetAmount: number;
  spentAmount: number;
  savedAmount: number;
  savingsPercentage: number;
}
```

**Key Features:**

- Time interval selector with smooth transitions
- Recharts integration for trend visualization
- Progress bars for category-wise savings
- Comparison cards showing period-over-period changes
- Quick action buttons for goals and challenges

#### WelcomePopup Component

```typescript
interface WelcomePopupProps {
  isOpen: boolean;
  onDismiss: () => void;
  savingsData: WeeklySavingsSummary;
  achievements: Achievement[];
}

interface WeeklySavingsSummary {
  totalSavings: number;
  mostImprovedCategory: CategorySavings;
  message: string;
  messageType: "positive" | "supportive" | "milestone";
  showConfetti: boolean;
}
```

**Key Features:**

- Auto-dismiss timer (5 seconds)
- Confetti animation for milestones
- Contextual messaging based on performance
- Smooth fade-in/fade-out transitions
- Accessibility-compliant (keyboard navigation, screen reader support)

#### SavingsTimeline Component

```typescript
interface TimelineEntry {
  id: number;
  type: "milestone" | "streak" | "challenge" | "badge";
  title: string;
  description: string;
  amount?: number;
  date: Date;
  icon: string;
  color: string;
}

interface SavingsTimelineProps {
  entries: TimelineEntry[];
  filter: "all" | "milestone" | "streak" | "challenge" | "badge";
  onFilterChange: (filter: string) => void;
  onShare: (entry: TimelineEntry) => void;
}
```

#### VirtualJar Component

```typescript
interface VirtualJar {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  color: string;
  icon: string;
  progress: number;
}

interface VirtualJarProps {
  jar: VirtualJar;
  onAddFunds: (jarId: number, amount: number) => void;
  onWithdraw: (jarId: number, amount: number) => void;
  onDelete: (jarId: number) => void;
  onEdit: (jarId: number, updates: Partial<VirtualJar>) => void;
}
```

**Visual Design:**

- Animated filling effect as funds are added
- Liquid wave animation for visual appeal
- Progress percentage overlay
- Goal completion celebration

#### ChallengeCard Component

```typescript
interface Challenge {
  id: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  endDate: Date;
  status: "active" | "completed" | "failed";
  reward: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete: (challengeId: number) => void;
}
```

### Context Providers

#### SavingsContext

```typescript
interface SavingsContextValue {
  // State
  savings: SavingsMetrics;
  achievements: Achievement[];
  streaks: StreakData;
  jars: VirtualJar[];
  challenges: Challenge[];
  autoSaveRules: AutoSaveRule[];

  // Actions
  calculateSavings: (timeInterval: string) => Promise<SavingsMetrics>;
  createJar: (jar: Omit<VirtualJar, "id">) => Promise<VirtualJar>;
  allocateToJar: (jarId: number, amount: number) => Promise<void>;
  createChallenge: (challenge: Omit<Challenge, "id">) => Promise<Challenge>;
  addAutoSaveRule: (rule: Omit<AutoSaveRule, "id">) => Promise<AutoSaveRule>;
  exportSavingsData: (
    format: "csv" | "json",
    dateRange: DateRange,
  ) => Promise<Blob>;

  // Loading states
  loading: boolean;
  error: Error | null;
}
```

### API Endpoints

#### Savings Endpoints

```
GET    /api/savings/calculate
POST   /api/savings/goals
GET    /api/savings/goals
PUT    /api/savings/goals/:id
DELETE /api/savings/goals/:id

GET    /api/savings/jars
POST   /api/savings/jars
PUT    /api/savings/jars/:id
POST   /api/savings/jars/:id/allocate
POST   /api/savings/jars/:id/withdraw
DELETE /api/savings/jars/:id

GET    /api/savings/achievements
GET    /api/savings/streaks
GET    /api/savings/timeline

GET    /api/savings/challenges
POST   /api/savings/challenges
PUT    /api/savings/challenges/:id
DELETE /api/savings/challenges/:id

GET    /api/savings/analytics/comparison
GET    /api/savings/analytics/projections
GET    /api/savings/analytics/patterns
GET    /api/savings/analytics/recommendations

POST   /api/savings/auto-save-rules
GET    /api/savings/auto-save-rules
PUT    /api/savings/auto-save-rules/:id
DELETE /api/savings/auto-save-rules/:id

GET    /api/savings/export
```

#### Request/Response Examples

**Calculate Savings**

```typescript
// GET /api/savings/calculate?interval=month&startDate=2024-01-01&endDate=2024-01-31
Response: {
  totalSavings: 5000,
  categoryBreakdown: [
    {
      categoryId: 1,
      categoryName: "Food",
      budgetAmount: 10000,
      spentAmount: 7500,
      savedAmount: 2500,
      savingsPercentage: 25
    }
  ],
  comparisonData: {
    previousPeriodSavings: 4000,
    changePercentage: 25,
    trend: "improving"
  }
}
```

**Create Virtual Jar**

```typescript
// POST /api/savings/jars
Request: {
  name: "Vacation Fund",
  targetAmount: 50000,
  targetDate: "2024-12-31",
  color: "#10b981",
  icon: "Plane"
}

Response: {
  id: 1,
  name: "Vacation Fund",
  targetAmount: 50000,
  currentAmount: 0,
  targetDate: "2024-12-31",
  color: "#10b981",
  icon: "Plane",
  progress: 0,
  createdAt: "2024-01-15T10:00:00Z"
}
```

**Create Challenge**

```typescript
// POST /api/savings/challenges
Request: {
  title: "Save ₹10,000 in January",
  description: "Challenge yourself to save ₹10,000 this month",
  targetAmount: 10000,
  startDate: "2024-01-01",
  endDate: "2024-01-31"
}

Response: {
  id: 1,
  title: "Save ₹10,000 in January",
  description: "Challenge yourself to save ₹10,000 this month",
  targetAmount: 10000,
  currentAmount: 0,
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  status: "active",
  reward: "Challenge Master Badge"
}
```

## Data Models

### Database Schema Extensions

```prisma
// Extend existing User model
model User {
  id        Int      @id @default(autoincrement())
  email     String?  @unique
  phone     String?  @unique
  name      String?
  password  String?
  googleId  String?  @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  expenses   Expense[]
  categories Category[]
  settings   UserSettings?

  // New relations for savings system
  savingsGoals      SavingsGoal[]
  virtualJars       VirtualJar[]
  achievements      UserAchievement[]
  streaks           SavingsStreak[]
  challenges        SavingsChallenge[]
  autoSaveRules     AutoSaveRule[]
  notifications     SavingsNotification[]
}

// Extend existing Category model to include budgets
model Category {
  id        Int      @id @default(autoincrement())
  name      String
  icon      String?
  color     String?
  order     Int      @default(0)
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  expenses  Expense[]
  budget    Decimal? @db.Decimal(10, 2)  // Monthly budget for this category
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([name, userId])
}

// New models for savings system

model SavingsGoal {
  id              Int      @id @default(autoincrement())
  userId          Int
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoryId      Int?     // Optional: goal for specific category
  targetAmount    Decimal  @db.Decimal(10, 2)
  targetPercentage Decimal? @db.Decimal(5, 2)  // Alternative: percentage-based goal
  currentAmount   Decimal  @default(0) @db.Decimal(10, 2)
  startDate       DateTime @default(now())
  endDate         DateTime?
  status          GoalStatus @default(ACTIVE)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId, status])
}

enum GoalStatus {
  ACTIVE
  COMPLETED
  CANCELLED
}

model VirtualJar {
  id            Int      @id @default(autoincrement())
  userId        Int
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name          String
  description   String?
  targetAmount  Decimal  @db.Decimal(10, 2)
  currentAmount Decimal  @default(0) @db.Decimal(10, 2)
  targetDate    DateTime?
  color         String   @default("#10b981")
  icon          String   @default("Piggy Bank")
  status        JarStatus @default(ACTIVE)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  transactions  JarTransaction[]

  @@index([userId, status])
}

enum JarStatus {
  ACTIVE
  COMPLETED
  ARCHIVED
}

model JarTransaction {
  id          Int      @id @default(autoincrement())
  jarId       Int
  jar         VirtualJar @relation(fields: [jarId], references: [id], onDelete: Cascade)
  amount      Decimal  @db.Decimal(10, 2)
  type        TransactionType
  description String?
  createdAt   DateTime @default(now())

  @@index([jarId, createdAt])
}

enum TransactionType {
  DEPOSIT
  WITHDRAWAL
}

model Achievement {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  description String
  type        AchievementType
  threshold   Decimal  @db.Decimal(10, 2)
  icon        String
  color       String
  createdAt   DateTime @default(now())

  userAchievements UserAchievement[]
}

enum AchievementType {
  MILESTONE      // Total savings milestones
  STREAK         // Consecutive periods under budget
  CHALLENGE      // Challenge completion
  CATEGORY       // Category-specific achievements
}

model UserAchievement {
  id            Int      @id @default(autoincrement())
  userId        Int
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievementId Int
  achievement   Achievement @relation(fields: [achievementId], references: [id])
  earnedAt      DateTime @default(now())

  @@unique([userId, achievementId])
  @@index([userId, earnedAt])
}

model SavingsStreak {
  id              Int      @id @default(autoincrement())
  userId          Int
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  currentStreak   Int      @default(0)
  longestStreak   Int      @default(0)
  lastUpdated     DateTime @default(now())
  streakStartDate DateTime @default(now())

  @@unique([userId])
}

model SavingsChallenge {
  id            Int      @id @default(autoincrement())
  userId        Int
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title         String
  description   String
  targetAmount  Decimal  @db.Decimal(10, 2)
  currentAmount Decimal  @default(0) @db.Decimal(10, 2)
  startDate     DateTime
  endDate       DateTime
  status        ChallengeStatus @default(ACTIVE)
  reward        String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId, status])
  @@index([userId, endDate])
}

enum ChallengeStatus {
  ACTIVE
  COMPLETED
  FAILED
}

model AutoSaveRule {
  id              Int      @id @default(autoincrement())
  userId          Int
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name            String
  type            AutoSaveType
  value           Decimal  @db.Decimal(10, 2)  // Amount or percentage
  targetJarId     Int?     // Optional: specific jar to save to
  frequency       Frequency?  // For fixed amount rules
  maxDaily        Decimal? @db.Decimal(10, 2)
  maxMonthly      Decimal? @db.Decimal(10, 2)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId, isActive])
}

enum AutoSaveType {
  ROUND_UP_10    // Round up to nearest ₹10
  ROUND_UP_50    // Round up to nearest ₹50
  ROUND_UP_100   // Round up to nearest ₹100
  PERCENTAGE     // Save percentage of each expense
  FIXED_DAILY    // Save fixed amount daily
  FIXED_WEEKLY   // Save fixed amount weekly
}

enum Frequency {
  DAILY
  WEEKLY
  MONTHLY
}

model SavingsNotification {
  id          Int      @id @default(autoincrement())
  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type        NotificationType
  title       String
  message     String
  data        Json?    // Additional data for the notification
  isRead      Boolean  @default(false)
  sentAt      DateTime?
  createdAt   DateTime @default(now())

  @@index([userId, isRead])
  @@index([userId, createdAt])
}

enum NotificationType {
  DAILY_SUMMARY
  WEEKLY_SUMMARY
  MILESTONE
  STREAK
  CHALLENGE_COMPLETE
  CHALLENGE_FAILED
  BUDGET_WARNING_75
  BUDGET_WARNING_90
  BUDGET_EXCEEDED
  JAR_GOAL_REACHED
}

model SavingsSnapshot {
  id              Int      @id @default(autoincrement())
  userId          Int
  date            DateTime @default(now())
  totalSavings    Decimal  @db.Decimal(10, 2)
  categoryData    Json     // Stores category-wise breakdown
  createdAt       DateTime @default(now())

  @@index([userId, date])
  @@unique([userId, date])
}
```

### Local Storage Schema

For offline support and performance, certain data is cached in browser localStorage:

```typescript
interface LocalSavingsCache {
  lastCalculated: string; // ISO timestamp
  currentMonthSavings: SavingsMetrics;
  achievements: Achievement[];
  activeJars: VirtualJar[];
  activeChallenges: Challenge[];
  streakData: StreakData;
  preferences: {
    showWelcomePopup: boolean;
    notificationsEnabled: boolean;
    animationsEnabled: boolean;
    warningThresholds: {
      level1: number; // Default: 75
      level2: number; // Default: 90
    };
  };
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Budget Storage Integrity

_For any_ category and budget amount, when a budget is set, querying the category should return the exact budget amount that was stored.

**Validates: Requirements 1.1**

### Property 2: Expense Aggregation Accuracy

_For any_ category and any set of expenses in that category, the total spent amount should equal the sum of all expense amounts in that category.

**Validates: Requirements 1.2**

### Property 3: Savings Calculation Correctness

_For any_ category with a budget, the calculated savings should equal (budget amount - total spent amount).

**Validates: Requirements 1.3**

### Property 4: Category Savings Summation

_For any_ time interval, the sum of all category-wise savings should equal the total savings displayed for that interval.

**Validates: Requirements 2.3**

### Property 5: Budget Filter Exclusion

_For any_ time interval, categories without budgets should not appear in the savings breakdown for that interval.

**Validates: Requirements 2.4**

### Property 6: Most Improved Category Identification

_For any_ two consecutive time periods, the most improved category should be the one with the largest positive change in savings amount.

**Validates: Requirements 3.3**

### Property 7: Streak Notification Triggering

_For any_ streak completion event, a corresponding notification should be created in the system.

**Validates: Requirements 4.4**

### Property 8: Notification Suppression When Disabled

_For any_ notification type, if notifications are disabled by the user, no notifications of that type should be sent.

**Validates: Requirements 4.7**

### Property 9: Progress Percentage Calculation

_For any_ category with a budget, the progress percentage should equal (saved amount / budget amount) \* 100.

**Validates: Requirements 5.3**

### Property 10: Category Color Consistency

_For any_ category, its assigned color should be identical across all chart visualizations in the dashboard.

**Validates: Requirements 5.6**

### Property 11: Streak Increment Logic

_For any_ current streak value, when a user completes a period under budget, the new streak value should equal the previous value plus one.

**Validates: Requirements 6.1**

### Property 12: Streak Reset on Overspending

_For any_ streak value, when a user exceeds budget in any category, the streak should be reset to zero.

**Validates: Requirements 6.2**

### Property 13: Longest Streak Invariant

_For any_ user at any point in time, the longest streak should always be greater than or equal to the current streak.

**Validates: Requirements 6.4**

### Property 14: Milestone Badge Award

_For any_ predefined savings threshold, when a user's total savings crosses that threshold, a corresponding badge should be awarded.

**Validates: Requirements 7.1**

### Property 15: Category Badge Award

_For any_ category with consistent savings over a defined period, a category-specific badge should be awarded.

**Validates: Requirements 7.3**

### Property 16: Milestone Progress Calculation

_For any_ user, progress toward the next milestone should equal (current total savings / next milestone threshold) \* 100.

**Validates: Requirements 7.7**

### Property 17: Jar Creation Validation

_For any_ jar creation attempt without a required field (name or target amount), the creation should be rejected with a validation error.

**Validates: Requirements 8.2**

### Property 18: Jar Allocation Effect

_For any_ jar and allocation amount, after allocation, the jar's current amount should equal the previous amount plus the allocated amount.

**Validates: Requirements 8.4**

### Property 19: Jar Progress Calculation

_For any_ jar, the progress percentage should equal (current amount / target amount) \* 100.

**Validates: Requirements 8.5**

### Property 20: Jar Goal Completion Trigger

_For any_ jar, when the current amount becomes greater than or equal to the target amount, a goal completion celebration should be triggered.

**Validates: Requirements 8.7**

### Property 21: Jar Withdrawal Effect

_For any_ jar and withdrawal amount, after withdrawal, the jar's current amount should equal the previous amount minus the withdrawal amount.

**Validates: Requirements 8.8**

### Property 22: Percentage Change Calculation

_For any_ category and two time periods, the percentage change in spending should equal ((current period spending - previous period spending) / previous period spending) \* 100.

**Validates: Requirements 9.3**

### Property 23: Total Change Aggregation

_For any_ comparison period, the total improvement or decline should equal the sum of all individual category changes.

**Validates: Requirements 9.6**

### Property 24: Projection Consistency

_For any_ set of spending data, running the projection calculation multiple times with the same data should produce the same projected values.

**Validates: Requirements 10.1**

### Property 25: Yearly Projection Relationship

_For any_ monthly projection, the yearly projection should be derived from the monthly value using a consistent multiplier and adjustment factor.

**Validates: Requirements 10.2**

### Property 26: Confidence Level Correlation

_For any_ set of historical spending data, higher variance in the data should result in lower confidence levels for projections.

**Validates: Requirements 10.3**

### Property 27: Projection Data Threshold

_For any_ user with less than 2 weeks of expense data, no projections should be generated.

**Validates: Requirements 10.6**

### Property 28: Challenge Creation Validation

_For any_ challenge creation attempt without required fields (target amount or duration), the creation should be rejected with a validation error.

**Validates: Requirements 11.3**

### Property 29: Challenge Progress Tracking

_For any_ active challenge, the progress amount should equal the sum of all savings accumulated during the challenge period.

**Validates: Requirements 11.4**

### Property 30: Challenge Completion Badge

_For any_ completed challenge, a corresponding achievement badge should be awarded to the user.

**Validates: Requirements 11.6**

### Property 31: Round-Up Calculation Correctness

_For any_ expense amount and round-up target (₹10, ₹50, or ₹100), the saved amount should equal (ceiling(amount / target) \* target) - amount.

**Validates: Requirements 12.1**

### Property 32: Percentage-Based Auto-Save Calculation

_For any_ expense amount and percentage value, the auto-saved amount should equal (expense amount \* percentage) / 100.

**Validates: Requirements 12.2**

### Property 33: Auto-Save Jar Allocation

_For any_ auto-save rule trigger, the designated jar's balance should increase by exactly the calculated auto-save amount.

**Validates: Requirements 12.4**

### Property 34: Auto-Save Total Calculation

_For any_ user, the total amount saved through auto-save rules should equal the sum of all auto-save transactions.

**Validates: Requirements 12.6**

### Property 35: Auto-Save Limit Enforcement

_For any_ time period (daily or monthly), the total auto-saved amount should not exceed the configured maximum limit for that period.

**Validates: Requirements 12.7**

### Property 36: Over-Budget Notification Trigger

_For any_ category, when spending exceeds the budget, an over-budget notification should be created.

**Validates: Requirements 13.3**

### Property 37: Remaining Budget Calculation

_For any_ budget warning, the displayed remaining budget should equal (budget amount - current spending).

**Validates: Requirements 13.4**

### Property 38: Warning Suppression When Disabled

_For any_ category, when budget warnings are disabled, no warning notifications should be generated regardless of spending level.

**Validates: Requirements 13.6**

### Property 39: Recurring Expense Identification

_For any_ category, expenses that occur at regular intervals (with variance below a threshold) should be identified as recurring.

**Validates: Requirements 14.1**

### Property 40: Peak Spending Day Identification

_For any_ set of expenses grouped by day of week, the identified peak day should be the day with the maximum total spending.

**Validates: Requirements 14.2**

### Property 41: Consistent Savings Identification

_For any_ set of categories, the most consistent category should be the one with the lowest variance in savings amounts over time.

**Validates: Requirements 14.3**

### Property 42: Variable Spending Identification

_For any_ set of categories, the most variable category should be the one with the highest variance in spending amounts over time.

**Validates: Requirements 14.4**

### Property 43: Pattern Analysis Data Threshold

_For any_ user with less than 4 weeks of expense data, no pattern insights should be generated.

**Validates: Requirements 14.7**

### Property 44: CSV Export Round-Trip

_For any_ savings data exported to CSV format, parsing the CSV should reconstruct data equivalent to the original.

**Validates: Requirements 15.1**

### Property 45: JSON Export Round-Trip

_For any_ savings data exported to JSON format, parsing the JSON should reconstruct data equivalent to the original.

**Validates: Requirements 15.2**

### Property 46: Export Date Range Filtering

_For any_ date range selection, exported data should only include records with dates within the specified range (inclusive).

**Validates: Requirements 15.3**

### Property 47: Animation Suppression When Disabled

_For any_ achievement event, when animations are disabled in settings, no animations should be displayed.

**Validates: Requirements 16.6**

### Property 48: Message Variation

_For any_ sequence of message generations with the same input parameters, the generated messages should vary to avoid repetition.

**Validates: Requirements 17.4**

### Property 49: Category Goal Progress Calculation

_For any_ category with a savings goal, the progress percentage should equal (current category savings / target savings) \* 100.

**Validates: Requirements 18.3**

### Property 50: Category Goal Achievement Notification

_For any_ category goal, when current savings become greater than or equal to the target, a celebration notification should be triggered.

**Validates: Requirements 18.4**

### Property 51: Recommendation Category Selection

_For any_ set of categories, recommended categories for spending reduction should be those with above-average spending or below-average savings rates.

**Validates: Requirements 19.2**

### Property 52: Recommendation Data Threshold

_For any_ user with less than 3 weeks of expense data, no recommendations should be generated.

**Validates: Requirements 19.7**

### Property 53: Timeline Chronological Ordering

_For any_ timeline view, all entries should be ordered by date in descending order (most recent first).

**Validates: Requirements 20.1**

### Property 54: Timeline Filter Correctness

_For any_ achievement type filter, the filtered timeline should only contain entries matching the selected type.

**Validates: Requirements 20.5**

## Error Handling

### Client-Side Error Handling

#### Calculation Errors

**Scenario**: Division by zero when calculating percentages

```typescript
function calculateSavingsPercentage(saved: number, budget: number): number {
  if (budget === 0 || budget === null || budget === undefined) {
    return 0; // Return 0% if no budget set
  }
  return (saved / budget) * 100;
}
```

**Scenario**: Invalid date ranges

```typescript
function validateDateRange(startDate: Date, endDate: Date): void {
  if (startDate > endDate) {
    throw new ValidationError("Start date must be before end date");
  }
  if (startDate > new Date()) {
    throw new ValidationError("Start date cannot be in the future");
  }
}
```

#### Network Errors

**Scenario**: API request failures

```typescript
async function fetchSavingsData(interval: string): Promise<SavingsMetrics> {
  try {
    const response = await api.get(
      `/api/savings/calculate?interval=${interval}`,
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // No data available, return empty state
      return getEmptySavingsMetrics();
    }
    if (error.response?.status >= 500) {
      // Server error, use cached data if available
      const cached = localStorage.getItem("savings_cache");
      if (cached) {
        return JSON.parse(cached);
      }
    }
    // Network error, show user-friendly message
    throw new NetworkError(
      "Unable to load savings data. Please check your connection.",
    );
  }
}
```

#### Data Validation Errors

**Scenario**: Invalid jar creation

```typescript
function validateJarCreation(jar: Partial<VirtualJar>): ValidationResult {
  const errors: string[] = [];

  if (!jar.name || jar.name.trim().length === 0) {
    errors.push("Jar name is required");
  }

  if (!jar.targetAmount || jar.targetAmount <= 0) {
    errors.push("Target amount must be greater than zero");
  }

  if (jar.targetDate && new Date(jar.targetDate) < new Date()) {
    errors.push("Target date cannot be in the past");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

### Server-Side Error Handling

#### Database Errors

**Scenario**: Constraint violations

```javascript
async function createVirtualJar(userId, jarData) {
  try {
    const jar = await prisma.virtualJar.create({
      data: {
        userId,
        ...jarData,
      },
    });
    return { success: true, data: jar };
  } catch (error) {
    if (error.code === "P2002") {
      // Unique constraint violation
      return {
        success: false,
        error: "A jar with this name already exists",
      };
    }
    if (error.code === "P2003") {
      // Foreign key constraint violation
      return {
        success: false,
        error: "Invalid user reference",
      };
    }
    throw error; // Re-throw unexpected errors
  }
}
```

#### Calculation Errors

**Scenario**: Insufficient data for projections

```javascript
function calculateProjections(expenses, minDataPoints = 14) {
  if (expenses.length < minDataPoints) {
    return {
      success: false,
      error: `Insufficient data. Need at least ${minDataPoints} days of expenses.`,
      projections: null,
    };
  }

  try {
    const projections = performProjectionCalculation(expenses);
    return {
      success: true,
      projections,
    };
  } catch (error) {
    logger.error("Projection calculation failed", {
      error,
      expenseCount: expenses.length,
    });
    return {
      success: false,
      error: "Unable to calculate projections",
      projections: null,
    };
  }
}
```

### Notification Errors

**Scenario**: Push notification failures

```javascript
async function sendPushNotification(userId, notification) {
  try {
    // Check if user has granted permissions
    const settings = await getUserSettings(userId);
    if (!settings.enableNotifications) {
      return { success: false, reason: "Notifications disabled by user" };
    }

    // Attempt to send notification
    await notificationService.send(userId, notification);

    // Log successful delivery
    await prisma.savingsNotification.create({
      data: {
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        sentAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    // Log failure but don't throw - notifications are non-critical
    logger.warn("Notification delivery failed", { userId, error });

    // Store notification for later retry
    await prisma.savingsNotification.create({
      data: {
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        sentAt: null, // Indicates pending
      },
    });

    return { success: false, reason: error.message };
  }
}
```

### Graceful Degradation

#### Offline Mode

When network is unavailable:

- Use cached data from localStorage
- Queue mutations for later sync
- Display offline indicator
- Disable features requiring server (export, social sharing)

```typescript
class SavingsService {
  private isOnline: boolean = navigator.onLine;

  constructor() {
    window.addEventListener("online", () => this.handleOnline());
    window.addEventListener("offline", () => this.handleOffline());
  }

  async calculateSavings(interval: string): Promise<SavingsMetrics> {
    if (!this.isOnline) {
      // Use local calculation with cached data
      const expenses = this.getLocalExpenses();
      const categories = this.getLocalCategories();
      return this.calculateLocally(expenses, categories, interval);
    }

    // Online: fetch from server
    return this.fetchFromServer(interval);
  }

  private handleOffline() {
    this.isOnline = false;
    toast.info("You are offline. Some features may be limited.");
  }

  private handleOnline() {
    this.isOnline = true;
    this.syncPendingChanges();
    toast.success("Back online. Syncing your data...");
  }
}
```

#### Animation Fallbacks

If animations cause performance issues:

- Detect low-end devices
- Reduce animation complexity
- Provide option to disable animations

```typescript
function shouldUseReducedMotion(): boolean {
  // Check user preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Check device performance
  const isLowEndDevice = navigator.hardwareConcurrency <= 2;

  return prefersReducedMotion || isLowEndDevice;
}
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, error conditions, and UI interactions
- **Property tests**: Verify universal properties across all inputs through randomization

Both approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing

#### Library Selection

**JavaScript/TypeScript**: Use `fast-check` library

```bash
npm install --save-dev fast-check
```

#### Configuration

Each property test must:

- Run minimum 100 iterations (due to randomization)
- Reference its design document property in a comment
- Use the tag format: `Feature: savings-celebration-system, Property {number}: {property_text}`

#### Example Property Tests

**Property 3: Savings Calculation Correctness**

```typescript
import fc from "fast-check";

describe("Savings Calculator", () => {
  test("Property 3: Savings equals budget minus spending", () => {
    // Feature: savings-celebration-system, Property 3: Savings Calculation Correctness
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100000 }), // budget
        fc.float({ min: 0, max: 100000 }), // spending
        (budget, spending) => {
          const savings = calculateSavings(budget, spending);
          const expected = budget - spending;
          expect(savings).toBeCloseTo(expected, 2);
        },
      ),
      { numRuns: 100 },
    );
  });
});
```

**Property 11: Streak Increment Logic**

```typescript
test("Property 11: Streak increments by one on success", () => {
  // Feature: savings-celebration-system, Property 11: Streak Increment Logic
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 1000 }), // current streak
      (currentStreak) => {
        const newStreak = incrementStreak(currentStreak);
        expect(newStreak).toBe(currentStreak + 1);
      },
    ),
    { numRuns: 100 },
  );
});
```

**Property 31: Round-Up Calculation Correctness**

```typescript
test("Property 31: Round-up calculation is correct", () => {
  // Feature: savings-celebration-system, Property 31: Round-Up Calculation Correctness
  fc.assert(
    fc.property(
      fc.float({ min: 0.01, max: 10000 }), // expense amount
      fc.constantFrom(10, 50, 100), // round-up target
      (amount, target) => {
        const saved = calculateRoundUp(amount, target);
        const expected = Math.ceil(amount / target) * target - amount;
        expect(saved).toBeCloseTo(expected, 2);
      },
    ),
    { numRuns: 100 },
  );
});
```

**Property 44: CSV Export Round-Trip**

```typescript
test("Property 44: CSV export and parse preserves data", () => {
  // Feature: savings-celebration-system, Property 44: CSV Export Round-Trip
  fc.assert(
    fc.property(
      fc.array(
        fc.record({
          date: fc.date(),
          category: fc.string(),
          budget: fc.float({ min: 0, max: 100000 }),
          spent: fc.float({ min: 0, max: 100000 }),
          saved: fc.float({ min: -100000, max: 100000 }),
        }),
      ),
      (savingsData) => {
        const csv = exportToCSV(savingsData);
        const parsed = parseCSV(csv);
        expect(parsed).toEqual(savingsData);
      },
    ),
    { numRuns: 100 },
  );
});
```

### Unit Testing

#### Focus Areas for Unit Tests

Unit tests should focus on:

1. Specific examples that demonstrate correct behavior
2. Edge cases (empty data, zero values, boundary conditions)
3. Error conditions and validation
4. UI component rendering and interactions
5. Integration between components

#### Example Unit Tests

**Savings Calculator - Edge Cases**

```typescript
describe("Savings Calculator - Edge Cases", () => {
  test("returns zero savings when budget is zero", () => {
    const savings = calculateSavings(0, 100);
    expect(savings).toBe(0);
  });

  test("returns negative savings when overspending", () => {
    const savings = calculateSavings(1000, 1500);
    expect(savings).toBe(-500);
  });

  test("handles null budget gracefully", () => {
    const savings = calculateSavings(null, 100);
    expect(savings).toBe(0);
  });
});
```

**Welcome Popup - UI Interactions**

```typescript
describe('Welcome Popup', () => {
  test('displays positive message when user has saved money', () => {
    const { getByText } = render(
      <WelcomePopup
        savingsData={{ totalSavings: 5000, messageType: 'positive' }}
      />
    );
    expect(getByText(/great job/i)).toBeInTheDocument();
  });

  test('displays supportive message when user has not saved', () => {
    const { getByText } = render(
      <WelcomePopup
        savingsData={{ totalSavings: -500, messageType: 'supportive' }}
      />
    );
    expect(getByText(/keep going/i)).toBeInTheDocument();
  });

  test('shows confetti animation for milestones', () => {
    const { container } = render(
      <WelcomePopup
        savingsData={{ showConfetti: true }}
      />
    );
    expect(container.querySelector('.confetti')).toBeInTheDocument();
  });

  test('closes when dismiss button is clicked', () => {
    const onDismiss = jest.fn();
    const { getByRole } = render(
      <WelcomePopup onDismiss={onDismiss} />
    );
    fireEvent.click(getByRole('button', { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalled();
  });
});
```

**Virtual Jar - CRUD Operations**

```typescript
describe("Virtual Jar Manager", () => {
  test("creates jar with valid data", async () => {
    const jar = await createJar({
      name: "Vacation",
      targetAmount: 50000,
    });
    expect(jar.id).toBeDefined();
    expect(jar.name).toBe("Vacation");
    expect(jar.currentAmount).toBe(0);
  });

  test("rejects jar creation without name", async () => {
    await expect(createJar({ targetAmount: 50000 })).rejects.toThrow(
      "Jar name is required",
    );
  });

  test("rejects jar creation without target amount", async () => {
    await expect(createJar({ name: "Vacation" })).rejects.toThrow(
      "Target amount must be greater than zero",
    );
  });

  test("allocates funds correctly", async () => {
    const jar = await createJar({ name: "Test", targetAmount: 1000 });
    await allocateToJar(jar.id, 250);
    const updated = await getJar(jar.id);
    expect(updated.currentAmount).toBe(250);
  });
});
```

**Achievement System - Milestone Detection**

```typescript
describe("Achievement System", () => {
  test("awards badge at ₹500 milestone", async () => {
    const user = await createTestUser();
    await updateTotalSavings(user.id, 500);
    const achievements = await getUserAchievements(user.id);
    expect(achievements).toContainEqual(
      expect.objectContaining({ name: "First ₹500 Saved" }),
    );
  });

  test("awards badge at ₹1000 milestone", async () => {
    const user = await createTestUser();
    await updateTotalSavings(user.id, 1000);
    const achievements = await getUserAchievements(user.id);
    expect(achievements).toContainEqual(
      expect.objectContaining({ name: "First ₹1000 Saved" }),
    );
  });

  test("does not award duplicate badges", async () => {
    const user = await createTestUser();
    await updateTotalSavings(user.id, 500);
    await updateTotalSavings(user.id, 600);
    const achievements = await getUserAchievements(user.id);
    const milestone500 = achievements.filter(
      (a) => a.name === "First ₹500 Saved",
    );
    expect(milestone500).toHaveLength(1);
  });
});
```

### Integration Testing

Test complete user flows:

```typescript
describe('Savings Journey Integration', () => {
  test('complete savings flow: budget → expense → savings → milestone', async () => {
    // 1. User sets budget
    await setCategory Budget('Food', 10000);

    // 2. User adds expenses
    await addExpense({ category: 'Food', amount: 7500 });

    // 3. System calculates savings
    const savings = await calculateSavings('month');
    expect(savings.categoryBreakdown[0].savedAmount).toBe(2500);

    // 4. User allocates to jar
    const jar = await createJar({ name: 'Emergency', targetAmount: 10000 });
    await allocateToJar(jar.id, 2500);

    // 5. Check if milestone reached
    const achievements = await getUserAchievements();
    expect(achievements.length).toBeGreaterThan(0);
  });
});
```

### Performance Testing

Critical performance requirements:

```typescript
describe('Performance Requirements', () => {
  test('savings calculation completes within 1 second', async () => {
    const start = Date.now();
    await calculateSavings('month');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000);
  });

  test('dashboard updates within 500ms on interval change', async () => {
    const { rerender } = render(<SavingsDashboard interval="week" />);
    const start = Date.now();
    rerender(<SavingsDashboard interval="month" />);
    await waitFor(() => {
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(500);
    });
  });

  test('export completes within 5 seconds for 1 year of data', async () => {
    const yearOfData = generateYearOfExpenses();
    const start = Date.now();
    await exportSavingsData('csv', { startDate: '2024-01-01', endDate: '2024-12-31' });
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(5000);
  });
});
```

### Test Coverage Goals

- **Unit Test Coverage**: Minimum 80% code coverage
- **Property Test Coverage**: All 54 correctness properties must have corresponding tests
- **Integration Test Coverage**: All major user flows
- **E2E Test Coverage**: Critical paths (budget setup → expense tracking → savings celebration)

## Implementation Details

### Phase 1: Core Savings Calculation (Requirements 1-2)

#### Backend Implementation

**New API Endpoints**

```javascript
// server/src/routes/savings.js
const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");

router.get("/calculate", async (req, res) => {
  const { interval, startDate, endDate } = req.query;
  const userId = req.dbUser.id;

  try {
    // Fetch expenses in date range
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: { category: true },
    });

    // Fetch categories with budgets
    const categories = await prisma.category.findMany({
      where: {
        userId,
        budget: { not: null },
      },
    });

    // Calculate savings
    const savingsData = calculateSavingsFromData(expenses, categories);

    res.json(savingsData);
  } catch (error) {
    console.error("Savings calculation error:", error);
    res.status(500).json({ error: "Failed to calculate savings" });
  }
});

function calculateSavingsFromData(expenses, categories) {
  const categoryMap = new Map();

  // Initialize with budgets
  categories.forEach((cat) => {
    categoryMap.set(cat.id, {
      categoryId: cat.id,
      categoryName: cat.name,
      categoryIcon: cat.icon,
      categoryColor: cat.color,
      budgetAmount: parseFloat(cat.budget),
      spentAmount: 0,
      savedAmount: 0,
      savingsPercentage: 0,
    });
  });

  // Aggregate expenses
  expenses.forEach((expense) => {
    if (expense.categoryId && categoryMap.has(expense.categoryId)) {
      const cat = categoryMap.get(expense.categoryId);
      cat.spentAmount += parseFloat(expense.amount);
    }
  });

  // Calculate savings
  let totalSavings = 0;
  const categoryBreakdown = [];

  categoryMap.forEach((cat) => {
    cat.savedAmount = cat.budgetAmount - cat.spentAmount;
    cat.savingsPercentage = (cat.savedAmount / cat.budgetAmount) * 100;
    totalSavings += cat.savedAmount;
    categoryBreakdown.push(cat);
  });

  return {
    totalSavings,
    categoryBreakdown,
  };
}

module.exports = router;
```

**Database Migration**

```sql
-- Add budget column to categories
ALTER TABLE "Category" ADD COLUMN "budget" DECIMAL(10,2);

-- Create index for performance
CREATE INDEX "Category_userId_budget_idx" ON "Category"("userId", "budget");
```

#### Frontend Implementation

**Savings Context Provider**

```typescript
// client/src/context/SavingsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SavingsContext = createContext();

export function SavingsProvider({ children }) {
  const [savings, setSavings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateSavings = async (interval) => {
    setLoading(true);
    setError(null);

    try {
      const { startDate, endDate } = getDateRangeForInterval(interval);
      const response = await axios.get('/api/savings/calculate', {
        params: { interval, startDate, endDate }
      });

      setSavings(response.data);

      // Cache for offline use
      localStorage.setItem('savings_cache', JSON.stringify(response.data));

      return response.data;
    } catch (err) {
      setError(err.message);

      // Try to use cached data
      const cached = localStorage.getItem('savings_cache');
      if (cached) {
        setSavings(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SavingsContext.Provider value={{ savings, loading, error, calculateSavings }}>
      {children}
    </SavingsContext.Provider>
  );
}

export const useSavings = () => useContext(SavingsContext);

function getDateRangeForInterval(interval) {
  const now = new Date();
  let startDate, endDate = now;

  switch (interval) {
    case 'day':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
}
```

### Phase 2: Welcome Popup & Notifications (Requirements 3-4)

**Welcome Popup Component**

```typescript
// client/src/components/WelcomePopup.jsx
import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import Confetti from 'react-confetti';
import { useSavings } from '../context/SavingsContext';

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { savings } = useSavings();

  useEffect(() => {
    // Show popup on app launch
    const hasSeenToday = localStorage.getItem('welcome_popup_date') === new Date().toDateString();

    if (!hasSeenToday && savings) {
      setIsOpen(true);
      localStorage.setItem('welcome_popup_date', new Date().toDateString());

      // Check for milestones
      if (checkMilestoneAchieved(savings.totalSavings)) {
        setShowConfetti(true);
      }

      // Auto-dismiss after 5 seconds
      setTimeout(() => setIsOpen(false), 5000);
    }
  }, [savings]);

  const getMessage = () => {
    if (savings.totalSavings > 0) {
      return {
        title: 'Great Job! 🎉',
        message: `You've saved ₹${savings.totalSavings.toLocaleString()} this week!`,
        type: 'positive'
      };
    } else {
      return {
        title: 'Keep Going! 💪',
        message: "Every journey starts with a single step. You've got this!",
        type: 'supportive'
      };
    }
  };

  const message = getMessage();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <DialogContent>
        <h2 className="text-2xl font-bold">{message.title}</h2>
        <p className="text-lg">{message.message}</p>
        {savings.mostImprovedCategory && (
          <p className="text-sm text-muted-foreground">
            Most improved: {savings.mostImprovedCategory.name}
          </p>
        )}
        <button onClick={() => setIsOpen(false)}>Dismiss</button>
      </DialogContent>
    </Dialog>
  );
}
```

**Push Notifications with Capacitor**

```typescript
// client/src/services/notificationService.ts
import { LocalNotifications } from "@capacitor/local-notifications";

export class NotificationService {
  static async requestPermissions() {
    const result = await LocalNotifications.requestPermissions();
    return result.display === "granted";
  }

  static async scheduleDailySummary(userId: number) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: "Daily Savings Summary",
          body: "Check out your savings progress today!",
          schedule: {
            on: {
              hour: 20,
              minute: 0,
            },
            repeats: true,
          },
        },
      ],
    });
  }

  static async sendMilestoneNotification(amount: number) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now(),
          title: "🎉 Milestone Achieved!",
          body: `Congratulations! You've saved ₹${amount.toLocaleString()}!`,
          schedule: { at: new Date(Date.now() + 1000) },
        },
      ],
    });
  }
}
```

### Phase 3: Visualizations & Charts (Requirement 5)

**Savings Dashboard with Charts**

```typescript
// client/src/pages/SavingsDashboard.jsx
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer } from 'recharts';
import { useSavings } from '../context/SavingsContext';

export function SavingsDashboard() {
  const [interval, setInterval] = useState('month');
  const { savings, calculateSavings, loading } = useSavings();

  useEffect(() => {
    calculateSavings(interval);
  }, [interval]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Interval Selector */}
      <div className="flex gap-2">
        {['day', 'week', 'month', 'quarter', 'year'].map(i => (
          <button
            key={i}
            onClick={() => setInterval(i)}
            className={interval === i ? 'active' : ''}
          >
            {i}
          </button>
        ))}
      </div>

      {/* Total Savings Card */}
      <div className="card">
        <h2>Total Savings</h2>
        <p className="text-4xl font-bold">
          ₹{savings?.totalSavings.toLocaleString()}
        </p>
      </div>

      {/* Category Breakdown Pie Chart */}
      <div className="card">
        <h3>Category Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={savings?.categoryBreakdown}
              dataKey="savedAmount"
              nameKey="categoryName"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Progress Bars */}
      <div className="card">
        <h3>Category Progress</h3>
        {savings?.categoryBreakdown.map(cat => (
          <div key={cat.categoryId} className="mb-4">
            <div className="flex justify-between mb-1">
              <span>{cat.categoryName}</span>
              <span>{cat.savingsPercentage.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(cat.savingsPercentage, 100)}%`,
                  backgroundColor: cat.categoryColor
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Phase 4: Gamification (Requirements 6-7)

**Streak Tracking**

```javascript
// server/src/services/streakService.js
async function updateStreak(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if user stayed under budget today
  const isUnderBudget = await checkUnderBudget(userId, today);

  const streak = await prisma.savingsStreak.findUnique({
    where: { userId },
  });

  if (!streak) {
    // Create initial streak
    return await prisma.savingsStreak.create({
      data: {
        userId,
        currentStreak: isUnderBudget ? 1 : 0,
        longestStreak: isUnderBudget ? 1 : 0,
        lastUpdated: today,
        streakStartDate: today,
      },
    });
  }

  const lastUpdate = new Date(streak.lastUpdated);
  lastUpdate.setHours(0, 0, 0, 0);

  // Check if this is a new day
  if (today.getTime() === lastUpdate.getTime()) {
    return streak; // Already updated today
  }

  if (isUnderBudget) {
    // Increment streak
    const newStreak = streak.currentStreak + 1;
    const newLongest = Math.max(newStreak, streak.longestStreak);

    // Check for milestone notifications
    if ([7, 30, 60, 90].includes(newStreak)) {
      await sendStreakMilestoneNotification(userId, newStreak);
    }

    return await prisma.savingsStreak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastUpdated: today,
      },
    });
  } else {
    // Reset streak
    return await prisma.savingsStreak.update({
      where: { userId },
      data: {
        currentStreak: 0,
        lastUpdated: today,
        streakStartDate: today,
      },
    });
  }
}

async function checkUnderBudget(userId, date) {
  const categories = await prisma.category.findMany({
    where: { userId, budget: { not: null } },
  });

  for (const category of categories) {
    const spent = await prisma.expense.aggregate({
      where: {
        userId,
        categoryId: category.id,
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), 1),
          lte: date,
        },
      },
      _sum: { amount: true },
    });

    if (spent._sum.amount > category.budget) {
      return false; // Over budget in at least one category
    }
  }

  return true; // Under budget in all categories
}
```

**Achievement System**

```javascript
// server/src/services/achievementService.js
const MILESTONES = [
  {
    threshold: 500,
    name: "First ₹500 Saved",
    icon: "Trophy",
    color: "#10b981",
  },
  {
    threshold: 1000,
    name: "First ₹1000 Saved",
    icon: "Award",
    color: "#3b82f6",
  },
  {
    threshold: 5000,
    name: "First ₹5000 Saved",
    icon: "Star",
    color: "#8b5cf6",
  },
  {
    threshold: 10000,
    name: "First ₹10000 Saved",
    icon: "Crown",
    color: "#f59e0b",
  },
  {
    threshold: 50000,
    name: "First ₹50000 Saved",
    icon: "Gem",
    color: "#ec4899",
  },
  {
    threshold: 100000,
    name: "First ₹100000 Saved",
    icon: "Sparkles",
    color: "#ef4444",
  },
];

async function checkAndAwardMilestones(userId, totalSavings) {
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
  });

  const earnedThresholds = new Set(
    userAchievements.map((ua) => ua.achievement.threshold),
  );

  for (const milestone of MILESTONES) {
    if (
      totalSavings >= milestone.threshold &&
      !earnedThresholds.has(milestone.threshold)
    ) {
      // Create achievement if it doesn't exist
      let achievement = await prisma.achievement.findUnique({
        where: { name: milestone.name },
      });

      if (!achievement) {
        achievement = await prisma.achievement.create({
          data: {
            name: milestone.name,
            description: `Save ₹${milestone.threshold.toLocaleString()}`,
            type: "MILESTONE",
            threshold: milestone.threshold,
            icon: milestone.icon,
            color: milestone.color,
          },
        });
      }

      // Award to user
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      });

      // Send notification
      await sendMilestoneNotification(userId, milestone);
    }
  }
}
```

### Phase 5: Virtual Jars & Challenges (Requirements 8, 11)

**Virtual Jar API**

```javascript
// server/src/routes/jars.js
router.post("/jars", async (req, res) => {
  const { name, targetAmount, targetDate, color, icon } = req.body;
  const userId = req.dbUser.id;

  // Validation
  if (!name || !targetAmount || targetAmount <= 0) {
    return res.status(400).json({ error: "Invalid jar data" });
  }

  try {
    const jar = await prisma.virtualJar.create({
      data: {
        userId,
        name,
        targetAmount,
        targetDate: targetDate ? new Date(targetDate) : null,
        color: color || "#10b981",
        icon: icon || "PiggyBank",
      },
    });

    res.json(jar);
  } catch (error) {
    console.error("Jar creation error:", error);
    res.status(500).json({ error: "Failed to create jar" });
  }
});

router.post("/jars/:id/allocate", async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const userId = req.dbUser.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    // Update jar
    const jar = await prisma.virtualJar.update({
      where: { id: parseInt(id), userId },
      data: {
        currentAmount: {
          increment: amount,
        },
      },
    });

    // Record transaction
    await prisma.jarTransaction.create({
      data: {
        jarId: jar.id,
        amount,
        type: "DEPOSIT",
      },
    });

    // Check if goal reached
    if (jar.currentAmount >= jar.targetAmount) {
      await triggerJarGoalCompletion(userId, jar);
    }

    res.json(jar);
  } catch (error) {
    console.error("Allocation error:", error);
    res.status(500).json({ error: "Failed to allocate funds" });
  }
});
```

### Phase 6: Auto-Save Rules (Requirement 12)

**Auto-Save Engine**

```javascript
// server/src/services/autoSaveService.js
async function processAutoSaveRules(userId, expense) {
  const rules = await prisma.autoSaveRule.findMany({
    where: { userId, isActive: true },
  });

  for (const rule of rules) {
    let saveAmount = 0;

    switch (rule.type) {
      case "ROUND_UP_10":
        saveAmount = Math.ceil(expense.amount / 10) * 10 - expense.amount;
        break;
      case "ROUND_UP_50":
        saveAmount = Math.ceil(expense.amount / 50) * 50 - expense.amount;
        break;
      case "ROUND_UP_100":
        saveAmount = Math.ceil(expense.amount / 100) * 100 - expense.amount;
        break;
      case "PERCENTAGE":
        saveAmount = (expense.amount * rule.value) / 100;
        break;
      case "FIXED_DAILY":
      case "FIXED_WEEKLY":
        saveAmount = rule.value;
        break;
    }

    // Check limits
    if (rule.maxDaily || rule.maxMonthly) {
      const canSave = await checkAutoSaveLimits(userId, rule, saveAmount);
      if (!canSave) continue;
    }

    // Allocate to jar
    if (rule.targetJarId) {
      await prisma.virtualJar.update({
        where: { id: rule.targetJarId },
        data: {
          currentAmount: { increment: saveAmount },
        },
      });

      await prisma.jarTransaction.create({
        data: {
          jarId: rule.targetJarId,
          amount: saveAmount,
          type: "DEPOSIT",
          description: `Auto-save: ${rule.name}`,
        },
      });
    }
  }
}
```

### Integration with Existing App

**App.jsx Updates**

```typescript
// client/src/App.jsx
import { SavingsProvider } from './context/SavingsContext';
import { WelcomePopup } from './components/WelcomePopup';

function App() {
  return (
    <SavingsProvider>
      <DataProvider>
        <Router>
          <WelcomePopup />
          {/* Existing routes */}
        </Router>
      </DataProvider>
    </SavingsProvider>
  );
}
```

**Navigation Updates**

```typescript
// Add new navigation items
const navItems = [
  // ... existing items
  { path: "/savings", icon: "TrendingUp", label: "Savings" },
  { path: "/jars", icon: "Archive", label: "Goals" },
  { path: "/achievements", icon: "Award", label: "Achievements" },
];
```

## Technical Specifications

### Performance Optimization

#### Caching Strategy

**Client-Side Caching**

```typescript
class SavingsCache {
  private static CACHE_KEY = "savings_cache";
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static get(): SavingsMetrics | null {
    const cached = localStorage.getItem(this.CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age > this.CACHE_DURATION) {
      this.clear();
      return null;
    }

    return data;
  }

  static set(data: SavingsMetrics): void {
    localStorage.setItem(
      this.CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      }),
    );
  }

  static clear(): void {
    localStorage.removeItem(this.CACHE_KEY);
  }
}
```

**Server-Side Query Optimization**

```javascript
// Use database indexes for fast queries
// Already defined in schema:
// @@index([userId, status])
// @@index([userId, createdAt])

// Batch queries to reduce round trips
async function getSavingsDashboardData(userId, interval) {
  const [expenses, categories, achievements, streaks, jars] = await Promise.all(
    [
      prisma.expense.findMany({
        where: { userId },
        include: { category: true },
      }),
      prisma.category.findMany({ where: { userId } }),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
      }),
      prisma.savingsStreak.findUnique({ where: { userId } }),
      prisma.virtualJar.findMany({ where: { userId, status: "ACTIVE" } }),
    ],
  );

  return { expenses, categories, achievements, streaks, jars };
}
```

#### Lazy Loading

```typescript
// Lazy load heavy components
const SavingsTimeline = lazy(() => import('./components/SavingsTimeline'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));

function SavingsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SavingsTimeline />
    </Suspense>
  );
}
```

#### Debouncing and Throttling

```typescript
// Debounce expensive calculations
import { debounce } from "lodash";

const debouncedCalculate = debounce(async (interval) => {
  await calculateSavings(interval);
}, 300);

// Throttle chart updates
import { throttle } from "lodash";

const throttledChartUpdate = throttle((data) => {
  updateChartData(data);
}, 100);
```

### Security Considerations

#### Input Validation

```typescript
// Validate all user inputs
function validateJarInput(input: Partial<VirtualJar>): ValidationResult {
  const errors: string[] = [];

  // Name validation
  if (!input.name || input.name.trim().length === 0) {
    errors.push("Name is required");
  }
  if (input.name && input.name.length > 100) {
    errors.push("Name must be less than 100 characters");
  }

  // Amount validation
  if (!input.targetAmount || input.targetAmount <= 0) {
    errors.push("Target amount must be greater than zero");
  }
  if (input.targetAmount && input.targetAmount > 10000000) {
    errors.push("Target amount is too large");
  }

  // Date validation
  if (input.targetDate) {
    const date = new Date(input.targetDate);
    if (isNaN(date.getTime())) {
      errors.push("Invalid date format");
    }
    if (date < new Date()) {
      errors.push("Target date cannot be in the past");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

#### Authorization

```javascript
// Ensure users can only access their own data
async function getVirtualJar(jarId, userId) {
  const jar = await prisma.virtualJar.findFirst({
    where: {
      id: jarId,
      userId: userId, // Critical: filter by userId
    },
  });

  if (!jar) {
    throw new Error("Jar not found or access denied");
  }

  return jar;
}
```

#### Rate Limiting

```javascript
// Prevent abuse of expensive operations
const rateLimit = require("express-rate-limit");

const savingsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later",
});

app.use("/api/savings", savingsLimiter);
```

### Accessibility

#### ARIA Labels

```typescript
// Proper ARIA labels for screen readers
<button
  onClick={handleDismiss}
  aria-label="Dismiss welcome popup"
  aria-describedby="popup-message"
>
  <X aria-hidden="true" />
</button>

<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`${categoryName} savings progress: ${progress}%`}
>
  <div className="progress-fill" style={{ width: `${progress}%` }} />
</div>
```

#### Keyboard Navigation

```typescript
// Support keyboard navigation
function WelcomePopup({ onDismiss }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  return (
    <Dialog>
      <DialogContent>
        {/* Content */}
        <button
          onClick={onDismiss}
          onKeyDown={(e) => e.key === 'Enter' && onDismiss()}
          tabIndex={0}
        >
          Dismiss
        </button>
      </DialogContent>
    </Dialog>
  );
}
```

#### Color Contrast

```css
/* Ensure WCAG AA compliance (4.5:1 contrast ratio) */
.savings-positive {
  color: #059669; /* Dark green on white: 4.54:1 */
}

.savings-negative {
  color: #dc2626; /* Dark red on white: 5.14:1 */
}

.savings-neutral {
  color: #6b7280; /* Gray on white: 4.61:1 */
}
```

### Monitoring and Analytics

#### Error Tracking

```typescript
// Log errors for debugging
class ErrorLogger {
  static log(error: Error, context: any) {
    console.error("Error:", error);
    console.error("Context:", context);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === "production") {
      // Sentry, LogRocket, etc.
    }
  }
}

// Usage
try {
  await calculateSavings(interval);
} catch (error) {
  ErrorLogger.log(error, { interval, userId });
  toast.error("Failed to calculate savings");
}
```

#### Performance Monitoring

```typescript
// Track performance metrics
class PerformanceMonitor {
  static measure(name: string, fn: () => Promise<any>) {
    const start = performance.now();

    return fn().finally(() => {
      const duration = performance.now() - start;
      console.log(`${name} took ${duration.toFixed(2)}ms`);

      // Alert if exceeds threshold
      if (duration > 1000) {
        console.warn(`${name} exceeded 1s threshold`);
      }
    });
  }
}

// Usage
await PerformanceMonitor.measure("calculateSavings", () =>
  calculateSavings(interval),
);
```

### Database Optimization

#### Indexes

```sql
-- Critical indexes for performance
CREATE INDEX "Expense_userId_date_idx" ON "Expense"("userId", "date");
CREATE INDEX "Expense_categoryId_date_idx" ON "Expense"("categoryId", "date");
CREATE INDEX "Category_userId_budget_idx" ON "Category"("userId", "budget");
CREATE INDEX "VirtualJar_userId_status_idx" ON "VirtualJar"("userId", "status");
CREATE INDEX "UserAchievement_userId_earnedAt_idx" ON "UserAchievement"("userId", "earnedAt");
```

#### Query Optimization

```javascript
// Use select to fetch only needed fields
const jars = await prisma.virtualJar.findMany({
  where: { userId, status: "ACTIVE" },
  select: {
    id: true,
    name: true,
    currentAmount: true,
    targetAmount: true,
    color: true,
    icon: true,
    // Exclude unnecessary fields like createdAt, updatedAt
  },
});

// Use aggregation for calculations
const totalSaved = await prisma.jarTransaction.aggregate({
  where: {
    jar: { userId },
    type: "DEPOSIT",
  },
  _sum: { amount: true },
});
```

### Deployment Considerations

#### Environment Variables

```bash
# .env.example
DATABASE_URL="postgresql://user:password@localhost:5432/moneymanager"
DIRECT_URL="postgresql://user:password@localhost:5432/moneymanager"
GROQ_API_KEY="your_groq_api_key"
NODE_ENV="production"

# Notification settings
NOTIFICATION_DAILY_HOUR=20
NOTIFICATION_WEEKLY_DAY=0  # Sunday
```

#### Database Migrations

```bash
# Create migration for new tables
npx prisma migrate dev --name add_savings_system

# Apply migrations in production
npx prisma migrate deploy
```

#### Seed Data

```javascript
// prisma/seed.js - Add default achievements
const achievements = [
  {
    name: "First ₹500 Saved",
    threshold: 500,
    type: "MILESTONE",
    icon: "Trophy",
    color: "#10b981",
  },
  {
    name: "First ₹1000 Saved",
    threshold: 1000,
    type: "MILESTONE",
    icon: "Award",
    color: "#3b82f6",
  },
  // ... more achievements
];

for (const achievement of achievements) {
  await prisma.achievement.upsert({
    where: { name: achievement.name },
    update: {},
    create: achievement,
  });
}
```

### Mobile-Specific Considerations

#### Capacitor Plugins

```json
// capacitor.config.json
{
  "appId": "com.moneymanager.app",
  "appName": "Money Manager",
  "plugins": {
    "LocalNotifications": {
      "smallIcon": "ic_stat_icon_config_sample",
      "iconColor": "#488AFF",
      "sound": "beep.wav"
    },
    "Haptics": {
      "enabled": true
    }
  }
}
```

#### Haptic Feedback

```typescript
import { Haptics, ImpactStyle } from "@capacitor/haptics";

// Provide haptic feedback for achievements
async function celebrateAchievement() {
  await Haptics.impact({ style: ImpactStyle.Heavy });
  // Show confetti animation
}

// Light feedback for interactions
async function handleJarAllocation() {
  await Haptics.impact({ style: ImpactStyle.Light });
  // Update UI
}
```

#### Offline Support

```typescript
// Service Worker for offline caching
// public/service-worker.js
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}
```

### Scalability

#### Background Jobs

```javascript
// Use a job queue for scheduled tasks
const cron = require("node-cron");

// Daily streak updates at midnight
cron.schedule("0 0 * * *", async () => {
  const users = await prisma.user.findMany();
  for (const user of users) {
    await updateStreak(user.id);
  }
});

// Weekly summary notifications on Sunday at 8 PM
cron.schedule("0 20 * * 0", async () => {
  const users = await prisma.user.findMany({
    include: { settings: true },
  });

  for (const user of users) {
    if (user.settings?.enableNotifications) {
      await sendWeeklySummary(user.id);
    }
  }
});
```

#### Data Archival

```javascript
// Archive old data to keep database performant
async function archiveOldData() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Archive completed jars
  await prisma.virtualJar.updateMany({
    where: {
      status: "COMPLETED",
      updatedAt: { lt: sixMonthsAgo },
    },
    data: { status: "ARCHIVED" },
  });

  // Archive old notifications
  await prisma.savingsNotification.deleteMany({
    where: {
      createdAt: { lt: sixMonthsAgo },
      isRead: true,
    },
  });
}
```

## Summary

The Savings Celebration System is a comprehensive feature that transforms the Money Manager app into a motivational savings companion. The design emphasizes:

1. **Performance**: All calculations complete within 1 second, UI updates within 500ms
2. **User Experience**: Positive reinforcement through celebrations, gamification, and personalized insights
3. **Scalability**: Efficient database queries, caching, and background job processing
4. **Reliability**: Comprehensive error handling, offline support, and graceful degradation
5. **Testability**: 54 correctness properties with property-based testing, plus extensive unit tests

The implementation follows a phased approach:

- Phase 1: Core savings calculation and tracking
- Phase 2: Welcome popup and notifications
- Phase 3: Visualizations and charts
- Phase 4: Gamification (streaks and achievements)
- Phase 5: Virtual jars and challenges
- Phase 6: Auto-save rules and advanced features

Each phase builds upon the previous, allowing for incremental delivery and testing. The system integrates seamlessly with the existing Money Manager app architecture while maintaining separation of concerns through dedicated contexts, services, and database models.
