import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { SignInButton, SignOutButton } from "@/components/auth-buttons"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex-1 flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center mb-20 animate-float">
        <span className="px-4 py-1 text-xs font-semibold text-cyan-400 bg-cyan-950/20 border border-cyan-800/30 rounded-full mb-6 uppercase tracking-widest glow-tag-cyan">
          For YouTube Live Streamers
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display mb-6">
          DISCOVER & REWARD YOUR{" "}
          <span className="text-gradient-primary">LOYAL VIEWERS</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-10 max-w-2xl">
          Track viewer engagement in real-time, compute verified watch credits with our 5-minute bucket algorithm, and share a custom public leaderboard page with your gaming community.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {session ? (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-200 gaming-btn cursor-pointer"
              >
                Go to Dashboard
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-20">
        <div className="glass-card p-8 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider font-display mb-6 text-gradient-primary">
              5-Minute Watch Credit Algorithm
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Stream duration is sliced into 5-minute rolling windows. When viewers post messages during a stream, their watch credit is calculated as follows:
            </p>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 flex items-center justify-center font-bold text-xs glow-tag-cyan">1</span>
                <span>Viewer sends <strong className="text-white">&ge; 2 messages</strong> within a single 5-minute window.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 flex items-center justify-center font-bold text-xs glow-tag-cyan">2</span>
                <span>They are awarded <strong className="text-white">1 Active Interval</strong> (5 minutes of verified watch credit).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 flex items-center justify-center font-bold text-xs glow-tag-cyan">3</span>
                <span>Maximum watch credit per stream is the sum of all active intervals multiplied by 5 minutes.</span>
              </li>
            </ul>
          </div>
          <div className="mt-8 border-t border-slate-900 pt-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Active Watch Interval</span>
              <span className="text-cyan-400 font-semibold uppercase tracking-wider">5 mins / interval</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider font-display mb-6 text-gradient-primary">
              Leaderboard Qualification Rules
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              To keep your leaderboard authentic and spam-free, viewers must fulfill these qualification criteria to be displayed:
            </p>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-fuchsia-950/60 border border-fuchsia-800/40 text-fuchsia-400 flex items-center justify-center font-bold text-xs glow-tag-pink">A</span>
                <span><strong>Stream Attendance:</strong> Must attend and actively participate in at least <strong className="text-white">3 distinct live streams</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-fuchsia-950/60 border border-fuchsia-800/40 text-fuchsia-400 flex items-center justify-center font-bold text-xs glow-tag-pink">B</span>
                <span><strong>Watch Credit Threshold:</strong> Must accumulate at least <strong className="text-white">40 minutes</strong> of watch credit per stream across those 3 streams (i.e. 8+ qualified intervals per stream).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-fuchsia-950/60 border border-fuchsia-800/40 text-fuchsia-400 flex items-center justify-center font-bold text-xs glow-tag-pink">C</span>
                <span><strong>Anti-Spam Filtering:</strong> Keeps bad actors out by verifying active participation parameters before compiling scores.</span>
              </li>
            </ul>
          </div>
          <div className="mt-8 border-t border-slate-900 pt-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Required Attendance</span>
              <span className="text-fuchsia-400 font-semibold uppercase tracking-wider">3 Streams &bull; 40 mins/Stream</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full text-center max-w-2xl mx-auto">
        <h3 className="text-xs font-semibold mb-6 text-slate-500 uppercase tracking-widest">Supported Platforms & Technologies</h3>
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-slate-400">
          <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900 glow-tag-cyan">YouTube Data API v3</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900">Supabase PostgreSQL</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900">Next.js App Router</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900">Tailwind CSS</span>
        </div>
      </div>
    </div>
  )
}
