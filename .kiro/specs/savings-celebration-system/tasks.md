# Implementation Plan: Savings Celebration System

## Overview

This implementation plan breaks down the Savings Celebration System into 6 phases following the design document structure. Each phase builds incrementally on the previous, with property-based tests and unit tests integrated as sub-tasks. The system transforms the Money Manager app from a passive expense tracker into an active savings motivator through gamification, visualizations, and positive reinforcement.

## Tasks

- [ ] 1. Phase 1: Core Savings Calculation and Tracking
  - [x] 1.1 Extend database schema with budget column for categories
    - Add migration to add `budget` column to Category table
    - Add database index for `userId` and `budget` columns
    - Run migration and verify schema changes
    - _Requirements: 1.1_

  - [x] 1.2 Create savings calculation API endpoint
    - Implement GET `/api/savings/calculate` endpoint in Express
    - Add query parameter handling for interval, startDate, endDate
    - Fetch expenses and categories with budgets from database
    - Implement `calculateSavingsFromData` function for aggregation
    - Return totalSavings and categoryBreakdown in response
    - _Requirements: 1.2, 1.3, 1.4, 2.3, 2.4_

  - [ ]\* 1.3 Write property tests for savings calculation
    - **Property 1: Budget Storage Integrity** - Budget retrieval returns exact stored value
    - **Property 2: Expense Aggregation Accuracy** - Total spent equals sum of expenses
    - **Property 3: Savings Calculation Correctness** - Savings equals budget minus spending
    - **Property 4: Category Savings Summation** - Sum of category savings equals total
    - **Property 5: Budget Filter Exclusion** - Categories without budgets excluded
    - **Validates: Requirements 1.1, 1.2, 1.3, 2.3, 2.4**

  - [ ]\* 1.4 Write unit tests for savings calculation edge cases
    - Test zero budget handling
    - Test negative savings (overspending)
    - Test null/undefined budget values
    - Test empty expense arrays
    - Test calculation performance (< 1 second requirement)
    - _Requirements: 1.4, 1.5_

  - [x] 1.5 Create SavingsContext provider for frontend state management
    - Create `client/src/context/SavingsContext.jsx` file
    - Implement context with savings state, loading, and error states
    - Implement `calculateSavings` function with API integration
    - Add localStorage caching for offline support
    - Implement `getDateRangeForInterval` helper function
    - Export `useSavings` hook for component consumption
    - _Requirements: 1.5, 2.1, 2.2_

  - [ ]\* 1.6 Write unit tests for SavingsContext
    - Test API call success and data caching
    - Test offline mode with cached data
    - Test error handling and fallback behavior
    - Test date range calculation for all intervals
    - _Requirements: 2.1, 2.2_

  - [x] 1.7 Integrate SavingsProvider into App.jsx
    - Wrap existing app with SavingsProvider
    - Ensure proper context nesting with DataProvider
    - Verify context is accessible throughout app
    - _Requirements: 1.5_

