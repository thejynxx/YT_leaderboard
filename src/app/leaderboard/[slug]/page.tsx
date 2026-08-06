import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import LeaderboardClient from "@/components/LeaderboardClient"
import { getWeekRanges, getWeeklyLeaderboard, formatDateRange } from "@/lib/leaderboard"

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const user = await prisma.user.findUnique({
    where: { customSlug: slug }
  })

  if (!user || !user.youtubeChannelId) {
    notFound()
  }

  // Calculate week ranges
  const { thisWeek, lastWeek } = getWeekRanges()

  // Compute leaderboards in parallel
  const [thisWeekEntries, lastWeekEntries] = await Promise.all([
    getWeeklyLeaderboard(user.id, thisWeek.start, thisWeek.end, 1),
    getWeeklyLeaderboard(user.id, lastWeek.start, lastWeek.end, 1)
  ])

  // Format human-readable date ranges
  const thisWeekRangeStr = formatDateRange(thisWeek.start, thisWeek.end, true)
  const lastWeekRangeStr = formatDateRange(lastWeek.start, lastWeek.end, false)

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <LeaderboardClient
        streamerName={user.name || "Streamer"}
        thisWeekEntries={thisWeekEntries}
        lastWeekEntries={lastWeekEntries}
        thisWeekRange={thisWeekRangeStr}
        lastWeekRange={lastWeekRangeStr}
        themeBackground={user.themeBackground}
      />
    </div>
  )
}
