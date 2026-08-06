import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "LoyalStream - YouTube Live Engagement & Viewers Leaderboard",
  description: "Track viewer engagement on YouTube Live Streams and reward your most loyal viewers with custom public leaderboards.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#05060b] text-[#f2f4f8] flex flex-col font-sans" suppressHydrationWarning>
        <Providers>
          <div className="relative w-full overflow-hidden flex flex-col min-h-screen">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
            <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/5 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: "2.5s" }}></div>
            
            <header className="border-b border-cyan-950/30 bg-[#05060b]/85 backdrop-blur-md sticky top-0 z-50">
              <div className="h-0.5 w-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-600"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-wider font-display text-gradient-primary uppercase">
                    LOYALSTREAM
                  </span>
                </div>
                <nav className="flex items-center gap-6">
                  <a href="/" className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors">Home</a>
                  <a href="/dashboard" className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors">Dashboard</a>
                  <a href="/contact" className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors">Contact</a>
                </nav>
              </div>
            </header>
            
            <main className="flex-1 flex flex-col w-full">
              {children}
            </main>
            
            <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-sm text-slate-500">
              <p>&copy; 2026 LoyalStream. All rights reserved.</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
