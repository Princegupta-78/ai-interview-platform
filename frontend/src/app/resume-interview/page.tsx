"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResumeInterviewPage() {
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    if (!file) {
      alert("⚠️ Please upload a resume first!");
      return;
    }

    setLoading(true);
    setQuestions(""); // Clear previous results

    try {
      // 1. Send PDF to extraction endpoint
      const formData = new FormData();
      formData.append("file", file);

      const analysisResponse = await fetch("https://ai-interview-platform-vlvl.onrender.com/analyze-resume", {
        method: "POST",
        body: formData,
      });
      
      if (!analysisResponse.ok) throw new Error("Failed to extract resume text");
      const analysisData = await analysisResponse.json();

      // 2. Send extracted text to interview generator
      const response = await fetch("https://ai-interview-platform-vlvl.onrender.com/resume-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: analysisData.analysis,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate questions");
      const data = await response.json();

      setQuestions(data.questions);
    } catch (error) {
      console.error(error);
      alert("❌ An error occurred while generating your interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Tailored Interview
            </h1>
            <p className="text-zinc-400 mt-2">Generate a custom interview loop based on your exact resume experience.</p>
          </div>
          <Link href="/dashboard" className="bg-zinc-900 border border-zinc-800 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-zinc-800 transition-colors">
            Back to Dashboard
          </Link>
        </div>

        {/* Upload Card */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-zinc-400 mb-2">Upload Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-zinc-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-900/30 file:text-indigo-400 hover:file:bg-indigo-900/50 transition-all cursor-pointer border border-zinc-800 rounded-xl bg-black"
            />
          </div>
          
          <button
            onClick={generateQuestions}
            disabled={loading}
            className={`px-8 py-3.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              loading ? "bg-indigo-800 text-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20"
            }`}
          >
            {loading ? "⏳ Analyzing..." : "✨ Generate Questions"}
          </button>
        </div>

        {/* Results Area */}
        {questions && (
          <div className="bg-black border border-zinc-800 p-8 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 text-zinc-100 border-b border-zinc-800 pb-4">Your Custom Interview Loop</h2>
            <div className="prose prose-invert max-w-none text-zinc-300">
              <pre className="font-sans whitespace-pre-wrap text-base leading-relaxed bg-transparent p-0 m-0 border-0">
                {questions}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}