"use client";

import { useState } from "react";

export default function SignupPage() {
  // 1. State Management: Stores what the user types in real-time
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 2. The Network Bridge: Triggers when the button is clicked
  const handleSignup = async () => {
    const response = await fetch("http://127.0.0.1:8000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
      }),
    });

    const data = await response.json();
    
    // 3. Client Feedback: Shows the success message from the backend
    alert(data.message);
  };

  // 4. The Visual UI (Tailwind CSS)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-zinc-900 text-white">
      <div className="bg-zinc-900 p-10 rounded-2xl w-[400px]">
        
        <h1 className="text-3xl font-bold mb-6 text-center">
          Signup
        </h1>

        <input
          type="text"
          placeholder="Enter name"
          className="w-full p-3 mb-4 rounded-lg bg-zinc-800 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter email"
          className="w-full p-3 mb-4 rounded-lg bg-zinc-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-white text-black p-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Signup
        </button>

      </div>
    </div>
  );
} 