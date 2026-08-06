import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/db"
import DashboardClient from "@/components/DashboardClient"
import fs from "fs"
import path from "path"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.email) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    redirect("/")
  }

  const backgroundsDir = path.join(process.cwd(), "public", "backgrounds")
  let backgroundOptions: string[] = []
  try {
    const files = fs.readdirSync(backgroundsDir)
    backgroundOptions = files.filter(file => 
      /\.(jpg|jpeg|png|webp|svg)$/i.test(file)
    )
  } catch (e) {
    console.error("Failed to read backgrounds folder:", e)
  }

  const streams = await prisma.stream.findMany({
    where: { userId: user.id },
    orderBy: { startedAt: "desc" }
  })

  const activeStream = streams.find(s => s.status === "LIVE") || null

  const formattedStreams = streams.map(s => ({
    id: s.id,
    title: s.title,
    status: s.status,
    youtubeStreamId: s.youtubeStreamId,
    startedAt: s.startedAt.toISOString(),
    endedAt: s.endedAt ? s.endedAt.toISOString() : null
  }))

  const formattedActiveStream = activeStream ? {
    id: activeStream.id,
    title: activeStream.title,
    status: activeStream.status,
    youtubeStreamId: activeStream.youtubeStreamId,
    startedAt: activeStream.startedAt.toISOString(),
    endedAt: activeStream.endedAt ? activeStream.endedAt.toISOString() : null
  } : null

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wider font-display text-gradient-primary uppercase">Streamer Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Logged in as <strong className="text-cyan-400 font-semibold">{user.email}</strong>
          </p>
        </div>
      </div>
      
      <DashboardClient
        initialUser={{
          id: user.id,
          name: user.name,
          email: user.email,
          customSlug: user.customSlug,
          youtubeChannelId: user.youtubeChannelId,
          themeBackground: user.themeBackground
        }}
        initialStreams={formattedStreams}
        activeStream={formattedActiveStream}
        backgroundOptions={backgroundOptions}
      />
    </div>
  )
}