- [ ] 2. Checkpoint - Verify core savings calculation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Phase 2: Welcome Popup and Notifications
  - [x] 3.1 Create WelcomePopup component
    - Create `client/src/components/WelcomePopup.jsx` file
    - Implement modal dialog using existing Dialog components
    - Add confetti animation integration using react-confetti
    - Implement message generation logic (positive/supportive/milestone)
    - Add auto-dismiss timer (5 seconds)
    - Add localStorage check to show once per day
    - Implement dismiss button with keyboard support
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ]\* 3.2 Write unit tests for WelcomePopup
    - Test positive message display when savings > 0
    - Test supportive message display when savings <= 0
    - Test confetti animation trigger on milestones
    - Test auto-dismiss after 5 seconds
    - Test manual dismiss button functionality
    - Test once-per-day display logic
    - Test keyboard navigation (Escape key)
    - _Requirements: 3.4, 3.5, 3.6, 3.7_

  - [ ]\* 3.3 Write property tests for welcome popup logic
    - **Property 6: Most Improved Category Identification** - Largest positive change selected
    - **Validates: Requirements 3.3**

  - [x] 3.4 Create notification service with Capacitor integration
    - Create `client/src/services/notificationService.ts` file
    - Implement permission request using LocalNotifications API
    - Implement `scheduleDailySummary` function
    - Implement `sendMilestoneNotification` function
    - Implement `sendStreakNotification` function
    - Add notification preference checking
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ]\* 3.5 Write property tests for notification system
    - **Property 7: Streak Notification Triggering** - Notification created on streak completion
    - **Property 8: Notification Suppression When Disabled** - No notifications when disabled
    - **Validates: Requirements 4.4, 4.7**

  - [ ]\* 3.6 Write unit tests for notification service
    - Test permission request flow
    - Test daily summary scheduling
    - Test milestone notification sending
    - Test notification suppression when disabled
    - Test system permission respect
    - _Requirements: 4.5, 4.6, 4.7_

  - [x] 3.7 Create backend notification endpoints
    - Implement POST `/api/savings/notifications` endpoint
    - Implement GET `/api/savings/notifications` endpoint
    - Add SavingsNotification model queries
    - Implement notification preference checking
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 4. Checkpoint - Verify welcome popup and notifications
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Phase 3: Visualizations and Dashboard
  - [x] 5.1 Create SavingsDashboard component structure
    - Create `client/src/pages/SavingsDashboard.jsx` file
    - Implement time interval selector (day/week/month/quarter/year)
    - Add total savings card display
    - Integrate useSavings hook for data fetching
    - Add loading and error states
    - _Requirements: 2.1, 2.2, 2.5_

  - [x] 5.2 Implement savings trend line chart
    - Install and configure Recharts library
    - Create LineChart component for savings trends
    - Implement data transformation for chart format
    - Add responsive container for mobile support
    - Add tooltip with detailed information
    - _Requirements: 5.1, 5.4_

  - [x] 5.3 Implement category breakdown pie chart
    - Create PieChart component for category distribution
    - Use category colors consistently
    - Add labels with category names and amounts
    - Implement tap/click handler for detailed view
    - _Requirements: 5.2, 5.4, 5.6_

  - [x] 5.4 Implement category progress bars
    - Create progress bar components for each category
    - Display category icon, name, and savings percentage
    - Use category colors for visual consistency
    - Add animation for progress bar filling
    - _Requirements: 5.3, 5.6_

  - [ ]\* 5.5 Write property tests for visualization calculations
    - **Property 9: Progress Percentage Calculation** - Progress equals (saved/budget) \* 100
    - **Property 10: Category Color Consistency** - Same color across all visualizations
    - **Validates: Requirements 5.3, 5.6**

  - [ ]\* 5.6 Write unit tests for dashboard components
    - Test interval selector functionality
    - Test chart rendering with sample data
    - Test empty state handling
    - Test loading state display
    - Test chart update performance (< 500ms requirement)
    - Test responsive behavior
    - _Requirements: 2.2, 5.5_

  - [x] 5.7 Add navigation route for savings dashboard
    - Add `/savings` route to router configuration
    - Add navigation item with TrendingUp icon
    - Update navigation menu in App.jsx
    - _Requirements: 2.1_

