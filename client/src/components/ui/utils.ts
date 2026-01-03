import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency with $ symbol and 2 decimal places
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string or Date object to a readable format
 * @param date - The date to format (string, Date, or timestamp)
 * @param format - The format type ('short', 'long', 'relative')
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | number,
  format: "short" | "long" | "relative" = "short"
): string {
  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  if (format === "relative") {
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  }

  if (format === "long") {
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Default 'short' format
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Validate email address format
 * @param email - The email to validate
 * @returns True if valid email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate that a string is not empty or only whitespace
 * @param value - The string to validate
 * @returns True if string has content
 */
export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validate that a number is positive
 * @param value - The number to validate
 * @returns True if number is positive
 */
export function validatePositiveNumber(value: number): boolean {
  return !isNaN(value) && value > 0;
}

/**
 * Validate that a string matches a minimum length
 * @param value - The string to validate
 * @param minLength - Minimum required length
 * @returns True if string meets minimum length
 */
export function validateMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

/**
 * Validate that a string matches a maximum length
 * @param value - The string to validate
 * @param maxLength - Maximum allowed length
 * @returns True if string is within maximum length
 */
export function validateMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}
