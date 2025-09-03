"use client";

import React, { use, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

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

export default function SyllabusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = use(params);

  useEffect(() => {
    getSyllabus(id.id);
  }, [id]);
  return <div className="min-h-screen bg-gray-50"> </div>;
}
