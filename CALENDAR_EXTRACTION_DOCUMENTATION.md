# Calendar Event Extraction API

This document describes the calendar event extraction functionality implemented in the Law Bandit application.

## Overview

The calendar extraction system allows users to extract calendar events (assignments, exams, readings, etc.) from syllabus content using AI-powered text analysis. The system consists of:

1. **Backend API** (`backend/routes/calendar.js`) - Handles AI extraction using Gemini
2. **Frontend API** (`frontend/src/app/api/calendar/route.ts`) - Provides authenticated access
3. **Frontend Components** - UI for testing and using the extraction functionality

## Backend API

### Endpoint: `POST /api/calendar/extract-events`

**Request Body:**

```json
{
  "pdf_context": "Syllabus content text..."
}
```

**Response:**

```json
{
  "message": "Calendar events extracted successfully",
  "events": [
    {
      "title": "Assignment 1 Due - Client Memo",
      "description": "Assignment 1: Client Memo",
      "event_type": "assignment",
      "due_date": "2025-01-22",
      "due_time": null,
      "confidence_score": 1.0,
      "source_text": "Week 2 (Jan 22): Assignment 1 Due - Client Memo"
    }
  ],
  "count": 1
}
```

**Event Types:**

- `assignment` - Homework, papers, reports
- `exam` - Tests, finals, midterms
- `reading` - Required readings, chapters
- `other` - Other time-sensitive items

## Frontend API

### Endpoint: `POST /api/calendar`

Same interface as backend but with authentication required.

## Usage Examples

### 1. Using the Test Component

Navigate to `/test-calendar` to use the interactive test interface:

```typescript
import CalendarExtractionTest from "@/components/CalendarExtractionTest";

export default function TestPage() {
  return <CalendarExtractionTest />;
}
```

### 2. Programmatic Usage

```typescript
import { extractCalendarEvents } from "@/utils/calendarExtraction";

const syllabusContent = "Week 1 (Jan 15): Introduction...";
const result = await extractCalendarEvents(syllabusContent);

console.log(`Extracted ${result.count} events`);
result.events.forEach((event) => {
  console.log(`${event.title} - ${event.due_date}`);
});
```

### 3. Direct API Call

```typescript
const response = await fetch("/api/calendar", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    pdf_context: "Your syllabus content here...",
  }),
});

const data = await response.json();
```

## Environment Variables

### Backend

- `GEMINI_API_KEY` - Google Gemini API key
- `PORT` - Server port (default: 3001)

### Frontend

- `BACKEND_URL` - Backend server URL (default: http://localhost:3001)
- `NEXT_PUBLIC_GEMINI_API_KEY` - Gemini API key for direct frontend calls

## Features

- **AI-Powered Extraction** - Uses Google Gemini AI for intelligent text analysis
- **Date Parsing** - Handles various date formats (MM/DD, Month DD, etc.)
- **Event Classification** - Automatically categorizes events by type
- **Confidence Scoring** - Provides confidence levels for extraction quality
- **Source Tracking** - Includes original text snippets for verification
- **Authentication** - Secure access through Supabase authentication

## Error Handling

The API returns appropriate HTTP status codes:

- `400` - Missing required fields
- `401` - Unauthorized (frontend only)
- `500` - Internal server error or AI processing failure

## Testing

1. Start the backend server: `cd backend && npm start`
2. Start the frontend server: `cd frontend && npm run dev`
3. Navigate to `http://localhost:3000/test-calendar`
4. Paste syllabus content and test extraction

## Integration

The calendar extraction can be integrated into existing syllabus processing workflows by:

1. Extracting text from uploaded PDFs
2. Calling the calendar extraction API
3. Saving extracted events to the database
4. Displaying events in calendar views
