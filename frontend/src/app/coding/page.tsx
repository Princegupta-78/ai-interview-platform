"use client";

import { useState } from "react";
import Link from "next/link";

export default function CodingPage() {
  const [role, setRole] = useState("");
  const [question, setQuestion] = useState("");
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const generateQuestion = async () => {
    if (!role) return alert("Please enter a role first!");
    setLoading(true);
    setQuestion("");
    setFeedback("");
    try {
      const response = await fetch(`https://ai-interview-platform-vlvl.onrender.com/generate-coding-question?role=${role}`);
      const data = await response.json();
      setQuestion(data.question);
    } catch (error) {
      console.error(error);
      alert("Failed to generate question.");
    }
    setLoading(false);
  };

  const evaluateCode = async () => {
    if (!code) return alert("Please write some code first!");
    setEvaluating(true);
    try {
      const response = await fetch("https://ai-interview-platform-vlvl.onrender.com/evaluate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, code }),
      });
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error(error);
      alert("Failed to evaluate code.");
    }
    setEvaluating(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold">AI Coding Interview</h1>
          <Link href="/dashboard" className="bg-zinc-900 border border-zinc-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors">
            ← Dashboard
          </Link>
        </div>

        {/* Generator Controls */}
        <div className="flex gap-4 mb-8">
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Target Role (e.g. SDE Intern)"
            className="flex-1 bg-zinc-900 border border-zinc-700 p-4 rounded-xl outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={generateQuestion}
            disabled={loading}
            className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Generating..." : "Generate Question"}
          </button>
        </div>

        {/* The Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Problem */}
          <div className="space-y-6">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 min-h-[400px]">
              <h2 className="text-xl font-bold text-zinc-400 mb-4">Problem Statement</h2>
              {question ? (
                <div className="whitespace-pre-wrap leading-relaxed text-zinc-200 font-mono text-sm bg-black/50 p-4 rounded-xl border border-zinc-800/50">
                  {question}
                </div>
              ) : (
                <p className="text-zinc-600 italic">Enter a role and generate a question to begin...</p>
              )}
            </div>

            {/* AI Feedback Box */}
            {feedback && (
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-700">
                <h2 className="text-xl font-bold text-blue-400 mb-4">AI Code Review</h2>
                <div className="whitespace-pre-wrap leading-relaxed text-zinc-300 font-mono text-sm bg-black p-4 rounded-xl border border-zinc-800">
                  {feedback}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Code Editor */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-zinc-400 mb-4 px-2">Solution Editor</h2>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Write your optimized solution here..."
              className="w-full flex-1 min-h-[500px] bg-zinc-900 border border-zinc-700 p-6 rounded-2xl font-mono text-sm outline-none focus:border-green-500 transition-colors text-zinc-200"
              spellCheck="false"
            />
            <button
              onClick={evaluateCode}
              disabled={evaluating || !question}
              className="mt-6 bg-green-600 px-6 py-4 rounded-xl font-bold hover:bg-green-500 transition-colors disabled:opacity-50"
            >
              {evaluating ? "Running Test Cases..." : "Submit Solution"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}