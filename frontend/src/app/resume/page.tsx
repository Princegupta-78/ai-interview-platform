"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {
    if (!file) {
      return alert("Please upload a PDF resume");
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error(error);
      alert("Resume analysis failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold">AI Resume Analyzer</h1>
          <Link 
            href="/dashboard" 
            className="bg-zinc-900 border border-zinc-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Upload Box */}
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
          <p className="text-zinc-400 mb-6">Upload your latest PDF resume to get instant, AI-driven feedback and role suggestions based on your extracted text.</p>
          
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                }
              }}
              className="block w-full text-sm text-zinc-400
                file:mr-4 file:py-3 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-600 file:text-white
                hover:file:bg-indigo-500 file:cursor-pointer file:transition-colors
                bg-black border border-zinc-800 rounded-lg p-2"
            />

            <button
              onClick={uploadResume}
              disabled={loading}
              className="bg-white text-black px-6 py-4 rounded-lg font-bold hover:bg-gray-300 disabled:opacity-50 whitespace-nowrap transition-colors"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>
        </div>

        {/* AI Analysis Output */}
        {analysis && (
          <div className="mt-8 bg-zinc-950 p-8 rounded-2xl border border-zinc-800">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Diagnostics Complete</h2>
            <div className="whitespace-pre-wrap leading-relaxed text-zinc-300 font-mono text-sm bg-black/50 border border-zinc-800/50 p-6 rounded-xl">
              {analysis}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}