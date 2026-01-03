/**
 * Example usage of utility functions
 * This file demonstrates how to use the utility functions in utils.ts
 */

import {
  cn,
  formatCurrency,
  formatDate,
  validateEmail,
  validateRequired,
  validatePositiveNumber,
  validateMinLength,
  validateMaxLength,
} from "./utils";

// ============================================
// cn() - Class name merging utility
// ============================================

// Merge multiple class names
const buttonClasses = cn(
  "px-4 py-2 rounded-md",
  "bg-blue-500 text-white",
  "hover:bg-blue-600"
);
// Result: "px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"

// Conditional classes
const isActive = true;
const conditionalClasses = cn(
  "base-class",
  isActive && "active-class",
  !isActive && "inactive-class"
);
// Result: "base-class active-class"

// Tailwind merge - handles conflicting classes
const mergedClasses = cn("p-4 px-2", "p-6");
// Result: "px-2 p-6" (p-6 overrides p-4, px-2 is preserved)

// ============================================
// formatCurrency() - Currency formatting
// ============================================

const price1 = formatCurrency(1234.56);
// Result: "$1,234.56"

const price2 = formatCurrency(0.99);
// Result: "$0.99"

const price3 = formatCurrency(1000000);
// Result: "$1,000,000.00"

// ============================================
// formatDate() - Date formatting
// ============================================

const today = new Date();

// Short format (default)
const shortDate = formatDate(today);
// Result: "Jan 3, 2026"

// Long format
const longDate = formatDate(today, "long");
// Result: "Saturday, January 3, 2026"

// Relative format
const recentDate = new Date(Date.now() - 1000 * 60 * 30); // 30 minutes ago
const relativeDate = formatDate(recentDate, "relative");
// Result: "30m ago"

// Works with strings and timestamps
const dateString = formatDate("2026-01-01");
// Result: "Jan 1, 2026"

const timestamp = formatDate(1704067200000);
// Result: formatted date

// ============================================
// validateEmail() - Email validation
// ============================================

const validEmail = validateEmail("user@example.com");
// Result: true

const invalidEmail1 = validateEmail("invalid.email");
// Result: false

const invalidEmail2 = validateEmail("@example.com");
// Result: false

// ============================================
// validateRequired() - Required field validation
// ============================================

const validInput = validateRequired("Hello");
// Result: true

const invalidInput1 = validateRequired("");
// Result: false

const invalidInput2 = validateRequired("   ");
// Result: false (only whitespace)

// ============================================
// validatePositiveNumber() - Positive number validation
// ============================================

const validNumber = validatePositiveNumber(10);
// Result: true

const invalidNumber1 = validatePositiveNumber(0);
// Result: false

const invalidNumber2 = validatePositiveNumber(-5);
// Result: false

const invalidNumber3 = validatePositiveNumber(NaN);
// Result: false

// ============================================
// validateMinLength() - Minimum length validation
// ============================================

const validLength = validateMinLength("password123", 8);
// Result: true

const invalidLength = validateMinLength("pass", 8);
// Result: false

// ============================================
// validateMaxLength() - Maximum length validation
// ============================================

const validMaxLength = validateMaxLength("Hello", 10);
// Result: true

const invalidMaxLength = validateMaxLength("This is a very long string", 10);
// Result: false

// ============================================
// Practical usage examples
// ============================================

// Form validation
function validateExpenseForm(data: {
  amount: number;
  description: string;
  email?: string;
}) {
  const errors: Record<string, string> = {};

  if (!validatePositiveNumber(data.amount)) {
    errors.amount = "Amount must be a positive number";
  }

  if (!validateRequired(data.description)) {
    errors.description = "Description is required";
  }

  if (!validateMinLength(data.description, 3)) {
    errors.description = "Description must be at least 3 characters";
  }

  if (!validateMaxLength(data.description, 100)) {
    errors.description = "Description must be less than 100 characters";
  }

  if (data.email && !validateEmail(data.email)) {
    errors.email = "Invalid email address";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Display expense with formatted values
function displayExpense(expense: {
  amount: number;
  description: string;
  date: Date;
}) {
  return {
    amount: formatCurrency(expense.amount),
    description: expense.description,
    date: formatDate(expense.date, "short"),
    relativeDate: formatDate(expense.date, "relative"),
  };
}

// Example usage in a component
const exampleExpense = {
  amount: 49.99,
  description: "Grocery shopping",
  date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
};

const displayData = displayExpense(exampleExpense);
// Result: {
//   amount: "$49.99",
//   description: "Grocery shopping",
//   date: "Jan 3, 2026",
//   relativeDate: "2h ago"
// }

export {
  buttonClasses,
  conditionalClasses,
  mergedClasses,
  price1,
  price2,
  price3,
  shortDate,
  longDate,
  relativeDate,
  validEmail,
  invalidEmail1,
  validateExpenseForm,
  displayExpense,
};