- [ ] 6. Checkpoint - Verify dashboard and visualizations
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Phase 4: Gamification - Streaks and Achievements
  - [x] 7.1 Create database models for gamification
    - Add SavingsStreak model to Prisma schema
    - Add Achievement model to Prisma schema
    - Add UserAchievement model to Prisma schema
    - Create and run database migration
    - Add database indexes for performance
    - _Requirements: 6.1, 6.3, 6.4, 7.1, 7.4_

  - [x] 7.2 Implement streak tracking service
    - Create `server/src/services/streakService.js` file
    - Implement `updateStreak` function with daily check
    - Implement `checkUnderBudget` function for validation
    - Add streak increment logic
    - Add streak reset logic on overspending
    - Add longest streak tracking
    - Implement milestone notification triggers (7, 30, 60, 90 days)
    - _Requirements: 6.1, 6.2, 6.4, 6.5_

  - [ ]\* 7.3 Write property tests for streak logic
    - **Property 11: Streak Increment Logic** - Streak increments by one on success
    - **Property 12: Streak Reset on Overspending** - Streak resets to zero on budget exceed
    - **Property 13: Longest Streak Invariant** - Longest >= current always
    - **Validates: Requirements 6.1, 6.2, 6.4**

  - [ ]\* 7.4 Write unit tests for streak service
    - Test streak creation for new users
    - Test streak increment on under-budget day
    - Test streak reset on over-budget day
    - Test longest streak update
    - Test milestone notification triggering
    - Test same-day update prevention
    - _Requirements: 6.1, 6.2, 6.5_

  - [x] 7.5 Implement achievement system service
    - Create `server/src/services/achievementService.js` file
    - Define milestone thresholds (₹500, ₹1000, ₹5000, ₹10000, ₹50000, ₹100000)
    - Implement `checkAndAwardMilestones` function
    - Add duplicate badge prevention logic
    - Implement achievement notification sending
    - Add category-specific achievement tracking
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [ ]\* 7.6 Write property tests for achievement system
    - **Property 14: Milestone Badge Award** - Badge awarded when threshold crossed
    - **Property 15: Category Badge Award** - Category badge for consistent savings
    - **Property 16: Milestone Progress Calculation** - Progress equals (current/next) \* 100
    - **Validates: Requirements 7.1, 7.3, 7.7**

  - [ ]\* 7.7 Write unit tests for achievement system
    - Test badge award at each milestone threshold
    - Test duplicate badge prevention
    - Test category-specific badge awards
    - Test achievement notification sending
    - Test progress calculation toward next milestone
    - _Requirements: 7.1, 7.2, 7.3, 7.5, 7.7_

  - [x] 7.8 Create streak and achievement display components
    - Create StreakDisplay component showing current and longest streak
    - Create AchievementBadge component with icon and color
    - Create AchievementsGrid component for badge display
    - Add celebration animation on badge earn
    - Add social sharing functionality
    - _Requirements: 6.3, 6.6, 7.4, 7.6_

  - [x] 7.9 Create achievement API endpoints
    - Implement GET `/api/savings/achievements` endpoint
    - Implement GET `/api/savings/streaks` endpoint
    - Add user-specific filtering
    - Return achievement progress data
    - _Requirements: 6.3, 6.6, 7.4, 7.7_

- [x] 8. Checkpoint - Verify gamification features
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Phase 5: Virtual Jars and Challenges
  - [ ] 9.1 Create database models for jars and challenges
    - Add VirtualJar model to Prisma schema
    - Add JarTransaction model to Prisma schema
    - Add SavingsChallenge model to Prisma schema
    - Create and run database migration
    - Add database indexes for queries
    - _Requirements: 8.1, 8.2, 11.1, 11.2_

  - [ ] 9.2 Implement virtual jar API endpoints
    - Create `server/src/routes/jars.js` file
    - Implement POST `/api/savings/jars` endpoint for creation
    - Implement GET `/api/savings/jars` endpoint for listing
    - Implement PUT `/api/savings/jars/:id` endpoint for updates
    - Implement POST `/api/savings/jars/:id/allocate` endpoint
    - Implement POST `/api/savings/jars/:id/withdraw` endpoint
    - Implement DELETE `/api/savings/jars/:id` endpoint
    - Add input validation for all endpoints
    - _Requirements: 8.1, 8.2, 8.4, 8.8_

  - [ ]\* 9.3 Write property tests for jar operations
    - **Property 17: Jar Creation Validation** - Reject creation without required fields
    - **Property 18: Jar Allocation Effect** - Current amount increases by allocated amount
    - **Property 19: Jar Progress Calculation** - Progress equals (current/target) \* 100
    - **Property 20: Jar Goal Completion Trigger** - Celebration when current >= target
    - **Property 21: Jar Withdrawal Effect** - Current amount decreases by withdrawal amount
    - **Validates: Requirements 8.2, 8.4, 8.5, 8.7, 8.8**

  - [ ]\* 9.4 Write unit tests for jar API
    - Test jar creation with valid data
    - Test jar creation validation errors
    - Test fund allocation
    - Test fund withdrawal
    - Test jar deletion
    - Test goal completion detection
    - Test transaction recording
    - _Requirements: 8.1, 8.2, 8.4, 8.7, 8.8_

  - [ ] 9.5 Create VirtualJar frontend component
    - Create `client/src/components/VirtualJar.jsx` file
    - Implement jar card with visual representation
    - Add animated filling effect as funds increase
    - Display progress percentage and amounts
    - Add allocate and withdraw buttons
    - Add edit and delete functionality
    - Implement goal completion celebration animation
    - _Requirements: 8.3, 8.5, 8.6, 8.7_

  - [ ] 9.6 Create jar management page
    - Create `client/src/pages/JarsPage.jsx` file
    - Display grid of all user jars
    - Add "Create New Jar" button and modal
    - Implement jar creation form with validation
    - Add color and icon picker for customization
    - Add navigation route `/jars`
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ] 9.7 Implement savings challenge system
    - Create `server/src/routes/challenges.js` file
    - Implement POST `/api/savings/challenges` endpoint
    - Implement GET `/api/savings/challenges` endpoint
    - Implement PUT `/api/savings/challenges/:id` endpoint
    - Implement DELETE `/api/savings/challenges/:id` endpoint
    - Add challenge progress tracking logic
    - Add challenge completion/failure detection
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ]\* 9.8 Write property tests for challenges
    - **Property 28: Challenge Creation Validation** - Reject without required fields
    - **Property 29: Challenge Progress Tracking** - Progress equals sum of savings in period
    - **Property 30: Challenge Completion Badge** - Badge awarded on completion
    - **Validates: Requirements 11.3, 11.4, 11.6**

  - [ ]\* 9.9 Write unit tests for challenge system
    - Test challenge creation with validation
    - Test progress tracking calculation
    - Test completion detection
    - Test failure detection
    - Test badge award on completion
    - Test encouraging message on failure
    - _Requirements: 11.3, 11.4, 11.6, 11.7_

  - [ ] 9.10 Create ChallengeCard frontend component
    - Create `client/src/components/ChallengeCard.jsx` file
    - Display challenge details and progress
    - Add progress bar with percentage
    - Show time remaining until end date
    - Add completion/failure status indicators
    - Display reward information
    - _Requirements: 11.5, 11.6, 11.7_

  - [ ] 9.11 Integrate challenges into dashboard
    - Add active challenges section to SavingsDashboard
    - Add "Create Challenge" button and modal
    - Implement challenge creation form
    - Add challenge filtering (active/completed/failed)
    - _Requirements: 11.1, 11.2, 11.5_

