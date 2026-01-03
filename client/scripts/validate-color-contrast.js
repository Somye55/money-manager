/**
 * Color Contrast Validation Script
 * Validates WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
 */

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate relative luminance
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Check if contrast meets WCAG AA
function meetsWCAG_AA(ratio, isLargeText = false) {
  const threshold = isLargeText ? 3.0 : 4.5;
  return ratio >= threshold;
}

// Current color palette from index.css
const colors = {
  light: {
    background: "#ffffff",
    backgroundSecondary: "#f8f9fc",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
    textTertiary: "#94a3b8",
    primary: "#6366f1",
    primaryLight: "#818cf8",
    primaryDark: "#4f46e5",
    secondary: "#a855f7",
    accent: "#ec4899",
    success: "#10b981",
    successLight: "#34d399",
    warning: "#f59e0b",
    danger: "#ef4444",
    dangerLight: "#f87171",
    border: "#e2e8f0",
  },
  dark: {
    background: "#0f172a",
    backgroundSecondary: "#020617",
    textPrimary: "#f1f5f9",
    textSecondary: "#94a3b8",
    textTertiary: "#64748b",
    primary: "#818cf8",
    primaryLight: "#a5b4fc",
    primaryDark: "#6366f1",
    secondary: "#c084fc",
    accent: "#f472b6",
    success: "#34d399",
    successLight: "#6ee7b7",
    warning: "#fbbf24",
    danger: "#f87171",
    dangerLight: "#fca5a5",
    border: "#1e293b",
  },
};

// Test combinations
const testCombinations = [
  // Light mode
  {
    theme: "light",
    fg: "textPrimary",
    bg: "background",
    usage: "Body text on white background",
    isLarge: false,
  },
  {
    theme: "light",
    fg: "textSecondary",
    bg: "background",
    usage: "Secondary text on white background",
    isLarge: false,
  },
  {
    theme: "light",
    fg: "textTertiary",
    bg: "background",
    usage: "Tertiary text on white background",
    isLarge: false,
  },
  {
    theme: "light",
    fg: "textPrimary",
    bg: "backgroundSecondary",
    usage: "Body text on secondary background",
    isLarge: false,
  },
  {
    theme: "light",
    fg: "primary",
    bg: "background",
    usage: "Primary color text on white",
    isLarge: false,
  },
  {
    theme: "light",
    fg: "danger",
    bg: "background",
    usage: "Error text on white",
    isLarge: false,
  },
  {
    theme: "light",
    fg: "success",
    bg: "background",
    usage: "Success text on white",
    isLarge: false,
  },
  {
    theme: "light",
    fg: "background",
    bg: "primary",
    usage: "White text on primary button",
    isLarge: false,
  },
  {
    theme: "light",
    fg: "background",
    bg: "danger",
    usage: "White text on danger button",
    isLarge: false,
  },

  // Dark mode
  {
    theme: "dark",
    fg: "textPrimary",
    bg: "background",
    usage: "Body text on dark background",
    isLarge: false,
  },
  {
    theme: "dark",
    fg: "textSecondary",
    bg: "background",
    usage: "Secondary text on dark background",
    isLarge: false,
  },
  {
    theme: "dark",
    fg: "textTertiary",
    bg: "background",
    usage: "Tertiary text on dark background",
    isLarge: false,
  },
  {
    theme: "dark",
    fg: "primary",
    bg: "background",
    usage: "Primary color text on dark",
    isLarge: false,
  },
  {
    theme: "dark",
    fg: "danger",
    bg: "background",
    usage: "Error text on dark",
    isLarge: false,
  },
  {
    theme: "dark",
    fg: "success",
    bg: "background",
    usage: "Success text on dark",
    isLarge: false,
  },
];

// Run validation
console.log("=".repeat(80));
console.log("COLOR CONTRAST VALIDATION REPORT");
console.log("WCAG AA Standard: 4.5:1 for normal text, 3:1 for large text");
console.log("=".repeat(80));
console.log("");

let passCount = 0;
let failCount = 0;
const failures = [];

testCombinations.forEach((test) => {
  const fgColor = colors[test.theme][test.fg];
  const bgColor = colors[test.theme][test.bg];
  const ratio = getContrastRatio(fgColor, bgColor);
  const passes = meetsWCAG_AA(ratio, test.isLarge);

  const status = passes ? "✓ PASS" : "✗ FAIL";
  const statusColor = passes ? "\x1b[32m" : "\x1b[31m";
  const resetColor = "\x1b[0m";

  console.log(
    `${statusColor}${status}${resetColor} [${test.theme.toUpperCase()}]`
  );
  console.log(`  Usage: ${test.usage}`);
  console.log(`  Colors: ${fgColor} on ${bgColor}`);
  console.log(`  Contrast Ratio: ${ratio.toFixed(2)}:1`);
  console.log(`  Required: ${test.isLarge ? "3.0" : "4.5"}:1`);
  console.log("");

  if (passes) {
    passCount++;
  } else {
    failCount++;
    failures.push({
      ...test,
      fgColor,
      bgColor,
      ratio: ratio.toFixed(2),
    });
  }
});

// Summary
console.log("=".repeat(80));
console.log("SUMMARY");
console.log("=".repeat(80));
console.log(`Total Tests: ${testCombinations.length}`);
console.log(`\x1b[32mPassed: ${passCount}\x1b[0m`);
console.log(`\x1b[31mFailed: ${failCount}\x1b[0m`);
console.log(
  `Compliance Rate: ${((passCount / testCombinations.length) * 100).toFixed(
    1
  )}%`
);
console.log("");

if (failures.length > 0) {
  console.log("=".repeat(80));
  console.log("FAILURES REQUIRING ATTENTION");
  console.log("=".repeat(80));
  failures.forEach((failure, index) => {
    console.log(`${index + 1}. ${failure.usage}`);
    console.log(`   Theme: ${failure.theme}`);
    console.log(`   Colors: ${failure.fgColor} on ${failure.bgColor}`);
    console.log(
      `   Ratio: ${failure.ratio}:1 (needs ${
        failure.isLarge ? "3.0" : "4.5"
      }:1)`
    );
    console.log("");
  });
}

// Recommendations
console.log("=".repeat(80));
console.log("RECOMMENDATIONS");
console.log("=".repeat(80));
console.log("1. Fix all failing color combinations");
console.log("2. Consider using darker text colors for better contrast");
console.log(
  "3. Test gradient backgrounds separately (not included in this test)"
);
console.log("4. Validate icon colors on various backgrounds");
console.log("5. Re-run this test after converting to OKLCH colors");
console.log("");

// Exit with error code if any tests failed
process.exit(failCount > 0 ? 1 : 0);
