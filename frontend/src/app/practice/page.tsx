"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from 'react-markdown';

// ✅ PERFECT: Linked to your live Render backend!
const BACKEND_URL = "https://ai-interview-platform-vlvl.onrender.com";

export default function PracticePage() {
  // AI Generation State
  const [role, setRole] = useState("Software Development Engineer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [generating, setGenerating] = useState(false);
  
  // Coding State
  const [questionText, setQuestionText] = useState("Configure your role and difficulty above to generate a custom OA question.");
  const [code, setCode] = useState('// Your LeetCode-style starter code will appear here.');
  const [sampleTests, setSampleTests] = useState<{input: string, output: string}[]>([]);
  const [hiddenTests, setHiddenTests] = useState<{input: string, output: string}[]>([]);
  
  // Notice the updated hiddenResult state includes the 'failed' array
  const [hiddenResult, setHiddenResult] = useState<{passed: number, total: number, failed?: number[]} | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Execution & Evaluation State
  const [executionOutput, setExecutionOutput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [evaluating, setEvaluating] = useState(false);

  // --- 1. Generate AI Question ---
  const generateQuestion = async () => {
    setGenerating(true);
    setQuestionText("Generating a custom LeetCode-style scenario...");
    setFeedback("");
    setExecutionOutput("");
    setHiddenResult(null);
    setSampleTests([]);
    setHiddenTests([]);
    setCode("// Generating starter code...");
    
    try {
      const response = await fetch(`${BACKEND_URL}/generate-oa-question?role=${encodeURIComponent(role)}&difficulty=${encodeURIComponent(difficulty)}`);
      const data = await response.json();
      
      // Catch the API Quota Error from the backend!
      if (data.error) {
         setQuestionText(`**API Rate Limit Reached 🚦**\n\nYou've made too many requests in a short time. Please wait about 30 seconds and try clicking Generate again.\n\n*(Technical detail: ${data.error})*`);
         setCode("// Waiting for AI quota to reset...");
      }
      else if (data.question && data.starter_code) {
        setQuestionText(data.question);
        setCode(data.starter_code); 
        // Store the tests
        setSampleTests(data.sample_tests || []);
        setHiddenTests(data.hidden_tests || []);
      } else {
        setQuestionText("Failed to generate question. Please try again.");
        setCode("// Error loading code.");
      }
    } catch (error) {
      console.error("Error generating question:", error);
      setQuestionText("An error occurred while connecting to the AI.");
    } finally {
      setGenerating(false);
    }
  };

  // --- 2. Run Real Hidden Tests ---
  const runHiddenTests = async () => {
    setIsRunningTests(true);
    setHiddenResult(null);
    
    try {
      const response = await fetch(`${BACKEND_URL}/run-hidden-tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code, hidden_tests: hiddenTests }),
      });
      
      const result = await response.json();
      setHiddenResult(result);
    } catch (error) {
      console.error("Error running tests:", error);
    } finally {
      setIsRunningTests(false);
    }
  };

  // --- 3. Evaluate Code via AI ---
  const submitCode = async () => {
    setEvaluating(true);
    setFeedback("Analyzing your code complexity and correctness...");
    
    try {
      const response = await fetch(`${BACKEND_URL}/evaluate-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText, code: code }),
      });
      
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error("Error evaluating code:", error);
      setFeedback("Failed to evaluate code.");
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-6">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Panel: Configuration & Question */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col h-[85vh]">
          <h2 className="text-2xl font-bold mb-4">OA Simulator</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Target Role</label>
              <input 
                type="text" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white outline-none focus:border-indigo-500"
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

          <div className="flex-1 overflow-y-auto bg-black p-4 rounded-lg border border-zinc-800 text-zinc-300 prose prose-invert max-w-none">
            <ReactMarkdown>{questionText}</ReactMarkdown>
            {sampleTests.length > 0 && (
              <div className="mt-8 border-t border-zinc-700 pt-6">
                <h3 className="text-xl font-bold text-white mb-4">Sample Test Cases</h3>
                {sampleTests.map((test, index) => (
                  <div key={index} className="bg-zinc-800 p-4 rounded-lg mb-4 font-mono text-sm shadow-md border border-zinc-700">
                    <div className="mb-2"><span className="text-indigo-400 font-bold">Input:</span> <span className="text-zinc-200">{test.input}</span></div>
                    <div><span className="text-green-400 font-bold">Output:</span> <span className="text-zinc-200">{test.output}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Editor, Output & Feedback */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col h-[85vh]">
          <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
            <span>C++ Sandbox</span>
            <div className="flex gap-2">
              <button 
                onClick={runHiddenTests}
                disabled={isRunningTests || hiddenTests.length === 0}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {isRunningTests ? "Running..." : "Run Hidden Tests"}
              </button>
              
              <button 
                onClick={submitCode}
                disabled={evaluating || questionText.includes("Configure your role")}
                className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {evaluating ? "Evaluating..." : "Submit to AI"}
              </button>
            </div>
          </h2>

          <div className="h-[45%] rounded-lg overflow-hidden border border-zinc-800 mb-4">
            <Editor
              height="100%"
              defaultLanguage="cpp"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>

          {/* Terminal Output Window with Failed Tests UI */}
          <div className="h-[15%] min-h-[100px] bg-black p-4 rounded-lg border border-zinc-800 text-zinc-500 font-mono text-sm overflow-y-auto mb-4 whitespace-pre-wrap flex items-center justify-center">
            {hiddenResult ? (
              <div className="text-center w-full">
                <p className={`font-bold text-xl mb-1 ${hiddenResult.passed === hiddenResult.total ? "text-green-400" : "text-red-400"}`}>
                  {hiddenResult.passed === hiddenResult.total ? "All Hidden Tests Passed! 🎉" : "Hidden Tests Failed ❌"}
                </p>
                <p className="text-zinc-300 text-lg">Passed <span className="font-bold text-white">{hiddenResult.passed} / {hiddenResult.total}</span> Hidden Tests</p>
                
                {hiddenResult.failed && hiddenResult.failed.length > 0 && (
                  <p className="text-red-400 text-sm mt-2 font-mono">
                    Failed Test(s): #{hiddenResult.failed.join(", #")}
                  </p>
                )}
              </div>
            ) : (
              <span className="text-zinc-500">{"> Test Case execution engine standing by. Click 'Run Hidden Tests' to evaluate."}</span>
            )}
          </div>

          {/* AI Feedback Window */}
          <div className="flex-1 overflow-y-auto bg-black p-4 rounded-lg border border-zinc-800 text-zinc-300 prose prose-invert max-w-none">
            {feedback ? <ReactMarkdown>{feedback}</ReactMarkdown> : "AI Feedback will appear here after submission."}
          </div>
        </div>

      </div>
    </div>
  );
}