- [ ] 10. Checkpoint - Verify jars and challenges
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Phase 6: Advanced Features - Auto-Save, Analytics, and Insights
  - [ ] 11.1 Create database models for advanced features
    - Add AutoSaveRule model to Prisma schema
    - Add SavingsSnapshot model for historical tracking
    - Create and run database migration
    - Add database indexes for performance
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ] 11.2 Implement auto-save rules engine
    - Create `server/src/services/autoSaveService.js` file
    - Implement `processAutoSaveRules` function
    - Add round-up calculation logic (₹10, ₹50, ₹100)
    - Add percentage-based calculation logic
    - Add fixed amount scheduling logic
    - Implement daily/monthly limit checking
    - Add jar allocation on rule trigger
    - Record transactions for auto-saves
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.7_

  - [ ]\* 11.3 Write property tests for auto-save rules
    - **Property 31: Round-Up Calculation Correctness** - Saved equals ceiling - amount
    - **Property 32: Percentage-Based Auto-Save Calculation** - Saved equals amount \* percentage
    - **Property 33: Auto-Save Jar Allocation** - Jar balance increases by saved amount
    - **Property 34: Auto-Save Total Calculation** - Total equals sum of all auto-save transactions
    - **Property 35: Auto-Save Limit Enforcement** - Total not exceeding configured limits
    - **Validates: Requirements 12.1, 12.2, 12.4, 12.6, 12.7**

  - [ ]\* 11.4 Write unit tests for auto-save service
    - Test round-up calculations for each target
    - Test percentage-based calculations
    - Test fixed amount rules
    - Test daily limit enforcement
    - Test monthly limit enforcement
    - Test jar allocation
    - Test transaction recording
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.7_

  - [ ] 11.5 Create auto-save rules API endpoints
    - Implement POST `/api/savings/auto-save-rules` endpoint
    - Implement GET `/api/savings/auto-save-rules` endpoint
    - Implement PUT `/api/savings/auto-save-rules/:id` endpoint
    - Implement DELETE `/api/savings/auto-save-rules/:id` endpoint
    - Add rule validation logic
    - _Requirements: 12.5, 12.6_

  - [ ] 11.6 Create auto-save rules management UI
    - Create AutoSaveRulesPage component
    - Add rule creation form with type selection
    - Add rule enable/disable toggle
    - Display total saved through auto-save
    - Add limit configuration inputs
    - Add navigation route `/auto-save`
    - _Requirements: 12.5, 12.6, 12.7_

  - [ ] 11.7 Implement budget warning system
    - Create `server/src/services/warningService.js` file
    - Implement budget threshold checking (75%, 90%, 100%)
    - Add warning notification creation
    - Implement remaining budget calculation
    - Add user preference checking for warnings
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.6_

  - [ ]\* 11.8 Write property tests for warning system
    - **Property 36: Over-Budget Notification Trigger** - Notification when spending > budget
    - **Property 37: Remaining Budget Calculation** - Remaining equals budget - spending
    - **Property 38: Warning Suppression When Disabled** - No warnings when disabled
    - **Validates: Requirements 13.3, 13.4, 13.6**

  - [ ]\* 11.9 Write unit tests for warning system
    - Test 75% threshold warning
    - Test 90% threshold warning
    - Test over-budget warning
    - Test remaining budget display
    - Test custom threshold configuration
    - Test warning suppression
    - _Requirements: 13.1, 13.2, 13.3, 13.5, 13.6_

  - [ ] 11.10 Implement comparison analytics engine
    - Create `server/src/services/analyticsEngine.js` file
    - Implement period-over-period comparison logic
    - Add percentage change calculations
    - Implement category improvement/decline detection
    - Add total improvement summary calculation
    - Create GET `/api/savings/analytics/comparison` endpoint
    - _Requirements: 9.1, 9.2, 9.3, 9.6_

  - [ ]\* 11.11 Write property tests for comparison analytics
    - **Property 22: Percentage Change Calculation** - Change equals ((current - previous) / previous) \* 100
    - **Property 23: Total Change Aggregation** - Total equals sum of category changes
    - **Validates: Requirements 9.3, 9.6**

  - [ ]\* 11.12 Write unit tests for comparison analytics
    - Test month-over-month comparison
    - Test week-over-week comparison
    - Test percentage change calculation
    - Test improvement highlighting
    - Test decline highlighting
    - Test custom date range comparison
    - _Requirements: 9.1, 9.2, 9.4, 9.5, 9.7_

  - [ ] 11.13 Create comparison analytics UI component
    - Create ComparisonCard component
    - Display current vs previous period metrics
    - Add color-coded improvement/decline indicators
    - Show percentage changes for each category
    - Add date range selector for custom comparisons
    - Integrate into SavingsDashboard
    - _Requirements: 9.4, 9.5, 9.7_

  - [ ] 11.14 Implement predictive projections engine
    - Implement projection calculation based on trends
    - Add confidence level calculation based on variance
    - Implement monthly and yearly projections
    - Add minimum data requirement check (2 weeks)
    - Create GET `/api/savings/analytics/projections` endpoint
    - _Requirements: 10.1, 10.2, 10.3, 10.6_

  - [ ]\* 11.15 Write property tests for projections
    - **Property 24: Projection Consistency** - Same data produces same projections
    - **Property 25: Yearly Projection Relationship** - Yearly derived from monthly consistently
    - **Property 26: Confidence Level Correlation** - Higher variance = lower confidence
    - **Property 27: Projection Data Threshold** - No projections with < 2 weeks data
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.6**

  - [ ]\* 11.16 Write unit tests for projections
    - Test monthly projection calculation
    - Test yearly projection calculation
    - Test confidence level calculation
    - Test projection updates on pattern change
    - Test minimum data requirement
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.6_

  - [ ] 11.17 Create projections display component
    - Create ProjectionsCard component
    - Display monthly and yearly projections
    - Show confidence level indicator
    - Add visual trend indicators
    - Integrate into SavingsDashboard
    - _Requirements: 10.5_

  - [ ] 11.18 Implement spending pattern analyzer
    - Implement recurring expense detection
    - Add peak spending day identification
    - Implement consistent savings category detection
    - Add variable spending category detection
    - Add minimum data requirement check (4 weeks)
    - Create GET `/api/savings/analytics/patterns` endpoint
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.7_

  - [ ]\* 11.19 Write property tests for pattern analysis
    - **Property 39: Recurring Expense Identification** - Regular intervals identified
    - **Property 40: Peak Spending Day Identification** - Day with max spending identified
    - **Property 41: Consistent Savings Identification** - Lowest variance category identified
    - **Property 42: Variable Spending Identification** - Highest variance category identified
    - **Property 43: Pattern Analysis Data Threshold** - No patterns with < 4 weeks data
    - **Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.7**

  - [ ]\* 11.20 Write unit tests for pattern analyzer
    - Test recurring expense detection
    - Test peak day identification
    - Test consistent category identification
    - Test variable category identification
    - Test minimum data requirement
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.7_

  - [ ] 11.21 Implement recommendation engine
    - Create recommendation generation logic
    - Implement savings opportunity identification
    - Add budget adjustment suggestions
    - Generate actionable savings tips
    - Add minimum data requirement check (3 weeks)
    - Create GET `/api/savings/analytics/recommendations` endpoint
    - _Requirements: 14.6, 19.1, 19.2, 19.3, 19.4, 19.7_

  - [ ]\* 11.22 Write property tests for recommendations
    - **Property 51: Recommendation Category Selection** - Above-average spending categories selected
    - **Property 52: Recommendation Data Threshold** - No recommendations with < 3 weeks data
    - **Validates: Requirements 19.2, 19.7**

  - [ ]\* 11.23 Write unit tests for recommendation engine
    - Test savings opportunity identification
    - Test category selection for reduction
    - Test budget adjustment suggestions
    - Test actionable tip generation
    - Test weekly update logic
    - Test minimum data requirement
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.6, 19.7_

  - [ ] 11.24 Create insights and recommendations UI
    - Create InsightsCard component
    - Display pattern insights
    - Show recommendations with actionable tips
    - Add "Apply Recommendation" functionality
    - Integrate into SavingsDashboard
    - _Requirements: 14.5, 19.5_

