import { ExtractedEvent, EventType } from "@/types/database";

/**
 * LLM prompt template for extracting calendar events from syllabus text
 */
const EXTRACTION_PROMPT = `
You are an AI assistant that extracts calendar events from academic syllabi. Your task is to identify assignments, exams, quizzes, projects, and deadlines with their due dates.

Input text: {text}

Please extract all calendar events and return them as a JSON array. Each event should have:
- title: A clear, concise title for the event
- description: Additional details about the event (optional)
- eventType: One of "assignment", "exam", "quiz", "project", or "deadline"
- dueDate: Date in ISO format (YYYY-MM-DD)
- dueTime: Time in 24-hour format (HH:MM) if specified, otherwise null
- confidenceScore: Confidence level from 0.0 to 1.0
- sourceText: The exact text snippet that generated this event

Rules:
1. Only extract events with explicit dates (e.g., "Assignment due: September 15" not "second Tuesday")
2. Be conservative with confidence scores - only high confidence for clear dates
3. Include the original text snippet that was used to create each event
4. If no clear events are found, return an empty array

Return only valid JSON:
`;

/**
 * Fallback regex patterns for common date formats
 */
const DATE_PATTERNS = [
  // "Assignment due: September 15, 2024"
  /(assignment|exam|quiz|project|deadline|due)[\s:]+([^:]+?)[\s:]+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})/gi,

  // "Due: 9/15/2024"
  /(assignment|exam|quiz|project|deadline|due)[\s:]+([^:]+?)[\s:]+(\d{1,2})\/(\d{1,2})\/(\d{4})/gi,

  // "Final Exam - Dec 10"
  /(final\s+exam|midterm|assignment|project)[\s:-]+([^-]+?)[\s:-]+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})/gi,
];

/**
 * Month name to number mapping
 */
const MONTH_MAP: Record<string, number> = {
  january: 1,
  jan: 1,
  february: 2,
  feb: 2,
  march: 3,
  mar: 3,
  april: 4,
  apr: 4,
  may: 5,
  june: 6,
  jun: 6,
  july: 7,
  jul: 7,
  august: 8,
  aug: 8,
  september: 9,
  sep: 9,
  october: 10,
  oct: 10,
  november: 11,
  nov: 11,
  december: 12,
  dec: 12,
};

/**
 * Extract events using LLM (placeholder for actual LLM integration)
 * @param text Syllabus text content
 * @returns Array of extracted events
 */
export async function extractEventsWithLLM(
  text: string
): Promise<ExtractedEvent[]> {
  try {
    // This is a placeholder - replace with actual LLM API call
    const prompt = EXTRACTION_PROMPT.replace("{text}", text);

    // Simulate LLM response for now
    // In production, this would call OpenAI, Anthropic, or similar
    const mockResponse = await simulateLLMResponse(prompt, text);

    return mockResponse;
  } catch (error) {
    console.error("LLM extraction failed:", error);
    // Fallback to regex patterns
    return extractEventsWithRegex(text);
  }
}

/**
 * Extract events using regex patterns (fallback method)
 * @param text Syllabus text content
 * @returns Array of extracted events
 */
export function extractEventsWithRegex(text: string): ExtractedEvent[] {
  const events: ExtractedEvent[] = [];

  DATE_PATTERNS.forEach((pattern) => {
    const matches = text.matchAll(pattern);

    for (const match of matches) {
      try {
        const event = parseRegexMatch(match, text);
        if (event) {
          events.push(event);
        }
      } catch (error) {
        console.error("Error parsing regex match:", error);
      }
    }
  });

  return events;
}

/**
 * Parse a regex match into an ExtractedEvent
 * @param match Regex match result
 * @param sourceText Original text
 * @returns ExtractedEvent or null
 */
