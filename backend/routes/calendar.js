const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Extract calendar events from syllabus content
router.post("/extract-events", async (req, res) => {
  try {
    const { pdf_context } = req.body;

    // Validate required fields
    if (!pdf_context) {
      return res.status(400).json({
        error: "Missing required field: pdf_context",
      });
    }

    // Create Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prompt for extracting calendar events
    const prompt = `
You are an expert at extracting calendar events from academic syllabi. Given the following syllabus content, extract all assignments, readings, exams, and other important dates.

Please return a JSON array of calendar events with the following structure for each event:
{
  "title": "Event title (e.g., 'Assignment 1 Due', 'Midterm Exam', 'Reading: Chapter 5')",
  "description": "Brief description of the event",
  "event_type": "assignment|exam|reading|other",
  "due_date": "YYYY-MM-DD format",
  "due_time": "HH:MM format (optional, use null if not specified)",
  "confidence_score": 0.0-1.0 (how confident you are about this extraction),
  "source_text": "The exact text from the syllabus that led to this extraction"
}

Guidelines:
- Look for dates in various formats (MM/DD, MM/DD/YYYY, Month DD, etc.) and convert to YYYY-MM-DD
- If no year is specified, assume current academic year
- For assignments, use event_type "assignment"
- For exams/tests/quizzes, use event_type "exam"
- For readings, use event_type "reading"
- For other events, use event_type "other"
- Include the exact text from the syllabus in source_text
- Set confidence_score based on how clear the date and event information is

Syllabus content:
${pdf_context}

Return only the JSON array, no additional text.
`;

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let events;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        events = JSON.parse(jsonMatch[0]);
      } else {
        events = JSON.parse(text);
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      console.error("Raw response:", text);
      return res.status(500).json({
        error: "Failed to parse AI response",
        details: parseError.message,
      });
    }

    // Validate events structure
    if (!Array.isArray(events)) {
      return res.status(500).json({
        error: "AI response is not an array of events",
      });
    }

    res.json({
      message: "Calendar events extracted successfully",
      events,
      count: events.length,
    });
  } catch (error) {
    console.error("Calendar events extraction error:", error);
    res.status(500).json({
      error: "Failed to extract calendar events",
      details: error.message,
    });
  }
});

// Get calendar events for a user
router.get("/events/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { class_id, event_type, start_date, end_date } = req.query;

    let query = supabase
      .from("calendar_events")
      .select(
        `
        *,
        classes (
          name,
          code,
          instructor
        )
      `
      )
      .eq("user_id", user_id);

    // Apply filters
    if (class_id) {
      query = query.eq("class_id", class_id);
    }
    if (event_type) {
      query = query.eq("event_type", event_type);
    }
    if (start_date) {
      query = query.gte("due_date", start_date);
    }
    if (end_date) {
      query = query.lte("due_date", end_date);
    }

    const { data: events, error } = await query.order("due_date", {
      ascending: true,
    });

    if (error) {
      console.error("Supabase query error:", error);
      return res.status(500).json({
        error: "Failed to fetch calendar events",
        details: error.message,
      });
    }

    res.json({
      events,
      count: events.length,
    });
  } catch (error) {
    console.error("Get calendar events error:", error);
    res.status(500).json({
      error: "Failed to fetch calendar events",
      details: error.message,
    });
  }
});

// Delete calendar events for a syllabus
router.delete("/events/syllabus/:syllabus_id", async (req, res) => {
  try {
    const { syllabus_id } = req.params;

    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq("syllabus_id", syllabus_id);

    if (error) {
      console.error("Supabase delete error:", error);
      return res.status(500).json({
        error: "Failed to delete calendar events",
        details: error.message,
      });
    }

    res.json({
      message: "Calendar events deleted successfully",
      syllabus_id,
    });
  } catch (error) {
    console.error("Delete calendar events error:", error);
    res.status(500).json({
      error: "Failed to delete calendar events",
      details: error.message,
    });
  }
});

// Update calendar event
router.put("/events/:event_id", async (req, res) => {
  try {
    const { event_id } = req.params;
    const updateData = req.body;

    const { data: updatedEvent, error } = await supabase
      .from("calendar_events")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", event_id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return res.status(500).json({
        error: "Failed to update calendar event",
        details: error.message,
      });
    }

    res.json({
      message: "Calendar event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update calendar event error:", error);
    res.status(500).json({
      error: "Failed to update calendar event",
      details: error.message,
    });
  }
});

module.exports = router;