- [ ] 12. Checkpoint - Verify advanced features
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Phase 7: Export, Timeline, and Polish
  - [ ] 13.1 Implement data export functionality
    - Create `server/src/services/exportService.js` file
    - Implement CSV export with category breakdown
    - Implement JSON export with full data structure
    - Add date range filtering for exports
    - Add milestone achievements to export data
    - Create GET `/api/savings/export` endpoint with format parameter
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ]\* 13.2 Write property tests for export functionality
    - **Property 44: CSV Export Round-Trip** - Parse CSV reconstructs original data
    - **Property 45: JSON Export Round-Trip** - Parse JSON reconstructs original data
    - **Property 46: Export Date Range Filtering** - Only records within range included
    - **Validates: Requirements 15.1, 15.2, 15.3**

  - [ ]\* 13.3 Write unit tests for export service
    - Test CSV format generation
    - Test JSON format generation
    - Test date range filtering
    - Test category breakdown inclusion
    - Test milestone inclusion
    - Test export performance (< 5 seconds for 1 year)
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.7_

  - [ ] 13.4 Create export UI component
    - Create ExportDialog component
    - Add format selector (CSV/JSON)
    - Add date range picker
    - Implement download functionality
    - Add share button for file sharing
    - Add export button to dashboard
    - _Requirements: 15.6_

  - [ ] 13.5 Implement savings timeline feature
    - Create GET `/api/savings/timeline` endpoint
    - Fetch all achievements, streaks, and challenges
    - Sort entries chronologically (most recent first)
    - Add achievement type filtering
    - Return formatted timeline entries
    - _Requirements: 20.1, 20.2, 20.3, 20.4_

  - [ ]\* 13.6 Write property tests for timeline
    - **Property 53: Timeline Chronological Ordering** - Entries ordered by date descending
    - **Property 54: Timeline Filter Correctness** - Filtered entries match selected type
    - **Validates: Requirements 20.1, 20.5**

  - [ ]\* 13.7 Write unit tests for timeline
    - Test chronological ordering
    - Test milestone inclusion
    - Test streak inclusion
    - Test challenge inclusion
    - Test type filtering
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

  - [ ] 13.8 Create SavingsTimeline component
    - Create `client/src/components/SavingsTimeline.jsx` file
    - Display timeline entries with icons and colors
    - Add filter buttons for achievement types
    - Implement social sharing for timeline highlights
    - Add infinite scroll or pagination
    - Create navigation route `/timeline`
    - _Requirements: 20.1, 20.5, 20.6_

  - [ ] 13.9 Implement celebration animations
    - Create AnimationEngine utility
    - Add confetti animation for milestones
    - Add success animation for jar goals
    - Add trophy animation for challenges
    - Implement 3-second animation duration
    - Add tap-to-skip functionality
    - Add animation disable setting
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_

  - [ ]\* 13.10 Write property tests for animations
    - **Property 47: Animation Suppression When Disabled** - No animations when disabled
    - **Validates: Requirements 16.6**

  - [ ]\* 13.11 Write unit tests for animations
    - Test confetti animation trigger
    - Test success animation trigger
    - Test trophy animation trigger
    - Test animation duration
    - Test skip functionality
    - Test disable setting respect
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_

  - [ ] 13.12 Implement contextual message generator
    - Create `server/src/services/messageGenerator.js` file
    - Implement relatable comparison generation (coffees, movie tickets, etc.)
    - Add message variation logic to avoid repetition
    - Implement tone adaptation based on performance
    - Use positive, encouraging language
    - Integrate with welcome popup and notifications
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6_

  - [ ]\* 13.13 Write property tests for message generation
    - **Property 48: Message Variation** - Messages vary with same input parameters
    - **Validates: Requirements 17.4**

  - [ ]\* 13.14 Write unit tests for message generator
    - Test relatable comparison generation
    - Test local context usage
    - Test message variation
    - Test positive language usage
    - Test tone adaptation
    - _Requirements: 17.1, 17.2, 17.4, 17.5, 17.6_

  - [ ] 13.15 Implement category-specific savings goals
    - Add goal tracking to Category model
    - Create goal management API endpoints
    - Implement progress calculation for category goals
    - Add goal achievement detection
    - Add celebration notification on goal achievement
    - _Requirements: 18.1, 18.2, 18.4, 18.6_

  - [ ]\* 13.16 Write property tests for category goals
    - **Property 49: Category Goal Progress Calculation** - Progress equals (current/target) \* 100
    - **Property 50: Category Goal Achievement Notification** - Notification when current >= target
    - **Validates: Requirements 18.3, 18.4**

  - [ ]\* 13.17 Write unit tests for category goals
    - Test goal creation with amount target
    - Test goal creation with percentage target
    - Test progress calculation
    - Test achievement detection
    - Test goal adjustment
    - Test historical tracking
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

  - [ ] 13.18 Create category goals UI
    - Add goal setting to category management
    - Display goal progress on dashboard
    - Add goal achievement celebration
    - Show historical goal achievements
    - _Requirements: 18.3, 18.5_

