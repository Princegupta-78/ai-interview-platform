"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/interview-history");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Failed to compile historic evaluation metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Heading Panel */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-2">Interview History</h1>
            <p className="text-zinc-400">Review your past performance milestones and AI architectural assessments.</p>
          </div>
          <Link 
            href="/interview" 
            className="bg-zinc-900 border border-zinc-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            ← Back to Interview
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-zinc-500 py-12">Compiling performance timeline history...</div>
        ) : history.length === 0 ? (
          <div className="text-center bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-zinc-400">
            No interview sessions found in the database. Complete a question assessment loop to generate analytics data.
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((session) => (
              <div 
                key={session.id} 
                className="bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-2xl hover:border-zinc-700/50 transition-all duration-200"
              >
                {/* Session Identification Flag */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-950/40 text-blue-400 border border-blue-900/50 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
                    {session.role}
                  </span>
                  <span className="text-zinc-600 text-xs font-mono">ID: #{session.id}</span>
                </div>

                {/* Content Block Grid */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">Question</h3>
                    <p className="text-lg text-zinc-200 leading-relaxed">{session.question}</p>
                  </div>

                  <div className="border-t border-zinc-800/50 pt-4">
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">Your Spoken Answer</h3>
                    <p className="text-zinc-300 italic font-medium bg-black/40 border border-zinc-800/40 p-4 rounded-xl leading-relaxed">
                      "{session.answer}"
                    </p>
                  </div>

                  <div className="border-t border-zinc-800/50 pt-4 bg-zinc-950/40 -mx-8 -mb-8 p-8 rounded-b-2xl border-t border-zinc-800/60">
                    <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">AI Diagnostic Evaluation</h3>
                    <p className="whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed font-mono bg-black/30 border border-zinc-800/30 p-4 rounded-xl">
                      {session.feedback}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}