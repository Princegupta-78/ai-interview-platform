"use client";

import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);

  // Timer state
  const [seconds, setSeconds] = useState(0);

  // NEW: State to track if we are in the browser (Hydration fix)
  const [isMounted, setIsMounted] = useState(false);

  // Speech Recognition
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Wait until component mounts in the browser to avoid Hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (started) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [started]);

  // Generate AI Interview
  const generateInterview = async () => {
    if (!role) return alert("Please enter a role first!");

    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/generate-questions?role=${role}`
      );

      const data = await response.json();
      
      // Safety check for backend errors
      if (data.error) {
        alert(`Backend Error: ${data.error}`);
        setLoading(false);
        return; 
      }

      const parsedQuestions = data.questions
        .split("\n")
        .filter((q: string) => q.trim() !== "");

      setQuestions(parsedQuestions);
      setStarted(true);
    } catch (error) {
      console.error(error);
      alert("Failed to connect to AI backend");
    }

    setLoading(false);
  };

  // Next Question
  const nextQuestion = () => {
    resetTranscript();

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      SpeechRecognition.stopListening();
      alert("Interview Completed");
    }
  };

  // Format Timer
  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // If the browser hasn't loaded yet, render nothing (prevents server mismatch)
  if (!isMounted) return null;

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-white p-10">
        Browser does not support speech recognition.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      {!started ? (
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h1 className="text-5xl font-bold mb-8">
            AI Interview Generator
          </h1>

          <input
            type="text"
            placeholder="Enter Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 p-4 rounded-xl w-[400px] mb-6 outline-none"
          />

          <button
            onClick={generateInterview}
            disabled={loading}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            {loading ? "Generating..." : "Generate Interview"}
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold">
              AI Mock Interview
            </h1>

            <div className="bg-zinc-900 px-5 py-2 rounded-xl border border-zinc-700">
              ⏳ {formatTime()}
            </div>
          </div>

          {/* Question */}
          <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 mb-8">
            <h2 className="text-xl text-gray-400 mb-4">
              Question {currentQuestion + 1}
            </h2>

            <p className="text-2xl leading-relaxed">
              {questions[currentQuestion]}
            </p>
          </div>

          {/* Recording Section */}
          <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
            <h2 className="text-xl font-semibold mb-6">
              Your Answer
            </h2>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() =>
                  SpeechRecognition.startListening({
                    continuous: true,
                  })
                }
                className="bg-green-600 px-5 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors"
              >
                🎤 Start Recording
              </button>

              <button
                onClick={SpeechRecognition.stopListening}
                className="bg-red-600 px-5 py-3 rounded-lg font-semibold hover:bg-red-500 transition-colors"
              >
                ⏹ Stop Recording
              </button>
            </div>

            {/* Transcript */}
            <div className="bg-black p-5 rounded-xl min-h-[150px] border border-zinc-700">
              <p className="text-gray-300 whitespace-pre-wrap">
                {transcript || "Your spoken answer will appear here..."}
              </p>
            </div>

            <button
              onClick={nextQuestion}
              className="mt-8 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Next Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}