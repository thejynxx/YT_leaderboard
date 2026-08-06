"use client"

import { useState } from "react"
import { Search, Trophy, Tv, Clock } from "lucide-react"

interface LeaderboardEntry {
  id: string
  displayName: string
  profileImageUrl: string | null
  streamsAttended: number
  activeWatchMinutes: number
  rank: number
}

interface LeaderboardClientProps {
  streamerName: string
  thisWeekEntries: LeaderboardEntry[]
  lastWeekEntries: LeaderboardEntry[]
  thisWeekRange: string
  lastWeekRange: string
  themeBackground: string | null
}

export default function LeaderboardClient({
  streamerName,
  thisWeekEntries,
  lastWeekEntries,
  thisWeekRange,
  lastWeekRange,
  themeBackground
}: LeaderboardClientProps) {
  const [activeTab, setActiveTab] = useState<"this-week" | "last-week">("this-week")
  const [searchTerm, setSearchTerm] = useState("")

  const entries = activeTab === "this-week" ? thisWeekEntries : lastWeekEntries
  const dateRange = activeTab === "this-week" ? thisWeekRange : lastWeekRange

  const filteredEntries = entries.filter((entry) =>
    entry.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-950/45 border border-yellow-500/30 px-2.5 py-1 rounded-full text-xs uppercase tracking-wider shadow-[0_0_8px_rgba(251,191,36,0.15)]">
            <Trophy className="w-3.5 h-3.5 fill-yellow-400" />
            Gold
          </span>
        )
      case 2:
        return (
          <span className="flex items-center gap-1 text-slate-300 font-bold bg-slate-900/60 border border-slate-700/40 px-2.5 py-1 rounded-full text-xs uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 fill-slate-300" />
            Silver
          </span>
        )
      case 3:
        return (
          <span className="flex items-center gap-1 text-[#ff6a00] font-bold bg-orange-950/40 border border-orange-500/25 px-2.5 py-1 rounded-full text-xs uppercase tracking-wider shadow-[0_0_8px_rgba(255,106,0,0.15)]">
            <Trophy className="w-3.5 h-3.5 fill-[#ff6a00]" />
            Bronze
          </span>
        )
      default:
        return <span className="text-slate-500 font-semibold text-sm pl-3">#{rank}</span>
    }
  }

  return (
    <div className="space-y-8 relative z-10">
      {themeBackground && (
        <div
          className="fixed inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url("/backgrounds/${themeBackground}")`,
          }}
        />
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-white uppercase tracking-wider">
            <span className="text-gradient-primary">{streamerName}'S</span> Loyal Viewers
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            <p className="text-sm text-slate-400">
              Top-ranked community members based on active watch credit thresholds.
            </p>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/30 border border-cyan-800/30 text-cyan-400 uppercase tracking-widest glow-tag-cyan font-mono">
              {dateRange}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Tab Switcher */}
          <div className="flex bg-slate-950/80 p-1 border border-slate-900 rounded-xl w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTab("this-week")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "this-week"
                  ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setActiveTab("last-week")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "last-week"
                  ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Last Week
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/40 border border-slate-900 focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,242,254,0.15)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-all text-white font-medium"
              placeholder="Search handle..."
            />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-slate-900">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No qualified viewers match your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase text-slate-500 tracking-wider border-b border-cyan-950/20 bg-slate-950/60">
                <tr>
                  <th className="py-4 px-6">Rank</th>
                  <th className="py-4 px-6">Viewer</th>
                  <th className="py-4 px-6 text-center">Streams Attended</th>
                  <th className="py-4 px-6 text-right">Active Watch Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950/60 bg-slate-950/10">
                {filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`hover:bg-cyan-950/5 hover:border-cyan-900/10 transition-all ${
                      entry.rank <= 3 ? "bg-cyan-950/5" : ""
                    }`}
                  >
                    <td className="py-4 px-6 font-semibold">{getRankBadge(entry.rank)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {entry.profileImageUrl ? (
                          <img
                            src={entry.profileImageUrl}
                            alt={entry.displayName}
                            className="w-8 h-8 rounded-full border border-slate-800 bg-slate-950 object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none"
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full border border-slate-800 bg-slate-950 flex items-center justify-center text-xs font-semibold text-slate-500">
                            {entry.displayName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="font-bold text-white">{entry.displayName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950/60 border border-slate-900/40 text-xs font-bold text-slate-300 uppercase tracking-wide">
                        <Tv className="w-3.5 h-3.5 text-[#00f2fe]" />
                        {entry.streamsAttended} streams
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-white">
                      <div className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
                        {(entry.activeWatchMinutes / 60).toFixed(1)} hrs
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
