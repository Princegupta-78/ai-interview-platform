"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from 'react-markdown';

export default function PracticePage() {
  // New AI Generation State
  const [role, setRole] = useState("Software Development Engineer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [generating, setGenerating] = useState(false);
  
  // Existing Coding State
  const [questionText, setQuestionText] = useState("Configure your role and difficulty above to generate a custom OA question.");
  const [code, setCode] = useState('// Write your C++ solution here\n#include <iostream>\n\nint main() {\n    return 0;\n}');
  const [feedback, setFeedback] = useState("");
  const [evaluating, setEvaluating] = useState(false);

  // Function to call our new AI route
  const generateQuestion = async () => {
    setGenerating(true);
    setQuestionText("Generating a custom scenario...");
    setFeedback("");
    try {
      const response = await fetch(`https://ai-interview-platform-vlvl.onrender.com/generate-oa-question?role=${encodeURIComponent(role)}&difficulty=${encodeURIComponent(difficulty)}`);
      const data = await response.json();
      
      if (data.question) {
        setQuestionText(data.question);
      } else {
        setQuestionText("Failed to generate question. Please try again.");
      }
    } catch (error) {
      console.error("Error generating question:", error);
      setQuestionText("An error occurred while connecting to the AI.");
    } finally {
      setGenerating(false);
    }
  };

  // Existing Evaluation Function
  const submitCode = async () => {
    setEvaluating(true);
    setFeedback("Analyzing your code complexity and correctness...");
    
    try {
      const response = await fetch("https://ai-interview-platform-vlvl.onrender.com/evaluate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText, code: code }),
      });
      
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error("Error evaluating code:", error);
      setFeedback("Failed to evaluate code. Please ensure the backend is running.");
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-6">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Panel: Configuration & Question */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col h-[80vh]">
          <h2 className="text-2xl font-bold mb-4">OA Simulator</h2>
          
          {/* AI Configuration Controls */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Target Role</label>
              <input 
                type="text" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white outline-none focus:border-indigo-500"
                placeholder="e.g., Frontend Intern"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Difficulty</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white outline-none focus:border-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <button 
            onClick={generateQuestion}
            disabled={generating}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg mb-6 transition-colors disabled:opacity-50"
          >
            {generating ? "Initializing AI..." : "Generate Custom OA"}
          </button>

          {/* Question Display Area */}
          <div className="flex-1 overflow-y-auto bg-black p-4 rounded-lg border border-zinc-800 text-zinc-300 prose prose-invert max-w-none">
            <ReactMarkdown>{questionText}</ReactMarkdown>
          </div>
        </div>

        {/* Right Panel: Editor & Feedback */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col h-[80vh]">
          <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
            <span>C++ Sandbox</span>
            <button 
              onClick={submitCode}
              disabled={evaluating || questionText.includes("Configure your role")}
              className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {evaluating ? "Evaluating..." : "Submit Code"}
            </button>
          </h2>

          <div className="flex-1 rounded-lg overflow-hidden border border-zinc-800 mb-4">
            <Editor
              height="100%"
              defaultLanguage="cpp"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>

          {/* Feedback Display */}
          {feedback && (
             <div className="h-1/3 overflow-y-auto bg-black p-4 rounded-lg border border-zinc-800 text-zinc-300 prose prose-invert max-w-none">
                <ReactMarkdown>{feedback}</ReactMarkdown>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}