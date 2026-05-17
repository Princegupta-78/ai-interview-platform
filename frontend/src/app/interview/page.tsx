"use client";

import { useState } from "react";

export default function InterviewPage() {
  const [started, setStarted] = useState(false);

  const questions = [
    "Tell me about yourself.",
    "What are your strengths?",
    "Why should we hire you?",
    "Explain your latest project.",
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const startInterview = () => {
    setStarted(true);
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
          <h1 className="text-5xl font-bold mb-6">
            AI Mock Interview
          </h1>

          <p className="text-gray-400 mb-8 text-lg">
            Practice your interview with AI-generated questions
          </p>

          <button
            onClick={startInterview}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            Start Interview
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
            className="mt-8 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}