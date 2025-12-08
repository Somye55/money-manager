/**
 * SMS Parser - Extracts expense information from SMS messages
 */

/**
 * Common bank and payment app patterns
 */
const SMS_PATTERNS = {
  // Debit/expense patterns
  debited: [
    // Standard debit format
    /(?:debited|spent|paid).*?(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
    // Reverse format (amount before keyword)
    /(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?).*?(?:debited|spent|paid)/i,
    // UPI payment
    /upi.*?(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
    // Generic payment
    /payment.*?(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
  ],
  
  // Credit/income patterns
  credited: [
    /(?:credited|received).*?(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
    /(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?).*?(?:credited|received)/i,
  ],
  
  // Merchants and purposes
  merchant: [
    /(?:at|to|from)\s+([A-Z][A-Z0-9\s&.-]{2,30})/,
    /(?:merchant|vendor):\s*([A-Za-z0-9\s&.-]+)/i,
    /on\s+([A-Z][A-Z0-9\s&.-]{2,30})/,
  ],
  
  // Date patterns
  date: [
    /on\s+(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/,
    /(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})/i,
  ],
  
  // Card patterns (last 4 digits)
  card: [
    /card\s+(?:ending\s+)?(?:xx|x{2,4})?(\d{4})/i,
    /a\/c\s+(?:xx|x{2,4})?(\d{4})/i,
  ],
};

/**
 * Category mapping based on keywords in SMS
 */
const CATEGORY_KEYWORDS = {
  'Food & Dining': ['swiggy', 'zomato', 'uber eats', 'food', 'restaurant', 'cafe', 'dominos', 'mcdonald', 'kfc', 'pizza', 'burger'],
  'Transportation': ['uber', 'ola', 'rapido', 'metro', 'bus', 'taxi', 'fuel', 'petrol', 'diesel', 'parking'],
  'Shopping': ['amazon', 'flipkart', 'myntra', 'ajio', 'shopping', 'mall', 'retail', 'store'],
  'Entertainment': ['netflix', 'amazon prime', 'hotstar', 'spotify', 'movie', 'cinema', 'pvr', 'inox', 'gaming'],
  'Bills & Utilities': ['electricity', 'water', 'gas', 'mobile', 'internet', 'broadband', 'bill', 'recharge', 'airtel', 'jio', 'vodafone'],
  'Groceries': ['grocery', 'supermarket', 'dmart', 'reliance fresh', 'big bazaar', 'more', 'milk', 'vegetables'],
  'Health': ['hospital', 'medical', 'pharmacy', 'medicine', 'doctor', 'clinic', 'apollo', 'health'],
  'Education': ['course', 'book', 'education', 'school', 'college', 'university', 'tuition', 'udemy', 'coursera'],
};

/**
 * Extract amount from SMS text
 */
function extractAmount(text, type = 'debited') {
  const patterns = SMS_PATTERNS[type] || SMS_PATTERNS.debited;
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Remove commas and parse as float
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(amount) && amount > 0) {
        return amount;
      }
    }
  }
  
  return null;
}

/**
 * Extract merchant/vendor name from SMS
 */
function extractMerchant(text) {
  for (const pattern of SMS_PATTERNS.merchant) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Clean up the merchant name
      let merchant = match[1].trim();
      // Remove common suffixes
      merchant = merchant.replace(/\s+(pvt\.?|ltd\.?|inc\.?|llc)$/i, '');
      return merchant;
    }
  }
  
  return null;
}

/**
 * Extract date from SMS (if mentioned, otherwise use SMS date)
 */
function extractDate(text, defaultDate) {
  for (const pattern of SMS_PATTERNS.date) {
    const match = text.match(pattern);
    if (match && match[1]) {
      try {
        const date = new Date(match[1]);
        if (!isNaN(date.getTime())) {
          return date;
        }
      } catch (e) {
        // Continue to next pattern
      }
    }
  }
  
  return defaultDate;
}

/**
 * Determine category based on merchant name and SMS content
 */
