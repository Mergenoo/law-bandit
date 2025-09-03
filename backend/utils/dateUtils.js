/**
 * Utility functions for date parsing and calendar event processing
 */

/**
 * Parse various date formats and convert to YYYY-MM-DD
 * @param {string} dateString - Date string in various formats
 * @param {number} currentYear - Current academic year
 * @returns {string} Date in YYYY-MM-DD format
 */
function parseDate(dateString, currentYear = new Date().getFullYear()) {
  if (!dateString) return null;

  // Remove extra whitespace and normalize
  const cleanDate = dateString.trim().toLowerCase();

  // Common date patterns
  const patterns = [
    // MM/DD/YYYY
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    // MM/DD (assume current year)
    /^(\d{1,2})\/(\d{1,2})$/,
    // Month DD, YYYY
    /^(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})$/i,
    // Month DD (assume current year)
    /^(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})$/i,
    // DD Month YYYY
    /^(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})$/i,
    // DD Month (assume current year)
    /^(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)$/i,
    // YYYY-MM-DD (already in correct format)
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
  ];

  const monthNames = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };

  for (const pattern of patterns) {
    const match = cleanDate.match(pattern);
    if (match) {
      let month, day, year;

      if (pattern.source.includes("january|february")) {
        // Month DD or Month DD, YYYY format
        const monthName = match[1].toLowerCase();
        month = monthNames[monthName];
        day = parseInt(match[2]);
        year = match[3] ? parseInt(match[3]) : currentYear;
      } else if (pattern.source.includes("\\d{1,2}\\s+")) {
        // DD Month or DD Month YYYY format
        day = parseInt(match[1]);
        const monthName = match[2].toLowerCase();
        month = monthNames[monthName];
        year = match[3] ? parseInt(match[3]) : currentYear;
      } else {
        // MM/DD or MM/DD/YYYY format
        month = parseInt(match[1]);
        day = parseInt(match[2]);
        year = match[3] ? parseInt(match[3]) : currentYear;
      }

      // Validate date
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      ) {
        return `${year}-${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`;
      }
    }
  }

  return null;
}

/**
 * Determine event type based on keywords in the title/description
 * @param {string} title - Event title
 * @param {string} description - Event description
 * @returns {string} Event type (assignment, exam, reading, other)
 */
function determineEventType(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  const examKeywords = [
    "exam",
    "test",
    "quiz",
    "midterm",
    "final",
    "assessment",
  ];
  const assignmentKeywords = [
    "assignment",
    "homework",
    "project",
    "paper",
    "essay",
    "due",
  ];
  const readingKeywords = ["reading", "chapter", "textbook", "article", "book"];

  if (examKeywords.some((keyword) => text.includes(keyword))) {
    return "exam";
  }
  if (assignmentKeywords.some((keyword) => text.includes(keyword))) {
    return "assignment";
  }
  if (readingKeywords.some((keyword) => text.includes(keyword))) {
    return "reading";
  }

  return "other";
}

/**
 * Calculate confidence score based on date clarity and event information
 * @param {string} dateString - Extracted date string
 * @param {string} title - Event title
 * @param {string} sourceText - Original text from syllabus
 * @returns {number} Confidence score between 0 and 1
 */
function calculateConfidenceScore(dateString, title, sourceText) {
  let score = 0.5; // Base score

  // Date parsing confidence
  if (dateString && parseDate(dateString)) {
    score += 0.3;
  }

  // Title clarity
  if (title && title.length > 3) {
    score += 0.1;
  }

  // Source text length (more context = higher confidence)
  if (sourceText && sourceText.length > 10) {
    score += 0.1;
  }

  return Math.min(score, 1.0);
}

module.exports = {
  parseDate,
  determineEventType,
  calculateConfidenceScore,
};
