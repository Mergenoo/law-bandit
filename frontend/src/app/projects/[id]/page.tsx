"use client";

import React, { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Syllabus, CalendarEvent } from "@/types/database";

const getSyllabus = async (id: string) => {
  const supabase = createClient();
  const { data: syllabus, error } = await supabase
    .from("syllabi")
    .select("*")
    .eq("class_id", id);

  if (error) {
    console.error("Error fetching syllabus:", error);
    throw new Error("Error fetching syllabus:", error);
  }

  return { syllabus, error };
};

const getCalendarEvents = async (classId: string) => {
  const supabase = createClient();
  const { data: events, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("class_id", classId)
    .order("due_date", { ascending: true });

  if (error) {
    console.error("Error fetching calendar events:", error);
    throw new Error("Error fetching calendar events");
  }

  return { events, error };
};

const getBucketUrl = async (path: string) => {
  const supabase = createClient();
  console.log("File path:", path);

  if (!path) {
    throw new Error("No file path provided");
  }

  // Try to get a signed URL instead of public URL for better compatibility
  const { data, error } = await supabase.storage
    .from("syllabi")
    .createSignedUrl(path, 3600); // 1 hour expiry

  if (error) {
    console.error("Error creating signed URL:", error);
    throw new Error("Error creating signed URL");
  }

  console.log("Signed URL response:", data);
  return data.signedUrl;
};

export default function SyllabusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = use(params);
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (classId: string) => {
      try {
        setLoading(true);
        setError(null);

        // Fetch syllabus data
        const { syllabus, error: syllabusError } = await getSyllabus(classId);
        console.log("Syllabus data:", syllabus);

        if (syllabusError) {
          console.error("Error fetching syllabus:", syllabusError);
          setError("Failed to fetch syllabus data");
          return;
        }

        if (!syllabus || syllabus.length === 0) {
          setError("No syllabus found for this class");
          return;
        }

        const syllabusData = syllabus[0];
        setSyllabus(syllabusData);

        // Fetch calendar events
        const { events, error: eventsError } = await getCalendarEvents(classId);
        console.log("Calendar events:", events);

        if (eventsError) {
          console.error("Error fetching calendar events:", eventsError);
          // Don't fail completely if events fail to load
          setEvents([]);
        } else {
          setEvents(events || []);
        }

      } catch (err) {
        console.error("Error in fetchData:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData(id.id.toString());
  }, [id.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-black">Loading calendar events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Error: {error}</div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {bucketUrl ? (
        <div className="h-screen flex flex-col">
          <div className="flex-1">
            <iframe
              src={bucketUrl}
              title="Syllabus"
              width="100%"
              height="100%"
              className="border-0"
              onError={(e) => {
                console.error("Iframe error:", e);
                setError(
                  "Failed to load PDF in browser. Try downloading instead."
                );
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">No syllabus file available</div>
        </div>
      )}
    </div>
  );
}