- [ ] 14. Checkpoint - Verify export, timeline, and polish features
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Phase 8: Integration, Performance, and Accessibility
  - [ ] 15.1 Integrate auto-save with expense creation
    - Hook auto-save rule processing into expense creation flow
    - Trigger `processAutoSaveRules` after each expense save
    - Display auto-save notification to user
    - Update jar balances in real-time
    - _Requirements: 12.4_

  - [ ] 15.2 Set up background jobs for scheduled tasks
    - Install and configure node-cron
    - Create daily streak update job (midnight)
    - Create weekly summary notification job (Sunday 8 PM)
    - Create daily summary notification job (8 PM)
    - Add job error handling and logging
    - _Requirements: 4.1, 4.2, 6.1_

  - [ ] 15.3 Implement caching strategy
    - Create SavingsCache utility class
    - Add 5-minute cache duration for savings data
    - Implement cache invalidation on data changes
    - Add localStorage caching for offline support
    - Optimize API queries with database indexes
    - _Requirements: 1.5, 2.2_

  - [ ] 15.4 Add performance optimizations
    - Implement lazy loading for heavy components
    - Add debouncing for expensive calculations
    - Implement throttling for chart updates
    - Batch database queries where possible
    - Add query result caching
    - _Requirements: 1.5, 2.2, 5.5_

  - [ ]\* 15.5 Write performance tests
    - Test savings calculation completes within 1 second
    - Test dashboard updates within 500ms on interval change
    - Test export completes within 5 seconds for 1 year data
    - _Requirements: 1.5, 2.2, 15.7_

  - [ ] 15.6 Implement accessibility features
    - Add ARIA labels to all interactive elements
    - Implement keyboard navigation for all components
    - Add focus management for modals and dialogs
    - Ensure color contrast meets WCAG AA standards
    - Add screen reader announcements for dynamic content
    - Test with keyboard-only navigation
    - _Requirements: 3.6, 16.5_

  - [ ]\* 15.7 Write accessibility tests
    - Test keyboard navigation (Tab, Enter, Escape)
    - Test ARIA label presence
    - Test focus management
    - Test screen reader compatibility
    - _Requirements: 3.6_

  - [ ] 15.8 Add error handling and validation
    - Implement input validation for all forms
    - Add error boundaries for React components
    - Implement graceful degradation for offline mode
    - Add user-friendly error messages
    - Implement error logging for debugging
    - _Requirements: 8.2, 11.3_

  - [ ] 15.9 Implement offline support
    - Register service worker for caching
    - Implement local calculation fallback
    - Add offline indicator in UI
    - Queue mutations for later sync
    - Disable server-dependent features when offline
    - _Requirements: 1.5, 2.2_

  - [ ] 15.10 Add mobile-specific features
    - Configure Capacitor plugins for notifications
    - Implement haptic feedback for achievements
    - Optimize touch interactions
    - Test on Android and iOS devices
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 15.11 Implement security measures
    - Add input validation and sanitization
    - Implement authorization checks for all endpoints
    - Add rate limiting for expensive operations
    - Ensure user data isolation in queries
    - Add CSRF protection
    - _Requirements: All_

  - [ ]\* 15.12 Write security tests
    - Test authorization enforcement
    - Test input validation
    - Test rate limiting
    - Test user data isolation
    - _Requirements: All_

