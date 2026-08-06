import { prisma } from "./db"

export interface LeaderboardEntry {
  id: string
  displayName: string
  profileImageUrl: string | null
  streamsAttended: number
  activeWatchMinutes: number
  rank: number
}

export function getWeekRanges() {
  const now = new Date()
  
  // Current week Monday 00:00:00
  const thisWeekStart = new Date(now)
  const day = thisWeekStart.getDay() // 0 is Sunday, 1 is Monday...
  const diff = thisWeekStart.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is Sunday
  thisWeekStart.setDate(diff)
  thisWeekStart.setHours(0, 0, 0, 0)
  
  // Last week Monday 00:00:00
  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)
  
  // Last week Sunday 23:59:59.999
  const lastWeekEnd = new Date(thisWeekStart)

  return {
    thisWeek: {
      start: thisWeekStart,
      end: now
    },
    lastWeek: {
      start: lastWeekStart,
      end: lastWeekEnd
    }
  }
}

export function formatDateRange(start: Date, end: Date, isPresent = false): string {
  const formatOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
  const startStr = start.toLocaleDateString("en-US", formatOptions)
  if (isPresent) {
    return `${startStr} - Present`
  }
  // Subtract 1 millisecond from end date to get the end of the previous day for user display
  const displayEnd = new Date(end.getTime() - 1)
  const endStr = displayEnd.toLocaleDateString("en-US", formatOptions)
  return `${startStr} - ${endStr}`
}

export async function getWeeklyLeaderboard(
  userId: string,
  startDate: Date,
  endDate: Date,
  minStreamsQualified = 1
): Promise<LeaderboardEntry[]> {
  // 1. Fetch all streams for the user
  const streams = await prisma.stream.findMany({
    where: { userId }
  })
  const streamIds = streams.map(s => s.id)

  if (streamIds.length === 0) {
    return []
  }

  // 2. Fetch intervals matching these streams in the date range
  const intervals = await prisma.streamViewerInterval.findMany({
    where: {
      streamId: { in: streamIds },
      bucketStartTime: {
        gte: startDate,
        lt: endDate
      }
    },
    include: { viewer: true }
  })

  const viewerStreamBuckets: Record<string, Record<string, number>> = {}
  const viewerTotalStreams: Record<string, Set<string>> = {}
  const viewerDetails: Record<string, { name: string; avatar: string | null }> = {}

  for (const interval of intervals) {
    const vId = interval.viewerId
    const sId = interval.streamId

    if (!viewerStreamBuckets[vId]) {
      viewerStreamBuckets[vId] = {}
      viewerTotalStreams[vId] = new Set()
      viewerDetails[vId] = {
        name: interval.viewer.displayName,
        avatar: interval.viewer.profileImageUrl
      }
    }

    viewerTotalStreams[vId].add(sId)

    if (interval.isQualified) {
      viewerStreamBuckets[vId][sId] = (viewerStreamBuckets[vId][sId] || 0) + 1
    }
  }

  const qualifiedCandidates: Omit<LeaderboardEntry, "rank" | "id">[] = []

  for (const vId in viewerStreamBuckets) {
    const streamQualifiedIntervals = viewerStreamBuckets[vId]
    let qualifiedStreamsCount = 0
    let totalQualifiedIntervals = 0

    for (const sId in streamQualifiedIntervals) {
      const qIntervals = streamQualifiedIntervals[sId]
      totalQualifiedIntervals += qIntervals
      if (qIntervals >= 8) {
        qualifiedStreamsCount++
      }
    }

    // Viewer must meet the stream attendance threshold within the period
    if (qualifiedStreamsCount >= minStreamsQualified) {
      qualifiedCandidates.push({
        displayName: viewerDetails[vId].name,
        profileImageUrl: viewerDetails[vId].avatar,
        streamsAttended: viewerTotalStreams[vId].size,
        activeWatchMinutes: totalQualifiedIntervals * 5
      })
    }
  }

  // 3. Sort candidates
  qualifiedCandidates.sort((a, b) => {
    if (b.activeWatchMinutes !== a.activeWatchMinutes) {
      return b.activeWatchMinutes - a.activeWatchMinutes
    }
    if (b.streamsAttended !== a.streamsAttended) {
      return b.streamsAttended - a.streamsAttended
    }
    return a.displayName.localeCompare(b.displayName)
  })

  // 4. Map to final structure with rank and unique string ID
  return qualifiedCandidates.map((candidate, idx) => ({
    id: `${startDate.getTime()}-${idx}`,
    displayName: candidate.displayName,
    profileImageUrl: candidate.profileImageUrl,
    streamsAttended: candidate.streamsAttended,
    activeWatchMinutes: candidate.activeWatchMinutes,
    rank: idx + 1
  }))
}
