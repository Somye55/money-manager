/**
 * OKLCH Color Contrast Validation Script
 * Validates WCAG AA compliance for new OKLCH colors
 */

// Convert OKLCH to RGB for contrast calculation
function oklchToRgb(l, c, h) {
  // Convert OKLCH to OKLab
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);

  // Convert OKLab to linear RGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // Convert linear RGB to sRGB
  const toSrgb = (c) => {
    const abs = Math.abs(c);
    if (abs > 0.0031308) {
      return Math.sign(c) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
    }
    return 12.92 * c;
  };

  return {
    r: Math.max(0, Math.min(255, Math.round(toSrgb(r) * 255))),
    g: Math.max(0, Math.min(255, Math.round(toSrgb(g) * 255))),
    b: Math.max(0, Math.min(255, Math.round(toSrgb(b_) * 255))),
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

// New OKLCH color palette
const colors = {
  light: {
    background: { l: 1, c: 0, h: 0 }, // Pure white
    foreground: { l: 0.145, c: 0, h: 0 }, // Near black
    primary: { l: 0.55, c: 0.22, h: 264 }, // Darker indigo
    secondary: { l: 0.65, c: 0.25, h: 300 }, // Purple
    muted: { l: 0.96, c: 0.0058, h: 264.53 },
    mutedForeground: { l: 0.45, c: 0.02, h: 264 },
    destructive: { l: 0.55, c: 0.22, h: 25 }, // Darker red
    success: { l: 0.5, c: 0.17, h: 160 }, // Darker green
    warning: { l: 0.65, c: 0.19, h: 70 },
  },
  dark: {
    background: { l: 0.145, c: 0, h: 0 },
    foreground: { l: 0.985, c: 0, h: 0 },
    primary: { l: 0.7, c: 0.2, h: 264 },
    secondary: { l: 0.75, c: 0.22, h: 300 },
    muted: { l: 0.2, c: 0.01, h: 264 },
    mutedForeground: { l: 0.6, c: 0.02, h: 264 },
    destructive: { l: 0.65, c: 0.25, h: 25 },
    success: { l: 0.65, c: 0.2, h: 160 },
    warning: { l: 0.75, c: 0.18, h: 70 },
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
console.log("OKLCH COLOR CONTRAST VALIDATION REPORT");
console.log("WCAG AA Standard: 4.5:1 for normal text, 3:1 for large text");
console.log("=".repeat(80));
console.log("");

let passCount = 0;
let failCount = 0;
const failures = [];

testCombinations.forEach((test) => {
  const fgOklch = colors[test.theme][test.fg];
  const bgOklch = colors[test.theme][test.bg];

  const fgRgb = oklchToRgb(fgOklch.l, fgOklch.c, fgOklch.h);
  const bgRgb = oklchToRgb(bgOklch.l, bgOklch.c, bgOklch.h);

  const ratio = getContrastRatio(fgRgb, bgRgb);
  const passes = meetsWCAG_AA(ratio, test.isLarge);

  const status = passes ? "✓ PASS" : "✗ FAIL";
  const statusColor = passes ? "\x1b[32m" : "\x1b[31m";
  const resetColor = "\x1b[0m";

  console.log(
    `${statusColor}${status}${resetColor} [${test.theme.toUpperCase()}]`
  );
  console.log(`  Usage: ${test.usage}`);
  console.log(`  OKLCH FG: L=${fgOklch.l} C=${fgOklch.c} H=${fgOklch.h}`);
  console.log(`  OKLCH BG: L=${bgOklch.l} C=${bgOklch.c} H=${bgOklch.h}`);
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
      fgOklch,
      bgOklch,
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
      `   FG OKLCH: L=${failure.fgOklch.l} C=${failure.fgOklch.c} H=${failure.fgOklch.h}`
    );
    console.log(
      `   BG OKLCH: L=${failure.bgOklch.l} C=${failure.bgOklch.c} H=${failure.bgOklch.h}`
    );
    console.log(
      `   Ratio: ${failure.ratio}:1 (needs ${
        failure.isLarge ? "3.0" : "4.5"
      }:1)`
    );
    console.log("");
  });
}

// Comparison with old system
console.log("=".repeat(80));
console.log("IMPROVEMENT SUMMARY");
console.log("=".repeat(80));
console.log("Old System (Hex colors): 53.3% compliance (8/15 passed)");
console.log(
  `New System (OKLCH colors): ${(
    (passCount / testCombinations.length) *
    100
  ).toFixed(1)}% compliance (${passCount}/${testCombinations.length} passed)`
);
console.log("");

if (passCount > 8) {
  console.log(
    `\x1b[32m✓ IMPROVEMENT: ${passCount - 8} more tests passing!\x1b[0m`
  );
} else if (passCount === 8) {
  console.log("\x1b[33m⚠ NO CHANGE: Same number of tests passing\x1b[0m");
} else {
  console.log(
    `\x1b[31m✗ REGRESSION: ${8 - passCount} fewer tests passing\x1b[0m`
  );
}
console.log("");

// Exit with error code if any tests failed
process.exit(failCount > 0 ? 1 : 0);
