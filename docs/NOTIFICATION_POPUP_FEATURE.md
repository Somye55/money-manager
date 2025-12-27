# Notification Popup Feature

## Overview

When a financial notification is captured by the app (from WhatsApp, GPay, PhonePe, etc.), a popup modal immediately appears asking the user to categorize the expense. Once categorized, the expense is automatically saved to the database.

## Implementation

### Components Created

#### 1. CategorySelectionModal (`client/src/components/CategorySelectionModal.jsx`)

- **Purpose**: Modal popup for immediate expense categorization
- **Features**:
  - Displays transaction details (merchant, amount, date)
  - Shows suggested category if available
  - Grid layout of all available categories with icons and colors
  - Visual feedback for selected category
  - Save and Dismiss buttons
  - Loading state during save operation
  - Mobile-optimized bottom sheet design

### Modified Files

#### 2. SMSContext (`client/src/context/SMSContext.jsx`)

- **Added State**:
  - `pendingExpense`: Stores the notification data waiting for categorization
  - `showCategoryModal`: Controls modal visibility
- **Modified `startLiveListener()`**:
  - When a notification is captured, immediately shows the popup
  - Sets `pendingExpense` and `showCategoryModal` to true
  - Still adds to `extractedExpenses` as backup
- **New Functions**:
  - `handleCategoryConfirm(expense, categoryId)`: Saves expense with selected category
  - `handleCategoryModalClose()`: Closes modal and clears pending expense

#### 3. App Component (`client/src/App.jsx`)

- **Added**: `NotificationPopup` component that renders the `CategorySelectionModal`
- **Integration**: Modal is rendered globally, accessible from any page

## User Flow

1. **Notification Received**: User receives a payment notification (WhatsApp, GPay, etc.)
2. **Popup Appears**: Modal immediately pops up showing transaction details
3. **Category Selection**: User selects a category from the grid
4. **Save**: User clicks "Save Expense" button
5. **Database Update**: Expense is saved with:
   - Amount
   - Merchant name
   - Date
   - Selected category
   - Source: "NOTIFICATION"
6. **Confirmation**: Modal closes, expense appears in dashboard

## Technical Details

### Data Flow

```
Notification → Parse → Show Popup → User Selects Category → Save to DB → Close Popup
```

### Database Schema

Expenses are saved with:

- `amount`: Parsed from notification
- `description`: Merchant name
- `categoryId`: User-selected category
- `date`: Transaction date
- `source`: "NOTIFICATION"
- `userId`: Current authenticated user

### Duplicate Prevention

- Checks for duplicate notifications based on amount and raw SMS text
- Prevents showing popup for the same transaction multiple times

### Fallback Behavior

- If user dismisses the popup, the expense is still available in the extracted expenses list
- User can manually categorize it later from the dashboard

## UI/UX Features

- **Mobile-First Design**: Bottom sheet on mobile, centered modal on desktop
- **Visual Feedback**: Selected category highlighted with color and checkmark
- **Loading States**: Spinner shown during save operation
- **Accessibility**: Keyboard navigation, escape to close
- **Backdrop Dismiss**: Click outside to dismiss (optional)
- **Smooth Animations**: Fade-in and slide-up animations

## Configuration

### Confidence Threshold

Notifications with confidence score > 40 trigger the popup (configurable in `SMSContext.jsx`)

### Category Matching

Auto-suggested categories based on merchant keywords (defined in `smsParser.js`)

## Testing

To test the feature:

1. Enable notification permissions in Settings
2. Send a test payment notification (or use a real transaction)
3. Popup should appear immediately
4. Select a category and save
5. Verify expense appears in dashboard with correct category

## Future Enhancements

- Add "Edit Amount" option in popup
- Support for editing merchant name
- Quick category creation from popup
- Notification history/log
- Customizable confidence threshold
- Batch categorization for multiple notifications
