"use client";

import { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function InterviewPage() {
  // --- STATES ---
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // --- REFS ---
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // --- HOOKS ---
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

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

  // Webcam Logic
  useEffect(() => {
    if (started) {
      startWebcam();
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [started]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Webcam access denied:", error);
    }
  };

  // --- DAY 13: TEXT-TO-SPEECH ---
  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      synth.cancel(); 
      
      const utterance = new SpeechSynthesisUtterance(questions[currentQuestion]);
      utterance.rate = 0.95; 
      utterance.pitch = 1;
      synth.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  // --- API CALLS ---
  const generateInterview = async () => {
    if (!role) return alert("Please enter a role first!");
    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/generate-questions?role=${role}`
      );
      const data = await response.json();
      
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

  // --- DAY 14: EVALUATE & SAVE TO POSTGRESQL ---
  const evaluateAnswer = async () => {
    if (!transcript) {
      return alert("Please record an answer first!");
    }
    setEvaluating(true);

    try {
      // 1. Fetch AI Review Analysis from Gemini
      const response = await fetch("http://127.0.0.1:8000/evaluate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: questions[currentQuestion],
          answer: transcript,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        alert(`Evaluation Error: ${data.error}`);
        setEvaluating(false);
        return;
      }

      // Render the response to our UI
      setFeedback(data.feedback);

      // 2. Chained Data Write: Persist the session to PostgreSQL
      await fetch("http://127.0.0.1:8000/save-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: role,
          question: questions[currentQuestion],
          answer: transcript, 
          feedback: data.feedback,
        }),
      });

    } catch (error) {
      console.error(error);
      alert("Transactional persistence pipeline failed.");
    }
    setEvaluating(false);
  };

  // --- HELPERS ---
  const nextQuestion = () => {
    setFeedback("");
    resetTranscript();
    window.speechSynthesis.cancel(); 

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      SpeechRecognition.stopListening();
      alert("Interview Completed");
    }
  };

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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
            placeholder="Enter Role (e.g. SDE)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 p-4 rounded-xl w-[400px] mb-6 outline-none"
          />
          <button
            onClick={generateInterview}
            disabled={loading}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            {loading ? "Generating..." : "Generate Interview"}
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: Interview Content */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-bold">AI Mock Interview</h1>
              <div className="bg-zinc-900 px-5 py-2 rounded-xl border border-zinc-700">
                ⏳ {formatTime()}
              </div>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 mb-8">
              <h2 className="text-xl text-gray-400 mb-4">
                Question {currentQuestion + 1}
              </h2>
              <p className="text-2xl leading-relaxed mb-6">
                {questions[currentQuestion]}
              </p>
              
              <button
                onClick={speakQuestion}
                className="bg-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-500 transition-colors flex items-center gap-2"
              >
                🔊 Read Question
              </button>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
              <h2 className="text-xl font-semibold mb-6">Your Answer</h2>
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => SpeechRecognition.startListening({ continuous: true })}
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

              <div className="bg-black p-5 rounded-xl min-h-[150px] border border-zinc-700 mb-6">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {transcript || "Your spoken answer will appear here..."}
                </p>
              </div>
              
              {feedback && (
                <div className="mt-8 mb-6 bg-zinc-950 border border-zinc-700 p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-4 text-blue-400">
                    AI Feedback & Score
                  </h2>
                  <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                    {feedback}
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={evaluateAnswer}
                  disabled={evaluating}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors"
                >
                  {evaluating ? "Evaluating..." : "Get AI Feedback"}
                </button>
                <button
                  onClick={nextQuestion}
                  className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Next Question
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Webcam Panel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 h-fit sticky top-10">
            <h2 className="text-2xl font-bold mb-4">Live Interview</h2>
            
            <div className="rounded-2xl overflow-hidden border border-zinc-700 bg-black relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-[350px] object-cover transform scale-x-[-1]"
              />
            </div>

            <div className="mt-5 space-y-3">
              <div className="bg-black border border-zinc-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className="text-green-400 font-semibold">● Interview Active</p>
              </div>

              <div className="bg-black border border-zinc-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">AI Analysis</p>
                <p className="text-white">Monitoring communication confidence...</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}