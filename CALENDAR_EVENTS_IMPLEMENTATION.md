# Calendar Events Extractor Implementation

This document describes the complete implementation of the calendar events extractor for the Law Bandit application.

## Overview

The calendar events extractor automatically processes academic syllabi to extract assignments, readings, exams, and other important dates, converting them into calendar events stored in Supabase. It uses Google Gemini AI for intelligent extraction and provides a RESTful API for frontend integration.

## Architecture

```
Frontend (Next.js) → Backend API (Express) → Gemini AI → Supabase Database
```

## Components

### 1. Backend API (`/backend/`)

#### Dependencies Added:

- `@supabase/supabase-js`: Supabase client for database operations
- `@google/generative-ai`: Google Gemini AI for content processing
- `axios`: HTTP client for testing (dev dependency)

#### Key Files:

- `routes/calendar.js`: Main calendar events API endpoints
- `utils/dateUtils.js`: Date parsing and event processing utilities
- `test-calendar-api.js`: Test script for API validation
- `README_CALENDAR_API.md`: Complete API documentation

#### API Endpoints:

- `POST /api/calendar/extract-events`: Extract events from syllabus content
- `GET /api/calendar/events/:user_id`: Retrieve events with filtering
- `PUT /api/calendar/events/:event_id`: Update individual events
- `DELETE /api/calendar/events/syllabus/:syllabus_id`: Delete events for a syllabus

### 2. Frontend Integration (`/frontend/`)

#### Key Files:

- `src/utils/calendar-api.ts`: Frontend API integration functions
- `src/types/database.ts`: TypeScript types for calendar events

## Database Schema

The `calendar_events` table in Supabase includes:

```sql
calendar_events {
  id: string (primary key)
  syllabus_id: string (foreign key to syllabi)
  class_id: string (foreign key to classes)
  user_id: string (foreign key to users)
  title: string
  description: string | null
  event_type: string (assignment|exam|reading|other)
  due_date: string (YYYY-MM-DD)
  due_time: string | null (HH:MM)
  confidence_score: number (0.0-1.0)
  source_text: string | null (original syllabus text)
  extraction_method: string (gemini_ai)
  is_exported: boolean
  exported_at: string | null
  ics_uid: string | null
  created_at: string
  updated_at: string
}
```

## How It Works

### 1. Event Extraction Process

1. **Frontend sends syllabus data** to `/api/calendar/extract-events`
2. **Backend validates input** (syllabus_id, user_id, class_id, pdf_context)
3. **Gemini AI processes content** using a specialized prompt
4. **AI extracts structured events** with dates, titles, descriptions, and types
5. **Backend validates and transforms** the AI response
6. **Events are saved to Supabase** with metadata
7. **Syllabus status is updated** to "completed"

### 2. AI Prompt Strategy

The Gemini AI prompt is designed to:

- Extract dates in various formats (MM/DD, Month DD, etc.)
- Categorize events by type (assignment, exam, reading, other)
- Provide confidence scores for extraction quality
- Include source text for verification
- Handle academic year assumptions

### 3. Date Parsing

The system includes robust date parsing utilities that handle:

- Multiple date formats (MM/DD/YYYY, Month DD, etc.)
- Academic year assumptions
- Date validation
- Time extraction when available

## Usage Examples

### Backend Testing

```bash
cd backend
npm install
node test-calendar-api.js
```

### Frontend Integration

```typescript
import { extractCalendarEvents, getCalendarEvents } from "@/utils/calendar-api";

// Extract events from syllabus
const result = await extractCalendarEvents(
  "syllabus-uuid",
  "user-uuid",
  "class-uuid",
  "Syllabus content with dates and assignments..."
);

// Get user's events
const events = await getCalendarEvents("user-uuid", {
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  eventType: "assignment",
});
```

## Environment Variables

Required environment variables in `backend/.env`:

```env
GEMINI_API_KEY=your-gemini-api-key
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## Error Handling

The system includes comprehensive error handling:

- Input validation with descriptive error messages
- AI response parsing with fallback strategies
- Database operation error handling
- HTTP status codes for different error types

## Security Considerations

- API rate limiting (already configured in server.js)
- Input sanitization and validation
- Service role key for Supabase (server-side only)
- CORS configuration for frontend access

## Future Enhancements

Potential improvements:

1. **Batch processing** for multiple syllabi
2. **Calendar export** (Google Calendar, iCal)
3. **Event notifications** and reminders
4. **Confidence score filtering** for low-quality extractions
5. **Manual event editing** interface
6. **Event recurrence** patterns
7. **Integration with external calendar APIs**

## Testing

The implementation includes:

- Unit tests for date parsing utilities
- Integration tests for API endpoints
- Frontend integration examples
- Error scenario testing

## Performance Considerations

- AI requests are processed asynchronously
- Database queries are optimized with proper indexing
- Response caching for frequently accessed data
- Pagination for large event lists

This implementation provides a robust foundation for automatic calendar event extraction from academic syllabi, with room for future enhancements and integrations.
