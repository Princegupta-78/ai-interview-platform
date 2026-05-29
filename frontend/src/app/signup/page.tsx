"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Signup Successful!");
        router.push("/login"); // Send them to login after successful signup
      } else {
        // FastAPI errors are stored in 'detail'
        alert(data.detail || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      alert("Network error connecting to backend.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-zinc-900 text-white">
      <div className="bg-zinc-900 p-10 rounded-2xl w-[400px] border border-zinc-800">
        
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Enter name"
          className="w-full p-3 mb-4 rounded-lg bg-zinc-800 text-white outline-none focus:border-indigo-500 border border-transparent transition-colors"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter email"
          className="w-full p-3 mb-4 rounded-lg bg-zinc-800 text-white outline-none focus:border-indigo-500 border border-transparent transition-colors"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-3 mb-6 rounded-lg bg-zinc-800 text-white outline-none focus:border-indigo-500 border border-transparent transition-colors"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-white text-black p-3 rounded-lg font-bold hover:bg-gray-200 transition-colors mb-4"
        >
          Sign Up
        </button>

        <p className="text-center text-zinc-400 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}