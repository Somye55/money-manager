/**
 * SMS Parser - Extracts expense information from SMS messages and Notifications
 */

const SMS_PATTERNS = {
  debited: [
    /(?:debited|spent|paid).*?(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
    /(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?).*?(?:debited|spent|paid)/i,
    /upi.*?(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
    /payment.*?(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
    /sent\s+(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i, // Common in GPay
    /(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)\s+(?:has been|was)\s+(?:debited|deducted)/i,
    /(?:withdrawn|transferred)\s+(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
  ],
  credited: [
    /(?:credited|received).*?(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
    /(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?).*?(?:credited|received)/i,
    /(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)\s+(?:has been|was)\s+credited/i,
    /(?:deposited|added)\s+(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
  ],
  merchant: [
    /(?:at|to|from)\s+([A-Z][A-Z0-9\s&.-]{2,30})/,
    /(?:merchant|vendor):\s*([A-Za-z0-9\s&.-]+)/i,
    /on\s+([A-Z][A-Z0-9\s&.-]{2,30})/,
    /paid\s+to\s+([A-Za-z0-9\s&.-]+)/i, // GPay/PhonePe format
  ],
  date: [
    /on\s+(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/,
    /(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})/i,
  ],
  card: [
    /card\s+(?:ending\s+)?(?:xx|x{2,4})?(\d{4})/i,
    /a\/c\s+(?:xx|x{2,4})?(\d{4})/i,
  ],
};

const CATEGORY_KEYWORDS = {
  "Food & Dining": [
    "swiggy",
    "zomato",
    "uber eats",
    "food",
    "restaurant",
    "cafe",
    "dominos",
    "mcdonald",
    "kfc",
    "pizza",
    "burger",
  ],
  Transportation: [
    "uber",
    "ola",
    "rapido",
    "metro",
    "bus",
    "taxi",
    "fuel",
    "petrol",
    "diesel",
    "parking",
  ],
  Shopping: [
    "amazon",
    "flipkart",
    "myntra",
    "ajio",
    "shopping",
    "mall",
    "retail",
    "store",
  ],
  Entertainment: [
    "netflix",
    "amazon prime",
    "hotstar",
    "spotify",
    "movie",
    "cinema",
    "pvr",
    "inox",
    "gaming",
  ],
  "Bills & Utilities": [
    "electricity",
    "water",
    "gas",
    "mobile",
    "internet",
    "broadband",
    "bill",
    "recharge",
    "airtel",
    "jio",
    "vodafone",
  ],
  Groceries: [
    "grocery",
    "supermarket",
    "dmart",
    "reliance fresh",
    "big bazaar",
    "more",
    "milk",
    "vegetables",
  ],
  Health: [
    "hospital",
    "medical",
    "pharmacy",
    "medicine",
    "doctor",
    "clinic",
    "apollo",
    "health",
  ],
  Education: [
    "course",
    "book",
    "education",
    "school",
    "college",
    "university",
    "tuition",
    "udemy",
    "coursera",
  ],
};

// Known App Package Names
const APP_PACKAGES = {
  "com.whatsapp": "WhatsApp",
  "com.google.android.apps.nbu.paisa.user": "GPay",
  "com.phonepe.app": "PhonePe",
  "net.one97.paytm": "Paytm",
  "com.amazon.mShop.android.shopping": "Amazon",
  "com.freecharge.android": "Freecharge",
};

function extractAmount(text, type = "debited") {
  const patterns = SMS_PATTERNS[type] || SMS_PATTERNS.debited;
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const amount = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(amount) && amount > 0) return amount;
    }
  }
  return null;
}

function extractMerchant(text) {
  for (const pattern of SMS_PATTERNS.merchant) {
    const match = text.match(pattern);
    if (match && match[1]) {
      let merchant = match[1].trim();
      merchant = merchant.replace(/\s+(pvt\.?|ltd\.?|inc\.?|llc)$/i, "");
      return merchant;
    }
  }
  return null;
}

function extractDate(text, defaultDate) {
  for (const pattern of SMS_PATTERNS.date) {
    const match = text.match(pattern);
    if (match && match[1]) {
      try {
        const date = new Date(match[1]);
        if (!isNaN(date.getTime())) return date;
      } catch (e) {}
    }
  }
  return defaultDate;
}

function determineCategory(text, merchant) {
  const lowerText = text.toLowerCase();
  const lowerMerchant = (merchant || "").toLowerCase();
  let bestMatch = null;
  let maxMatches = 0;
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matches = keywords.filter(
      (keyword) =>
        lowerText.includes(keyword) || lowerMerchant.includes(keyword)
    ).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = category;
    }
  }
  return bestMatch || "Other";
}

function getTransactionType(text) {
  const lowerText = text.toLowerCase();
  if (/debited|spent|paid|purchase|withdrawn|sent/i.test(lowerText))
    return "expense";
  if (/credited|received|refund|deposit/i.test(lowerText)) return "income";
  return "expense";
}

function calculateConfidence(amount, merchant, category) {
  let score = 0;
  if (amount > 0) score += 40;
  if (merchant) score += 30;
  if (category && category !== "Other") score += 30;
  return score;
}

// ============ EXPORTS ============

export function parseSMS(sms) {
  if (!sms || !sms.body) return null;

  const text = sms.body;
  const transactionType = getTransactionType(text);
  const amount = extractAmount(
    text,
    transactionType === "expense" ? "debited" : "credited"
  );

  if (!amount) return null;

  const merchant = extractMerchant(text);
  const smsDate = sms.date ? new Date(sms.date) : new Date();
  const date = extractDate(text, smsDate);
  const suggestedCategory = determineCategory(text, merchant);

  return {
    amount,
    description: merchant || `Transaction`,
    date: date.toISOString().split("T")[0],
    source: "SMS",
    transactionType,
    rawSMS: text,
    sender: sms.address,
    smsDate: smsDate.toISOString(),
    suggestedCategory,
    merchant,
    confidence: calculateConfidence(amount, merchant, suggestedCategory),
  };
}

export function parseNotification(notification) {
  if (!notification || !notification.text) return null;

  const text = notification.text;
  const title = notification.title || "";
  const pkg = notification.package || "";

  // Filter out common non-transaction notifications
  if (
    text.includes("checking for new messages") ||
    text.includes("running in background") ||
    text.includes("Backup in progress")
  ) {
    return null;
  }

  const transactionType = getTransactionType(text);
  const amount = extractAmount(
    text,
    transactionType === "expense" ? "debited" : "credited"
  );

  if (!amount) return null;

  // Determine source app
  let sourceApp = APP_PACKAGES[pkg] || "App";
  if (pkg.includes("messaging") || pkg.includes("sms")) sourceApp = "SMS";

  const merchant = extractMerchant(text) || title; // In notifs, title is often sender
  const suggestedCategory = determineCategory(text, merchant);
  const date = new Date(); // Notification received now

  return {
    amount,
    description: merchant || `Transaction via ${sourceApp}`,
    date: date.toISOString().split("T")[0],
    source: sourceApp === "SMS" ? "SMS" : "NOTIFICATION",
    transactionType,
    rawSMS: `${title}: ${text}`,
    sender: title,
    smsDate: date.toISOString(),
    suggestedCategory,
    merchant,
    confidence: calculateConfidence(amount, merchant, suggestedCategory),
  };
}

export function parseSMSList(smsList, options = {}) {
  const {
    filterDuplicates = true,
    minConfidence = 50,
    onlyExpenses = true,
  } = options;

  const parsed = smsList
    .map((sms) => parseSMS(sms))
    .filter((data) => data !== null)
    .filter((data) => data.confidence >= minConfidence)
    .filter((data) => !onlyExpenses || data.transactionType === "expense");

  if (!filterDuplicates) return parsed;

  const seen = new Set();
  return parsed.filter((data) => {
    const key = `${data.amount}-${data.date}-${data.merchant}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
