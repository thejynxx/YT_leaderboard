"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, ExternalLink, Play, Square, Settings, Radio, Users, Clock, Check, Palette } from "lucide-react"

interface Stream {
  id: string
  title: string
  status: "LIVE" | "ENDED"
  youtubeStreamId: string
  startedAt: string
  endedAt: string | null
}

interface DashboardClientProps {
  initialUser: {
    id: string
    name: string | null
    email: string
    customSlug: string
    youtubeChannelId: string | null
    themeBackground: string | null
  }
  initialStreams: Stream[]
  activeStream: Stream | null
  backgroundOptions: string[]
}

export default function DashboardClient({
  initialUser,
  initialStreams,
  activeStream: initialActiveStream,
  backgroundOptions
}: DashboardClientProps) {
  const router = useRouter()
  const [slug, setSlug] = useState(initialUser.customSlug)
  const [slugStatus, setSlugStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [slugMessage, setSlugMessage] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  
  const [activeStream, setActiveStream] = useState<Stream | null>(initialActiveStream)
  const [trackStatus, setTrackStatus] = useState<"idle" | "loading" | "error">("idle")
  const [trackMessage, setTrackMessage] = useState("")

  const [selectedBg, setSelectedBg] = useState<string>(initialUser.themeBackground || "none")
  const [themeStatus, setThemeStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [themeMessage, setThemeMessage] = useState("")

  const handleUpdateTheme = async (e: React.FormEvent) => {
    e.preventDefault()
    setThemeStatus("loading")
    setThemeMessage("")

    try {
      const res = await fetch("/api/dashboard/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeBackground: selectedBg === "none" ? null : selectedBg })
      })
      const data = await res.json()

      if (res.ok) {
        setThemeStatus("success")
        setThemeMessage("Theme updated successfully")
        router.refresh()
      } else {
        setThemeStatus("error")
        setThemeMessage(data.error || "Failed to update theme")
      }
    } catch (err) {
      setThemeStatus("error")
      setThemeMessage("An unexpected error occurred")
    }
  }

  const handleUpdateSlug = async (e: React.FormEvent) => {
    e.preventDefault()
    setSlugStatus("loading")
    setSlugMessage("")

    try {
      const res = await fetch("/api/dashboard/slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug })
      })
      const data = await res.json()

      if (res.ok) {
        setSlugStatus("success")
        setSlugMessage("Slug updated successfully")
        router.refresh()
      } else {
        setSlugStatus("error")
        setSlugMessage(data.error || "Failed to update slug")
      }
    } catch (err) {
      setSlugStatus("error")
      setSlugMessage("An unexpected error occurred")
    }
  }

  const handleToggleTracking = async (action: "start" | "stop") => {
    setTrackStatus("loading")
    setTrackMessage("")

    try {
      const res = await fetch("/api/dashboard/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      })
      const data = await res.json()

      if (res.ok) {
        setTrackStatus("idle")
        if (action === "start") {
          setActiveStream(data.stream)
        } else {
          setActiveStream(null)
        }
        router.refresh()
      } else {
        setTrackStatus("error")
        setTrackMessage(data.error || `Failed to ${action} tracking`)
      }
    } catch (err) {
      setTrackStatus("error")
      setTrackMessage("An unexpected error occurred")
    }
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/leaderboard/${initialUser.customSlug}`
    navigator.clipboard.writeText(link)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <Radio className={`w-6 h-6 ${activeStream ? "text-[#00f2fe] animate-pulse" : "text-slate-500"}`} />
            <h2 className="text-xl font-bold font-display uppercase tracking-wider">Live Tracking Control</h2>
          </div>
          
          <div className="p-6 bg-slate-950/40 border border-cyan-950/20 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              {activeStream ? (
                <div className="space-y-1">
                  <span className="px-3 py-1 text-xs font-bold text-red-400 bg-red-950/30 border border-red-500/30 rounded-full glow-tag-red uppercase tracking-wider inline-block">
                    ACTIVE LIVE
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3 font-display">{activeStream.title}</h3>
                  <p className="text-xs text-slate-500 font-mono">STREAM ID: {activeStream.youtubeStreamId}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="px-3 py-1 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 rounded-full uppercase tracking-wider inline-block">
                    STANDBY
                  </span>
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-3 font-display">No Active Stream Logged</h3>
                  <p className="text-xs text-slate-500">System ready to register live chat viewers.</p>
                </div>
              )}
            </div>

            <div>
              {activeStream ? (
                <button
                  onClick={() => handleToggleTracking("stop")}
                  disabled={trackStatus === "loading"}
                  className="px-6 py-3 rounded-xl bg-red-950/40 border border-red-500 hover:bg-red-900/20 text-red-200 font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-500/20 glow-tag-red uppercase text-sm tracking-wider"
                >
                  <Square className="w-4 h-4 fill-red-200" />
                  Stop Tracking
                </button>
              ) : (
                <button
                  onClick={() => handleToggleTracking("start")}
                  disabled={trackStatus === "loading"}
                  className="px-6 py-3 rounded-xl text-white font-bold flex items-center gap-2 transition-all cursor-pointer gaming-btn text-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Start Tracking
                </button>
              )}
            </div>
          </div>

          {trackMessage && (
            <p className={`text-sm font-semibold ${trackStatus === "error" ? "text-red-400" : "text-slate-400"}`}>
              {trackMessage}
            </p>
          )}

          <div className="text-xs text-slate-500 leading-relaxed bg-slate-950/20 p-4 border border-slate-900/60 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider">Important Note:</h4>
            <p>
              Clicking "Start Tracking" queries the YouTube Data API to locate an active live broadcast or live stream event on your channel. Ensure you have started streaming in OBS or your streaming software before launching tracker.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 rounded-2xl space-y-6">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-slate-400" />
              <h2 className="text-xl font-bold font-display uppercase tracking-wider">Leaderboard Setup</h2>
            </div>

            <form onSubmit={handleUpdateSlug} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  Leaderboard URL Slug
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-900 focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,242,254,0.15)] rounded-xl px-4 py-3 text-sm focus:outline-none transition-all text-slate-900 dark:text-white font-medium"
                    placeholder="custom-slug"
                    required
                  />
                  <button
                    type="submit"
                    disabled={slugStatus === "loading"}
                    className="px-5 py-3 text-white rounded-xl text-xs font-bold transition-all cursor-pointer gaming-btn"
                  >
                    Save
                  </button>
                </div>
              </div>

              {slugMessage && (
                <p className={`text-xs font-semibold ${slugStatus === "error" ? "text-red-400" : "text-green-400"}`}>
                  {slugMessage}
                </p>
              )}
            </form>

            <div className="border-t border-slate-900 pt-6 space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Public Link
              </label>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-900 rounded-xl p-3 justify-between shadow-inner">
                <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[200px] font-mono">
                  /leaderboard/{initialUser.customSlug}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="p-2 bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 rounded-lg hover:text-cyan-400 dark:hover:text-cyan-400 transition-all text-slate-500 dark:text-slate-400 cursor-pointer"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={`/leaderboard/${initialUser.customSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 rounded-lg hover:text-cyan-400 dark:hover:text-cyan-400 transition-all text-slate-500 dark:text-slate-400 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl space-y-6">
            <div className="flex items-center gap-3">
              <Palette className="w-6 h-6 text-slate-400" />
              <h2 className="text-xl font-bold font-display uppercase tracking-wider">Theme Customization</h2>
            </div>

            <form onSubmit={handleUpdateTheme} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  Select Background Preset
                </label>
                
                <div className="grid grid-cols-3 gap-2">
                  {/* None/Default Preset */}
                  <button
                    type="button"
                    onClick={() => setSelectedBg("none")}
                    className={`relative aspect-video rounded-xl border flex flex-col items-center justify-center text-xs font-semibold overflow-hidden transition-all cursor-pointer ${
                      selectedBg === "none"
                        ? "border-violet-500 bg-violet-950/20 text-violet-400 ring-2 ring-violet-500/20"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <span>None</span>
                  </button>

                  {/* Dynamic Preset Cards */}
                  {backgroundOptions.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setSelectedBg(bg)}
                      className={`relative aspect-video rounded-xl border overflow-hidden transition-all group cursor-pointer ${
                        selectedBg === bg
                          ? "border-violet-500 ring-2 ring-violet-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                      title={bg.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                    >
                      <img
                        src={`/backgrounds/${bg}`}
                        alt={bg}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-115 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-white font-medium bg-slate-950/80 px-2 py-0.5 rounded-full truncate max-w-[90%] pointer-events-none">
                          {bg.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")}
                        </span>
                      </div>
                      {selectedBg === bg && (
                        <div className="absolute top-1.5 right-1.5 bg-violet-600 rounded-full p-0.5 shadow-lg z-10">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={themeStatus === "loading"}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all cursor-pointer gaming-btn"
              >
                {themeStatus === "loading" ? "Saving..." : "Save Theme"}
              </button>

              {themeMessage && (
                <p className={`text-sm ${themeStatus === "error" ? "text-red-400" : "text-green-400"}`}>
                  {themeMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-slate-400" />
          <h2 className="text-xl font-bold font-display uppercase tracking-wider">Tracked Streams History</h2>
        </div>

        {initialStreams.length === 0 ? (
          <div className="text-center py-12 text-slate-500 border border-dashed border-slate-900 rounded-xl">
            No streams tracked yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase text-slate-500 tracking-wider border-b border-cyan-950/20 bg-slate-950/40">
                <tr>
                  <th className="py-4 px-4">Title</th>
                  <th className="py-4 px-4">YouTube ID</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Started At</th>
                  <th className="py-4 px-4">Ended At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950/60">
                {initialStreams.map((stream) => (
                  <tr key={stream.id} className="hover:bg-cyan-950/5 border-b border-slate-950/40 hover:border-cyan-900/10 transition-all">
                    <td className="py-4 px-4 font-bold text-white font-display">{stream.title}</td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-400">{stream.youtubeStreamId}</td>
                    <td className="py-4 px-4">
                      {stream.status === "LIVE" ? (
                        <span className="px-2.5 py-0.5 rounded text-xs bg-red-950/40 border border-red-500/30 text-red-400 font-bold glow-tag-red uppercase tracking-wider">
                          LIVE
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-xs bg-slate-900 border border-slate-800 text-slate-400 uppercase font-semibold">
                          ENDED
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {new Date(stream.startedAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {stream.endedAt ? new Date(stream.endedAt).toLocaleString() : "-"}
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
