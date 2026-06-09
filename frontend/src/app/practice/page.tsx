"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// --- PROBLEM BANK ---
const questions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Read a sequence of integers and a target value. Print the indices of the two numbers that add up to the target.\n\nInput format:\nLine 1: Space-separated integers (the array)\nLine 2: The target integer\n\nOutput format:\nSpace-separated indices.",
    example: "Input:\n2 7 11 15\n9\n\nOutput:\n0 1",
    testCases: [
      { input: "2 7 11 15\n9\n", output: "0 1" },
      { input: "3 2 4\n6\n", output: "1 2" }
    ]
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Read a string and print the length of the longest substring without repeating characters.",
    example: "Input:\nabcabcbb\n\nOutput:\n3",
    testCases: [
      { input: "abcabcbb\n", output: "3" },
      { input: "bbbbb\n", output: "1" }
    ]
  },
  {
    id: 3,
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    description: "Read k sorted arrays and print them merged as one sorted array.",
    example: "Input:\n[[1,4,5],[1,3,4],[2,6]]\n\nOutput:\n[1,1,2,3,4,4,5,6]",
    testCases: [
      { input: "[[1,4,5],[1,3,4],[2,6]]\n", output: "[1,1,2,3,4,4,5,6]" },
      { input: "[]\n", output: "[]" }
    ]
  },
];

