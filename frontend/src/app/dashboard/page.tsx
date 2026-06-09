"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function DashboardPage() {
  const router = useRouter(); 
  
  // 1. Update state to match the new real backend data
  const [analytics, setAnalytics] = useState({
    total_interviews: 0,
    average_score: 0,
    highest_score: 0,
    lowest_score: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ai-interview-platform-vlvl.onrender.com/analytics")
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to fetch analytics:", err));
  }, []);

  if (loading) {
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

        {/* REAL Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
            <p className="text-gray-400 mb-2 font-medium">Total Interviews</p>
            <h2 className="text-4xl font-bold">{analytics.total_interviews}</h2>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
            <p className="text-gray-400 mb-2 font-medium">Average Score</p>
            <h2 className="text-4xl font-bold text-blue-400">{analytics.average_score}%</h2>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
            <p className="text-gray-400 mb-2 font-medium">Highest Score</p>
            <h2 className="text-4xl font-bold text-green-400">{analytics.highest_score}%</h2>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
            <p className="text-gray-400 mb-2 font-medium">Lowest Score</p>
            <h2 className="text-4xl font-bold text-red-400">{analytics.lowest_score}%</h2>
          </div>
        </div>

        {/* Interactive Tools Section */}
        <h2 className="text-3xl font-bold mb-6">Preparation Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
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

      </div>
    </div>
  );
}