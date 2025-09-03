"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const uploadSyllabi = async (file: File) => {
  const supabase = createClient();
  const { data, error } = await supabase.from("syllabi").insert({
    file_path: file.name,
    file_type: file.type,
    file_size: file.size,
    processing_status: "pending",
    processing_error: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error uploading syllabus:", error);
    throw new Error("Error uploading syllabus:", error);
  }

  return { data, error };
};

export default function UploadNewSyllabi() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = (e.target as HTMLFormElement).syllabi.files?.[0];
    console.log(file);
    if (file) {
      uploadSyllabi(file);
    } else {
      console.error("No file selected");
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition-colors"
      >
        Upload New Syllabi
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h1 className="text-2xl font-bold text-gray-900">
              Upload New Syllabi
            </h1>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
            >
              Close
            </button>
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                name="syllabi"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition-colors"
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
