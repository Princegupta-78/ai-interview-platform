"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // NEW: Required for the card navigation

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const router = useRouter(); // NEW: Initialize router

  useEffect(() => {
    fetch("http://127.0.0.1:8000/analytics")
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch((err) => console.error("Failed to fetch analytics:", err));
  }, []);

  if (!analytics) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl text-zinc-400 animate-pulse">Loading Analytics Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold">Analytics Dashboard</h1>
          
          {/* Top Navigation Button Group */}
          <div className="flex gap-4">
            <Link 
              href="/practice" 
              className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              💻 Coding Practice
            </Link>
            
            <Link 
              href="/interview" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              + New Interview
            </Link>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
            <p className="text-gray-400 mb-2 font-medium">Total Interviews</p>
            <h2 className="text-4xl font-bold">{analytics.total_interviews}</h2>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
            <p className="text-gray-400 mb-2 font-medium">Average Score</p>
            <h2 className="text-4xl font-bold">{analytics.average_score}%</h2>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
            <p className="text-gray-400 mb-2 font-medium">Confidence Level</p>
            <h2 className="text-3xl font-bold text-green-400">{analytics.confidence}</h2>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
            <p className="text-gray-400 mb-2 font-medium">Strongest Skill</p>
            <h2 className="text-3xl font-bold text-blue-400">{analytics.strongest_skill}</h2>
          </div>
        </div>

        {/* NEW: Interactive Tools Section */}
        <h2 className="text-3xl font-bold mb-6">Preparation Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Day 27-28: Resume Interview Card */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-indigo-500 transition-colors flex flex-col items-start">
            <span className="text-4xl mb-4">📄</span>
            <h2 className="text-xl font-bold mb-2">Resume Interview</h2>
            <p className="text-zinc-400 text-sm mb-6 flex-1">Generate a custom technical and behavioral interview loop based entirely on your uploaded resume.</p>
            <button
              onClick={() => router.push("/resume-interview")}
              className="w-full bg-indigo-600/20 text-indigo-400 font-bold py-2.5 rounded-xl border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all"
            >
              Start Custom Loop
            </button>
          </div>

          {/* Standard Mock Interview Card */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-blue-500 transition-colors flex flex-col items-start">
            <span className="text-4xl mb-4">🤖</span>
            <h2 className="text-xl font-bold mb-2">Standard Mock AI</h2>
            <p className="text-zinc-400 text-sm mb-6 flex-1">Practice standard technical and behavioral questions for your desired target role.</p>
            <button
              onClick={() => router.push("/interview")}
              className="w-full bg-blue-600/20 text-blue-400 font-bold py-2.5 rounded-xl border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all"
            >
              Start Standard Loop
            </button>
          </div>

          {/* OA Simulator Card */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-green-500 transition-colors flex flex-col items-start">
            <span className="text-4xl mb-4">💻</span>
            <h2 className="text-xl font-bold mb-2">OA Simulator</h2>
            <p className="text-zinc-400 text-sm mb-6 flex-1">Practice real-world coding assessment scenarios with our custom sandboxed C++ compiler.</p>
            <button
              onClick={() => router.push("/practice")}
              className="w-full bg-green-600/20 text-green-400 font-bold py-2.5 rounded-xl border border-green-500/30 hover:bg-green-600 hover:text-white transition-all"
            >
              Enter Sandbox
            </button>
          </div>

        </div>

        {/* Actionable Insights */}
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Targeted Improvement</h2>
            <p className="text-lg text-gray-300">
              Based on recent AI evaluations, focus your preparation on:
              <span className="text-red-400 font-bold ml-3 text-xl bg-red-950/30 px-3 py-1 rounded-lg border border-red-900/50">
                {analytics.weakest_skill}
              </span>
            </p>
          </div>
          <Link 
            href="/history" 
            className="text-zinc-400 hover:text-white underline decoration-zinc-700 underline-offset-4 transition-colors whitespace-nowrap ml-6"
          >
            Review Past Feedback →
          </Link>
        </div>

      </div>
    </div>
  );
}