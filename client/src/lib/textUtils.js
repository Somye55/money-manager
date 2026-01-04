/**
 * Text utility functions for formatting and capitalization
 */

/**
 * Capitalizes the first character of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The string with first character capitalized
 */
export const capitalizeFirst = (str) => {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Capitalizes the first character of each word in a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The string with first character of each word capitalized
 */
export const capitalizeWords = (str) => {
  if (!str || typeof str !== "string") return str;
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
