"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // useEffect runs immediately when the page loads
  useEffect(() => {
    // 1. Check the browser's permanent memory (localStorage)
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      // 2. If NO data exists, kick them back to the login page!
      router.push("/login");
    } else {
      // 3. If data DOES exist, parse it and let them in
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    // Destroy the session data in the browser
    localStorage.removeItem("user");
    // Kick them back to login
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white p-10">
      
      <div className="flex justify-between items-center mb-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition-colors px-6 py-2 rounded-lg font-semibold text-white"
        >
          Logout
        </button>
      </div>

      {/* Only render this if the user state is loaded */}
      {user && (
        <div className="bg-zinc-900 p-8 rounded-2xl max-w-4xl mx-auto border border-zinc-800">
          <h2 className="text-3xl mb-2 font-semibold">
            Welcome, {user.name}
          </h2>
          <p className="text-zinc-400 text-lg">
            Logged in as: {user.email}
          </p>
        </div>
      )}

    </div>
  );
}