function parseRegexMatch(
  match: RegExpMatchArray,
  sourceText: string
): ExtractedEvent | null {
  try {
    const fullMatch = match[0];
    const eventType = determineEventType(match[1]?.toLowerCase() || "");
    const title = match[2]?.trim() || "Unknown Event";

    let dueDate: string;
    const confidenceScore = 0.7; // Lower confidence for regex matches

    if (match[3] && MONTH_MAP[match[3].toLowerCase()]) {
      // Format: "September 15, 2024"
      const month = MONTH_MAP[match[3].toLowerCase()];
      const day = parseInt(match[4]);
      const year = parseInt(match[5]);
      dueDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    } else if (match[3] && match[4] && match[5]) {
      // Format: "9/15/2024"
      const month = parseInt(match[3]);
      const day = parseInt(match[4]);
      const year = parseInt(match[5]);
      dueDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    } else {
      return null;
    }

    // Validate date
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      return null;
    }

    return {
      title: title.length > 0 ? title : `${eventType} due`,
      description: `Extracted from syllabus text`,
      eventType,
      dueDate,
      dueTime: undefined,
      confidenceScore,
      sourceText: fullMatch,
    };
  } catch (error) {
    console.error("Error parsing regex match:", error);
    return null;
  }
}

/**
 * Determine event type from text
 * @param text Text containing event type
 * @returns EventType
 */
function determineEventType(text: string): EventType {
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("exam") ||
    lowerText.includes("final") ||
    lowerText.includes("midterm")
  ) {
    return "exam";
  }
  if (lowerText.includes("quiz")) {
    return "quiz";
  }
  if (lowerText.includes("project")) {
    return "project";
  }
  if (lowerText.includes("assignment")) {
    return "assignment";
  }

  return "deadline";
}

/**
 * Simulate LLM response (replace with actual LLM API)
 * @param prompt LLM prompt
 * @param text Original text
 * @returns Mock extracted events
 */
async function simulateLLMResponse(
  prompt: string,
  text: string
): Promise<ExtractedEvent[]> {
  // This is a mock implementation - replace with actual LLM API
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

  // Simple mock extraction based on common patterns
  const events: ExtractedEvent[] = [];

  // Look for common patterns
  const duePattern =
    /(assignment|exam|quiz|project|deadline)[\s:]+([^:]+?)[\s:]+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})/gi;
  const matches = text.matchAll(duePattern);

  for (const match of matches) {
    const eventType = determineEventType(match[1] || "");
    const title = match[2]?.trim() || "Unknown Event";
    const month = MONTH_MAP[match[3]?.toLowerCase() || ""];
    const day = parseInt(match[4] || "1");
    const year = parseInt(match[5] || "2024");

    if (month && day && year) {
      const dueDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      events.push({
        title: title.length > 0 ? title : `${eventType} due`,
        description: `Extracted from syllabus text`,
        eventType,
        dueDate,
        dueTime: undefined,
        confidenceScore: 0.85, // Higher confidence for LLM
        sourceText: match[0],
      });
    }
  }

  return events;
}

/**
 * Validate extracted events
 * @param events Array of extracted events
 * @returns Validated events
 */
export function validateExtractedEvents(
  events: ExtractedEvent[]
): ExtractedEvent[] {
  return events.filter((event) => {
    // Validate required fields
    if (!event.title || !event.dueDate || !event.eventType) {
      return false;
    }

    // Validate date format
    const date = new Date(event.dueDate);
    if (isNaN(date.getTime())) {
      return false;
    }

    // Validate confidence score
    if (event.confidenceScore < 0 || event.confidenceScore > 1) {
      return false;
    }

    // Validate event type
    const validTypes = ["assignment", "exam", "quiz", "project", "deadline"];
    if (!validTypes.includes(event.eventType)) {
      return false;
    }

    return true;
  });
}

/**
 * Merge duplicate events based on title and date
 * @param events Array of events
 * @returns Deduplicated events
 */
export function deduplicateEvents(events: ExtractedEvent[]): ExtractedEvent[] {
  const seen = new Set<string>();
  return events.filter((event) => {
    const key = `${event.title.toLowerCase()}-${event.dueDate}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
