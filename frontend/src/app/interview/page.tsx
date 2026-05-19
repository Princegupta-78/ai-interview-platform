"use client";

import { useState } from "react";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);

  const generateInterview = async () => {
    if (!role) return alert("Please enter a role first!");
    
    setLoading(true);
    
    try {
      // 1. Frontend sends a network request to your FastAPI backend
      const response = await fetch(
        `http://127.0.0.1:8000/generate-questions?role=${role}`
      );
      const data = await response.json();

      if (data.error) {
        alert(`Backend Error: ${data.error}`);
        setLoading(false);
        return; 
      }
      // 2. Parse the text from Gemini into a clean array
      const parsedQuestions = data.questions
        .split("\n")
        .filter((q: string) => q.trim() !== "");

      // 3. Update the UI state
      setQuestions(parsedQuestions);
      setStarted(true);
      
    } catch (error) {
      console.error("Error fetching AI questions:", error);
      alert("Failed to connect to the AI engine.");
    }
    
    setLoading(false);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert("Interview Completed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      {!started ? (
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h1 className="text-5xl font-bold mb-8">
            AI Interview Generator
          </h1>

          <input
            type="text"
            placeholder="Enter Role (e.g. Frontend Developer)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl w-[400px] mb-6 outline-none focus:border-gray-500 transition-colors"
          />

          <button
            onClick={generateInterview}
            disabled={loading}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 transition-all"
          >
            {loading ? "Generating AI Questions..." : "Generate Interview"}
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold mb-8">
            Question {currentQuestion + 1}
          </h2>

          <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
            <p className="text-2xl">
              {questions[currentQuestion]}
            </p>
          </div>

          <button
            onClick={nextQuestion}
            className="mt-8 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}