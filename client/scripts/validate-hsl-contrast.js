/**
 * HSL Color Contrast Validation Script
 * Validates WCAG AA compliance for HSL colors
 */

// Convert HSL to RGB
function hslToRgb(h, s, l) {
  s = s / 100;
  l = l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r, g, b;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
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
function getContrastRatio(rgb1, rgb2) {
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

// HSL color palette
const colors = {
  light: {
    background: { h: 0, s: 0, l: 100 },
    foreground: { h: 222, s: 47, l: 11 },
    primary: { h: 239, s: 84, l: 56 },
    secondary: { h: 280, s: 80, l: 60 },
    muted: { h: 220, s: 13, l: 91 },
    mutedForeground: { h: 220, s: 9, l: 46 },
    destructive: { h: 0, s: 72, l: 51 },
    success: { h: 142, s: 71, l: 30 },
    warning: { h: 38, s: 92, l: 50 },
  },
  dark: {
    background: { h: 222, s: 47, l: 11 },
    foreground: { h: 210, s: 40, l: 98 },
    primary: { h: 239, s: 84, l: 70 },
    secondary: { h: 280, s: 80, l: 70 },
    muted: { h: 217, s: 33, l: 17 },
    mutedForeground: { h: 215, s: 20, l: 65 },
    destructive: { h: 0, s: 84, l: 70 },
    success: { h: 142, s: 76, l: 50 },
    warning: { h: 38, s: 92, l: 60 },
  },
};

// Test combinations
const testCombinations = [
  // Light mode
  {
    theme: "light",
    fg: "foreground",
    bg: "background",
    usage: "Body text on white background",
    isLarge: false,
  },
  {
    theme: "light",
    fg: "mutedForeground",
    bg: "background",
    usage: "Muted text on white background",
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
    fg: "destructive",
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
    bg: "destructive",
    usage: "White text on destructive button",
    isLarge: false,
  },
  {
    theme: "light",
    fg: "background",
    bg: "success",
    usage: "White text on success button",
    isLarge: false,
  },

  // Dark mode
  {
    theme: "dark",
    fg: "foreground",
    bg: "background",
    usage: "Body text on dark background",
    isLarge: false,
  },
  {
    theme: "dark",
    fg: "mutedForeground",
    bg: "background",
    usage: "Muted text on dark background",
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
    fg: "destructive",
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
console.log("HSL COLOR CONTRAST VALIDATION REPORT");
console.log("WCAG AA Standard: 4.5:1 for normal text, 3:1 for large text");
console.log("=".repeat(80));
console.log("");

let passCount = 0;
let failCount = 0;
const failures = [];

testCombinations.forEach((test) => {
  const fgHsl = colors[test.theme][test.fg];
  const bgHsl = colors[test.theme][test.bg];

  const fgRgb = hslToRgb(fgHsl.h, fgHsl.s, fgHsl.l);
  const bgRgb = hslToRgb(bgHsl.h, bgHsl.s, bgHsl.l);

  const ratio = getContrastRatio(fgRgb, bgRgb);
  const passes = meetsWCAG_AA(ratio, test.isLarge);

  const status = passes ? "✓ PASS" : "✗ FAIL";
  const statusColor = passes ? "\x1b[32m" : "\x1b[31m";
  const resetColor = "\x1b[0m";

  console.log(
    `${statusColor}${status}${resetColor} [${test.theme.toUpperCase()}]`
  );
  console.log(`  Usage: ${test.usage}`);
  console.log(`  HSL FG: ${fgHsl.h}° ${fgHsl.s}% ${fgHsl.l}%`);
  console.log(`  HSL BG: ${bgHsl.h}° ${bgHsl.s}% ${bgHsl.l}%`);
  console.log(`  RGB FG: rgb(${fgRgb.r}, ${fgRgb.g}, ${fgRgb.b})`);
  console.log(`  RGB BG: rgb(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b})`);
  console.log(`  Contrast Ratio: ${ratio.toFixed(2)}:1`);
  console.log(`  Required: ${test.isLarge ? "3.0" : "4.5"}:1`);
  console.log("");

  if (passes) {
    passCount++;
  } else {
    failCount++;
    failures.push({
      ...test,
      fgHsl,
      bgHsl,
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
    console.log(
      `   FG HSL: ${failure.fgHsl.h}° ${failure.fgHsl.s}% ${failure.fgHsl.l}%`
    );
    console.log(
      `   BG HSL: ${failure.bgHsl.h}° ${failure.bgHsl.s}% ${failure.bgHsl.l}%`
    );
    console.log(
      `   Ratio: ${failure.ratio}:1 (needs ${
        failure.isLarge ? "3.0" : "4.5"
      }:1)`
    );
    console.log("");
  });
}

console.log("=".repeat(80));
console.log("STATUS");
console.log("=".repeat(80));
if (passCount === testCombinations.length) {
  console.log("\x1b[32m✓ ALL TESTS PASSING - WCAG AA COMPLIANT\x1b[0m");
} else {
  console.log(`\x1b[31m✗ ${failCount} TESTS FAILING - NOT COMPLIANT\x1b[0m`);
}
console.log("");

// Exit with error code if any tests failed
process.exit(failCount > 0 ? 1 : 0);