export default function PracticePage() {
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  
  // Adjusted default code for standard IO testing
  const [code, setCode] = useState(`#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}`);
  
  // --- STATE ---
  const [solvedQuestions, setSolvedQuestions] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [runResult, setRunResult] = useState("");
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes

  // Load from Local Storage
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("solvedQuestions");
    if (saved) setSolvedQuestions(JSON.parse(saved));
  }, []);

  // Save to Local Storage
  useEffect(() => {
    if (isMounted) localStorage.setItem("solvedQuestions", JSON.stringify(solvedQuestions));
  }, [solvedQuestions, isMounted]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Clear output on question change
  useEffect(() => {
    setRunResult("");
  }, [selectedQuestion.id]);

  // --- STATISTICS ---
  const progress = (solvedQuestions.length / questions.length) * 100;
  const easySolved = questions.filter((q) => q.difficulty === "Easy" && solvedQuestions.includes(q.id)).length;
  const mediumSolved = questions.filter((q) => q.difficulty === "Medium" && solvedQuestions.includes(q.id)).length;
  const hardSolved = questions.filter((q) => q.difficulty === "Hard" && solvedQuestions.includes(q.id)).length;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // --- REAL BACKEND COMPILER CALL ---
  const handleRunCode = async () => {
    setRunResult("⏳ Compiling and running on secure server...");
    
    try {
      const response = await fetch("https://ai-interview-platform-vlvl.onrender.com/code/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem_id: selectedQuestion.id,
          code: code,
        }),
      });

      if (!response.ok) throw new Error("Backend not responding");

      const result = await response.json();
      setRunResult(result.message);
      
    } catch (error) {
      console.error("Evaluation Error:", error);
      setRunResult("❌ Server Error: Could not reach FastAPI backend.");
    }
  };

  // --- VALIDATED SUBMISSION ---
  const handleSubmit = () => {
    if (runResult.includes("✅")) {
      if (!solvedQuestions.includes(selectedQuestion.id)) {
        setSolvedQuestions([...solvedQuestions, selectedQuestion.id]);
      }
      alert("Solution Submitted Successfully!");
    } else {
      alert("⚠️ Pass all test cases first!");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Timer */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">OA Simulator</h1>
          <div className="flex gap-4 items-center">
            <div className="bg-red-950/40 border border-red-900/50 text-red-400 px-5 py-2.5 rounded-xl flex items-center gap-2 font-mono text-lg font-bold">
              <span className="animate-pulse">⏱</span> 
              {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
            </div>
            <Link href="/dashboard" className="bg-zinc-900 border border-zinc-800 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-zinc-800 transition-colors">
              End Assessment
            </Link>
          </div>
        </div>

        {/* Dashboards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-2xl font-bold text-zinc-100">Assessment Score</h2>
              <span className="text-3xl font-bold text-indigo-400">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-black rounded-full h-4 border border-zinc-700 overflow-hidden">
              <div className="bg-indigo-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-zinc-400 mt-3 font-medium">
              Passed: <span className="text-white">{solvedQuestions.length}</span> / {questions.length} problems
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <h2 className="text-xl font-bold mb-4 text-zinc-100">Difficulty Breakdown</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black p-4 rounded-xl border border-zinc-800 text-center">
                <p className="text-green-400 font-bold mb-1">Easy</p>
                <p className="text-2xl font-bold">{easySolved}</p>
              </div>
              <div className="bg-black p-4 rounded-xl border border-zinc-800 text-center">
                <p className="text-yellow-400 font-bold mb-1">Medium</p>
                <p className="text-2xl font-bold">{mediumSolved}</p>
              </div>
              <div className="bg-black p-4 rounded-xl border border-zinc-800 text-center">
                <p className="text-red-400 font-bold mb-1">Hard</p>
                <p className="text-2xl font-bold">{hardSolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Questions */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 h-fit">
            <h2 className="text-xl font-bold mb-4 text-zinc-300">Problem List</h2>
            <div className="space-y-3">
              {questions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestion(q)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    selectedQuestion.id === q.id ? "bg-zinc-800 border-indigo-500" : "bg-black border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-zinc-200">{q.title}</p>
                    {solvedQuestions.includes(q.id) && <span className="text-green-400 ml-2">✅</span>}
                  </div>
                  <p className={`text-sm mt-1 font-medium ${q.difficulty === "Easy" ? "text-green-400" : q.difficulty === "Medium" ? "text-yellow-400" : "text-red-400"}`}>{q.difficulty}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Problem Description */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col h-fit">
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-zinc-100">{selectedQuestion.title}</h2>
                {solvedQuestions.includes(selectedQuestion.id) && (
                  <span className="bg-green-900/40 text-green-400 border border-green-800 px-3 py-1 rounded-full text-xs font-bold">Solved</span>
                )}
              </div>
              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold border ${selectedQuestion.difficulty === "Easy" ? "bg-green-950/30 text-green-400 border-green-900/50" : selectedQuestion.difficulty === "Medium" ? "bg-yellow-950/30 text-yellow-400 border-yellow-900/50" : "bg-red-950/30 text-red-400 border-red-900/50"}`}>{selectedQuestion.difficulty}</span>
            </div>

            <div className="flex-1">
              <p className="text-gray-300 leading-relaxed text-sm lg:text-base whitespace-pre-wrap">{selectedQuestion.description}</p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3 text-zinc-300 border-b border-zinc-800 pb-2">Sample Test Cases</h3>
              <div className="space-y-4">
                {selectedQuestion.testCases?.map((tc, idx) => (
                  <div key={idx} className="bg-black p-4 rounded-xl border border-zinc-800 font-mono text-sm">
                    <p className="text-zinc-400 mb-1">Input:</p>
                    <p className="text-zinc-200 mb-3 whitespace-pre-wrap">{tc.input}</p>
                    <p className="text-zinc-400 mb-1">Expected Output:</p>
                    <p className="text-indigo-300 whitespace-pre-wrap">{tc.output}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Editor */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-zinc-300">Editor</h2>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[350px] bg-black text-green-400 p-5 rounded-xl border border-zinc-800 outline-none font-mono text-sm focus:border-indigo-500 transition-colors resize-none"
              spellCheck="false"
            />

            <div className="flex gap-4 mt-6 mb-4">
              <button onClick={handleRunCode} className="flex-1 bg-zinc-800 border border-zinc-700 text-white px-6 py-3 rounded-xl hover:bg-zinc-700 font-semibold transition-colors">
                Run Code
              </button>
              <button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                Submit
              </button>
            </div>

            {/* Output Console */}
            {runResult && (
              <div className="mt-2 bg-black p-4 rounded-xl border border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="font-bold text-zinc-400 mb-2 text-sm uppercase tracking-wider">Console Output</h3>
                <p className={`font-mono text-sm whitespace-pre-wrap ${runResult.includes("✅") ? "text-green-400" : runResult.includes("⏳") ? "text-yellow-400" : "text-red-400"}`}>
                  {runResult}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}