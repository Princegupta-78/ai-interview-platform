import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold">
          AI Interviewer
        </h1>
        <div className="flex gap-4">
          <Link href="/login">
            <button className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-5 py-2 rounded-lg bg-white text-black font-semibold hover:opacity-80 transition">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-6xl font-bold max-w-4xl leading-tight">
          Crack Your Next Interview With AI
        </h1>
        <p className="text-zinc-400 text-xl mt-6 max-w-2xl">
          Practice real interview questions with an AI-powered interviewer,
          get instant feedback, performance analysis, and improve faster.
        </p>
        <div className="flex gap-6 mt-10">
          <Link href="/signup">
            <button className="bg-white text-black px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-80 transition">
              Start Free
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-zinc-900 border border-zinc-700 px-8 py-4 rounded-xl text-lg hover:bg-zinc-800 transition">
              Login
            </button>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-8 px-10 pb-24">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-semibold mb-4">
            AI Mock Interviews
          </h2>
          <p className="text-zinc-400">
            Practice interviews with realistic AI-generated questions
            tailored to your role and experience.
          </p>
        </div>
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-semibold mb-4">
            Smart Feedback
          </h2>
          <p className="text-zinc-400">
            Receive detailed feedback on communication,
            confidence, technical depth, and clarity.
          </p>
        </div>
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-semibold mb-4">
            Performance Analytics
          </h2>
          <p className="text-zinc-400">
            Track your improvement with AI-powered analytics
            and personalized insights.
          </p>
        </div>
      </section>

    </main>
  );
}