- [ ] 16. Checkpoint - Verify integration and polish
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Phase 9: Testing and Documentation
  - [ ] 17.1 Run all property-based tests
    - Execute all 54 property tests with 100+ iterations each
    - Verify all properties pass consistently
    - Document any edge cases discovered
    - Fix any failing properties
    - _Requirements: All_

  - [ ] 17.2 Run all unit tests
    - Execute complete unit test suite
    - Verify 80%+ code coverage
    - Fix any failing tests
    - Add missing test cases for uncovered code
    - _Requirements: All_

  - [ ] 17.3 Run integration tests
    - Test complete user flows end-to-end
    - Test budget → expense → savings → milestone flow
    - Test jar creation → allocation → goal completion flow
    - Test challenge creation → progress → completion flow
    - Test auto-save rule → expense → jar allocation flow
    - _Requirements: All_

  - [ ] 17.4 Perform manual testing
    - Test on Android device
    - Test on iOS device (if available)
    - Test offline functionality
    - Test notification delivery
    - Test all animations and celebrations
    - Test accessibility with screen reader
    - _Requirements: All_

  - [ ] 17.5 Create user documentation
    - Document how to set budgets
    - Document how to create savings jars
    - Document how to set up auto-save rules
    - Document how to create challenges
    - Document notification settings
    - Document export functionality
    - _Requirements: All_

  - [ ] 17.6 Create developer documentation
    - Document API endpoints and parameters
    - Document database schema changes
    - Document component architecture
    - Document testing approach
    - Document deployment steps
    - _Requirements: All_

- [ ] 18. Final checkpoint - Complete feature verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples, edge cases, and error conditions
- Checkpoints ensure incremental validation at reasonable breaks
- All 54 correctness properties from the design document are covered
- Implementation follows the 6-phase approach from the design document
- Total of 20 requirements are fully addressed across all tasks

## Implementation Language

This feature is implemented using:

- **Frontend**: React with JavaScript/TypeScript, Recharts for visualizations
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Mobile**: Capacitor for native features (notifications, haptics)
- **Testing**: Jest for unit tests, fast-check for property-based tests

## Estimated Complexity

This is a large feature with approximately 100+ tasks including:

- 9 new database models
- 20+ API endpoints
- 15+ React components
- 54 property-based tests
- 50+ unit test suites
- Background job scheduling
- Mobile integration

Estimated implementation time: 3-4 weeks for a single developer working full-time.
