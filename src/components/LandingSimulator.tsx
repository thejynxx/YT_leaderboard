"use client"

import { useState, useEffect, useRef } from "react"
import { Send, CheckCircle2, Trophy, Clock, Tv } from "lucide-react"

interface ChatMessage {
  id: string
  displayName: string
  message: string
  color: string
}

interface SimulatorViewer {
  displayName: string
  messageCount: number
  activeWatchMinutes: number
  color: string
}

const VIEWERS: Record<string, { color: string; messages: string[] }> = {
  "GamerX": {
    color: "text-cyan-400",
    messages: ["GG!", "What a play!", "Let's goooo!", "W play!", "Insane shot!"]
  },
  "LurkQueen": {
    color: "text-fuchsia-400",
    messages: ["Clean shot!", "Unbelievable!", "OMG!", "Hahaha", "Poggers!"]
  },
  "SpeedyChat": {
    color: "text-emerald-400",
    messages: ["GG!", "Nice!", "hype!", "wow", "amazing!"]
  },
  "NoobMaster": {
    color: "text-amber-400",
    messages: ["hi chat", "GG", "lol", "first time here", "insane!"]
  }
}

export default function LandingSimulator() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", displayName: "GamerX", message: "GG!", color: "text-cyan-400" },
    { id: "2", displayName: "LurkQueen", message: "Hey chat!", color: "text-fuchsia-400" }
  ])

  const [viewers, setViewers] = useState<Record<string, SimulatorViewer>>({
    "GamerX": { displayName: "GamerX", messageCount: 1, activeWatchMinutes: 10, color: "text-cyan-400" },
    "LurkQueen": { displayName: "LurkQueen", messageCount: 1, activeWatchMinutes: 5, color: "text-fuchsia-400" },
    "SpeedyChat": { displayName: "SpeedyChat", messageCount: 0, activeWatchMinutes: 0, color: "text-emerald-400" },
    "NoobMaster": { displayName: "NoobMaster", messageCount: 0, activeWatchMinutes: 0, color: "text-amber-400" }
  })

  const [alert, setAlert] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Simulation Interval
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Pick a random viewer
      const viewerKeys = Object.keys(VIEWERS)
      const randomViewer = viewerKeys[Math.floor(Math.random() * viewerKeys.length)]
      const viewerConfig = VIEWERS[randomViewer]

      // 2. Pick a random message
      const randomMsg = viewerConfig.messages[Math.floor(Math.random() * viewerConfig.messages.length)]

      // 3. Add to chat messages list (limit to 10)
      const newMessage: ChatMessage = {
        id: Math.random().toString(),
        displayName: randomViewer,
        message: randomMsg,
        color: viewerConfig.color
      }
      setMessages(prev => [...prev.slice(-9), newMessage])

      // 4. Update viewer message count and watch time
      setViewers(prev => {
        const currentViewer = prev[randomViewer]
        const newCount = currentViewer.messageCount + 1
        let newWatchMinutes = currentViewer.activeWatchMinutes
        
        // If they reach exactly 2 messages in this simulated bucket, they qualify for +5 minutes!
        if (newCount === 2) {
          newWatchMinutes += 5
          setAlert(`${randomViewer} qualified! (+5 mins watch credit)`)
          setTimeout(() => setAlert(null), 2500)
        }

        return {
          ...prev,
          [randomViewer]: {
            ...currentViewer,
            messageCount: newCount >= 2 ? 0 : newCount, // Reset count on qualification to simulate next bucket
            activeWatchMinutes: newWatchMinutes
          }
        }
      })
    }, 2200)

    return () => clearInterval(interval)
  }, [])

  // Sort viewers for leaderboard display
  const sortedLeaderboard = Object.values(viewers).sort((a, b) => {
    if (b.activeWatchMinutes !== a.activeWatchMinutes) {
      return b.activeWatchMinutes - a.activeWatchMinutes
    }
    return a.displayName.localeCompare(b.displayName)
  })

  return (
    <div className="w-full glass-card p-6 md:p-8 rounded-3xl border border-slate-900 shadow-2xl relative overflow-hidden">
      {/* Background Neon Grid Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-slate-950 to-slate-950 -z-10"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* 1. Live Chat Simulator Column (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-950/70 border border-slate-900 rounded-2xl p-4 flex flex-col h-[340px] justify-between shadow-inner">
          <div className="flex items-center justify-between pb-3 border-b border-slate-900">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Chat Feed
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-800/30">
              Active OBS
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 py-4 scrollbar-none pr-1">
            {messages.map((msg) => (
              <div key={msg.id} className="text-xs bg-slate-900/30 border border-slate-900/20 px-3 py-2 rounded-xl">
                <span className={`font-bold ${msg.color} mr-1.5`}>{msg.displayName}:</span>
                <span className="text-slate-300">{msg.message}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="relative pt-3 border-t border-slate-900 flex items-center gap-2">
            <div className="flex-1 bg-slate-900/50 border border-slate-900 rounded-xl px-3 py-2 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Viewers chatting...</span>
              <Send className="w-3.5 h-3.5 text-slate-600" />
            </div>
          </div>
        </div>

        {/* 2. Middle Algorithmic Validator (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-950/50 border border-cyan-950/20 rounded-2xl p-5 flex flex-col justify-between h-[340px]">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-900">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Algorithm Validator</span>
            </div>
            
            <div className="mt-4 space-y-4">
              <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>Rolling Bucket Timer</span>
                  <span className="text-cyan-400 animate-pulse font-bold">4m 59s</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-400 to-violet-500 h-full w-4/5 animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>Simulated Bucket Rules:</span>
                </div>
                <div className="p-3 bg-slate-900/20 border border-slate-900/40 rounded-xl space-y-1.5 font-mono text-[10px] text-slate-400">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    Send &ge; 2 chats per bucket
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    Gain +5 mins watch time
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-12 flex items-center justify-center">
            {alert ? (
              <div className="bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 font-bold px-3.5 py-2 rounded-xl text-[10px] text-center w-full shadow-[0_0_12px_rgba(16,185,129,0.15)] animate-bounce uppercase tracking-wider flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                {alert}
              </div>
            ) : (
              <span className="text-[10px] text-slate-600 uppercase tracking-widest text-center font-mono">
                Awaiting next qualification...
              </span>
            )}
          </div>
        </div>

        {/* 3. Live Leaderboard Simulator (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-950/70 border border-slate-900 rounded-2xl p-4 flex flex-col h-[340px] justify-between shadow-inner">
          <div className="flex items-center justify-between pb-3 border-b border-slate-900">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              Live Leaderboard
            </span>
            <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">
              Live updates
            </span>
          </div>

          <div className="flex-1 space-y-2 py-4 overflow-y-auto scrollbar-none pr-1">
            {sortedLeaderboard.map((viewer, index) => {
              const rank = index + 1
              return (
                <div 
                  key={viewer.displayName} 
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all duration-300 ${
                    rank === 1 
                      ? "bg-yellow-950/10 border-yellow-900/30 shadow-[0_0_10px_rgba(251,191,36,0.05)]" 
                      : "bg-slate-900/20 border-slate-900/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`font-bold w-4 text-center ${
                      rank === 1 ? "text-yellow-400" : rank === 2 ? "text-slate-300" : rank === 3 ? "text-orange-500" : "text-slate-600"
                    }`}>
                      #{rank}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                      {viewer.displayName.slice(0, 2)}
                    </div>
                    <span className="font-bold text-slate-200">{viewer.displayName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-950 border border-slate-900">
                      {viewer.messageCount} chat{viewer.messageCount !== 1 ? 's' : ''}
                    </span>
                    <span className="font-mono text-cyan-400 font-bold bg-cyan-950/10 px-2 py-0.5 rounded text-[10px] border border-cyan-950/20">
                      {viewer.activeWatchMinutes}m
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-3 border-t border-slate-900 flex justify-between items-center text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            <span>Updating dynamically</span>
            <span>Sorted by Watch Time</span>
          </div>
        </div>

      </div>
    </div>
  )
}