function determineCategory(text, merchant) {
  const lowerText = text.toLowerCase();
  const lowerMerchant = (merchant || '').toLowerCase();
  
  let bestMatch = null;
  let maxMatches = 0;
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matches = keywords.filter(keyword => 
      lowerText.includes(keyword) || lowerMerchant.includes(keyword)
    ).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = category;
    }
  }
  
  return bestMatch || 'Other';
}

/**
 * Determine if SMS is a debit (expense) or credit (income)
 */
function getTransactionType(text) {
  const lowerText = text.toLowerCase();
  
  // Check for debit keywords
  if (/debited|spent|paid|purchase|withdrawn/i.test(lowerText)) {
    return 'expense';
  }
  
  // Check for credit keywords
  if (/credited|received|refund|deposit/i.test(lowerText)) {
    return 'income';
  }
  
  // Default to expense if amount is found
  return 'expense';
}

/**
 * Parse a single SMS message and extract expense information
 * @param {Object} sms - SMS object with body, address, date
 * @returns {Object|null} Parsed expense data or null if not parseable
 */
export function parseSMS(sms) {
  if (!sms || !sms.body) {
    return null;
  }

  const text = sms.body;
  const transactionType = getTransactionType(text);
  
  // Extract amount based on transaction type
  const amount = extractAmount(text, transactionType === 'expense' ? 'debited' : 'credited');
  
  if (!amount) {
    return null; // Not a financial SMS or amount not found
  }

  // Extract other information
  const merchant = extractMerchant(text);
  const smsDate = sms.date ? new Date(sms.date) : new Date();
  const date = extractDate(text, smsDate);
  const suggestedCategory = determineCategory(text, merchant);

  return {
    amount,
    description: merchant || `Transaction from ${sms.address || 'Unknown'}`,
    date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
    source: 'SMS',
    transactionType,
    rawSMS: text,
    sender: sms.address,
    smsDate: smsDate.toISOString(),
    suggestedCategory,
    merchant,
    confidence: calculateConfidence(amount, merchant, suggestedCategory),
  };
}

/**
 * Calculate confidence score for the parsed data
 */
function calculateConfidence(amount, merchant, category) {
  let score = 0;
  
  if (amount > 0) score += 40;
  if (merchant) score += 30;
  if (category && category !== 'Other') score += 30;
  
  return score;
}

/**
 * Parse multiple SMS messages
 * @param {Array} smsList - Array of SMS objects
 * @param {Object} options - Parsing options
 * @returns {Array} Array of parsed expense data
 */
export function parseSMSList(smsList, options = {}) {
  const {
    filterDuplicates = true,
    minConfidence = 50,
    onlyExpenses = true,
  } = options;

  const parsed = smsList
    .map(sms => parseSMS(sms))
    .filter(data => data !== null)
    .filter(data => data.confidence >= minConfidence)
    .filter(data => !onlyExpenses || data.transactionType === 'expense');

  if (!filterDuplicates) {
    return parsed;
  }

  // Remove duplicates based on amount, date, and merchant
  const seen = new Set();
  return parsed.filter(data => {
    const key = `${data.amount}-${data.date}-${data.merchant}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Get statistics from parsed SMS data
 */
export function getSMSStatistics(parsedList) {
  if (!parsedList || parsedList.length === 0) {
    return {
      total: 0,
      totalAmount: 0,
      byCategory: {},
      byDay: {},
    };
  }

  const stats = {
    total: parsedList.length,
    totalAmount: 0,
    byCategory: {},
    byDay: {},
  };

  parsedList.forEach(data => {
    stats.totalAmount += data.amount;

    // Group by category
    if (!stats.byCategory[data.suggestedCategory]) {
      stats.byCategory[data.suggestedCategory] = {
        count: 0,
        amount: 0,
      };
    }
    stats.byCategory[data.suggestedCategory].count++;
    stats.byCategory[data.suggestedCategory].amount += data.amount;

    // Group by day
    if (!stats.byDay[data.date]) {
      stats.byDay[data.date] = {
        count: 0,
        amount: 0,
      };
    }
    stats.byDay[data.date].count++;
    stats.byDay[data.date].amount += data.amount;
  });

  return stats;
}
