import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { SignInButton, SignOutButton } from "@/components/auth-buttons"
import LandingSimulator from "@/components/LandingSimulator"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex-1 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center mb-16 animate-float">
        <span className="px-4 py-1.5 text-[10px] font-bold text-cyan-800 dark:text-cyan-400 bg-cyan-100/50 dark:bg-cyan-950/20 border border-cyan-300/40 dark:border-cyan-800/30 rounded-full mb-6 uppercase tracking-widest">
          Automated Viewership Tracking
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display mb-6">
          REWARD YOUR CHAT.{" "}
          <span className="text-gradient-primary">AUTOMATICALLY.</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-400 leading-relaxed mb-8 max-w-2xl">
          Convert stream chat engagement into verified watch-time. Build custom, automated loyalty leaderboards for your YouTube gaming community.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {session ? (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link
                href="/dashboard"
                className="px-8 py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-200 gaming-btn cursor-pointer"
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

      {/* Interactive Live Simulator Demonstration */}
      <div className="w-full max-w-5xl mx-auto mb-20">
        <LandingSimulator />
      </div>

      <div className="w-full text-center max-w-2xl mx-auto">
        <h3 className="text-[10px] font-bold mb-6 text-slate-500 uppercase tracking-widest">Supported Platforms & Technologies</h3>
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
          <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900">YouTube Data API v3</span>
          <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900">Supabase PostgreSQL</span>
          <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900">Next.js App Router</span>
          <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900">Tailwind CSS</span>
        </div>
      </div>
    </div>
  )
}
