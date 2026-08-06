import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"


export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Calculate start of last week for pruning
    const nowTime = new Date()
    const thisWeekStart = new Date(nowTime)
    const day = thisWeekStart.getDay()
    const diff = thisWeekStart.getDate() - day + (day === 0 ? -6 : 1)
    thisWeekStart.setDate(diff)
    thisWeekStart.setHours(0, 0, 0, 0)
    const lastWeekStart = new Date(thisWeekStart)
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)

    // Delete intervals older than 14 days (before lastWeekStart)
    await prisma.streamViewerInterval.deleteMany({
      where: {
        bucketStartTime: {
          lt: lastWeekStart
        }
      }
    })

    const activeStreams = await prisma.stream.findMany({
      where: { status: "LIVE" },
      include: { user: true }
    })

    const results = []

    for (const stream of activeStreams) {
      const streamer = stream.user
      if (!streamer.googleRefreshToken) {
        results.push({ streamId: stream.id, status: "skipped_no_refresh_token" })
        continue
      }

      let accessToken = ""
      try {
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID || "",
            client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
            refresh_token: streamer.googleRefreshToken,
            grant_type: "refresh_token"
          })
        })
        const tokens = await tokenRes.json()
        accessToken = tokens.access_token
      } catch (err) {
        results.push({ streamId: stream.id, status: "failed_token_refresh" })
        continue
      }

      if (!accessToken) {
        results.push({ streamId: stream.id, status: "empty_access_token" })
        continue
      }

      let activeChatId = stream.liveChatId
      if (!activeChatId) {
        try {
          const broadcastRes = await fetch(
            "https://www.googleapis.com/youtube/v3/liveBroadcasts?broadcastStatus=active&part=snippet,contentDetails",
            { headers: { Authorization: `Bearer ${accessToken}` } }
          )
          const broadcastData = await broadcastRes.json()
          const activeBroadcast = broadcastData.items?.[0]
          if (activeBroadcast) {
            activeChatId = activeBroadcast.contentDetails?.activeLiveChatId || null
            if (activeChatId) {
              await prisma.stream.update({
                where: { id: stream.id },
                data: { liveChatId: activeChatId }
              })
            }
          } else {
            await prisma.stream.update({
              where: { id: stream.id },
              data: { status: "ENDED", endedAt: new Date() }
            })
            results.push({ streamId: stream.id, status: "ended_broadcast_not_found" })
            continue
          }
        } catch (err) {
          results.push({ streamId: stream.id, status: "failed_broadcast_fetch" })
          continue
        }
      }

      if (!activeChatId) {
        results.push({ streamId: stream.id, status: "no_active_chat_id" })
        continue
      }

      try {
        let url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${activeChatId}&part=id,snippet,authorDetails&maxResults=2000`
        if (stream.nextPageToken) {
          url += `&pageToken=${stream.nextPageToken}`
        }

        const msgRes = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })

        if (!msgRes.ok) {
          if (msgRes.status === 403 || msgRes.status === 404) {
            await prisma.stream.update({
              where: { id: stream.id },
              data: { status: "ENDED", endedAt: new Date() }
            })
            results.push({ streamId: stream.id, status: "ended_due_to_chat_error" })
            continue
          }
          results.push({ streamId: stream.id, status: `failed_chat_messages_fetch_${msgRes.status}` })
          continue
        }

        const msgData = await msgRes.json()
        const items = msgData.items || []
        const newPageToken = msgData.nextPageToken || stream.nextPageToken

        if (items.length > 0) {
          // 1. Collect unique viewers from fetched messages
          const viewerMap = new Map<string, { displayName: string; profileImageUrl: string }>()
          for (const item of items) {
            const channelId = item.authorDetails?.channelId
            const displayName = item.authorDetails?.displayName || "Anonymous"
            const profileImageUrl = item.authorDetails?.profileImageUrl || ""
            const publishedAt = item.snippet?.publishedAt
            if (!channelId || !publishedAt) continue
            viewerMap.set(channelId, { displayName, profileImageUrl })
          }

          // 2. Fetch all existing viewers matching those channel IDs
          const channelIds = Array.from(viewerMap.keys())
          const existingViewers = await prisma.viewer.findMany({
            where: { youtubeAuthorChannelId: { in: channelIds } }
          })
          const existingViewerMap = new Map<string, any>(
            existingViewers.map((v: any) => [v.youtubeAuthorChannelId, v])
          )

          // 3. Identify and create new viewers in bulk
          const newViewersData = []
          for (const [channelId, info] of viewerMap.entries()) {
            if (!existingViewerMap.has(channelId)) {
              newViewersData.push({
                youtubeAuthorChannelId: channelId,
                displayName: info.displayName,
                profileImageUrl: info.profileImageUrl
              })
            }
          }

          if (newViewersData.length > 0) {
            await prisma.viewer.createMany({
              data: newViewersData,
              skipDuplicates: true
            })
            // Fetch newly created viewers to get their IDs and cache in map
            const newlyCreatedViewers = await prisma.viewer.findMany({
              where: { youtubeAuthorChannelId: { in: newViewersData.map((v: any) => v.youtubeAuthorChannelId) } }
            })
            for (const v of newlyCreatedViewers) {
              existingViewerMap.set(v.youtubeAuthorChannelId, v)
            }
          }

          // Update changed names or profile images in database
          const viewerUpdates = []
          for (const [channelId, info] of viewerMap.entries()) {
            const existing = existingViewerMap.get(channelId)
            if (existing && (existing.displayName !== info.displayName || existing.profileImageUrl !== info.profileImageUrl)) {
              viewerUpdates.push(
                prisma.viewer.update({
                  where: { id: existing.id },
                  data: { displayName: info.displayName, profileImageUrl: info.profileImageUrl }
                })
              )
            }
          }
          if (viewerUpdates.length > 0) {
            await prisma.$transaction(viewerUpdates)
          }

          // 4. Group intervals in memory
          const intervalKeyMap = new Map<string, { viewerId: string; bucketStartTime: Date; count: number }>()
          for (const item of items) {
            const channelId = item.authorDetails?.channelId
            const publishedAt = item.snippet?.publishedAt
            if (!channelId || !publishedAt) continue

            const viewer = existingViewerMap.get(channelId)
            if (!viewer) continue

            const messageTime = new Date(publishedAt).getTime()
            const bucketStartTime = new Date(Math.floor(messageTime / 300000) * 300000)
            const key = `${viewer.id}_${bucketStartTime.getTime()}`

            const existingGroup = intervalKeyMap.get(key)
            if (existingGroup) {
              existingGroup.count += 1
            } else {
              intervalKeyMap.set(key, {
                viewerId: viewer.id,
                bucketStartTime,
                count: 1
              })
            }
          }

          // 5. Bulk fetch all matching existing intervals
          const intervalKeys = Array.from(intervalKeyMap.values())
          const existingIntervals = await prisma.streamViewerInterval.findMany({
            where: {
              streamId: stream.id,
              OR: intervalKeys.map((k: any) => ({
                viewerId: k.viewerId,
                bucketStartTime: k.bucketStartTime
              }))
            }
          })

          const existingIntervalsMap = new Map<string, typeof existingIntervals[0]>()
          for (const ext of existingIntervals) {
            const key = `${ext.viewerId}_${ext.bucketStartTime.getTime()}`
            existingIntervalsMap.set(key, ext)
          }

          // 6. Partition intervals into batch insert and batch updates
          const intervalsToCreate = []
          const intervalUpdates = []

          for (const keyInfo of intervalKeys) {
            const key = `${keyInfo.viewerId}_${keyInfo.bucketStartTime.getTime()}`
            const existing = existingIntervalsMap.get(key)

            if (existing) {
              const newCount = existing.messageCount + keyInfo.count
              intervalUpdates.push(
                prisma.streamViewerInterval.update({
                  where: { id: existing.id },
                  data: {
                    messageCount: newCount,
                    isQualified: newCount >= 2
                  }
                })
              )
            } else {
              intervalsToCreate.push({
                streamId: stream.id,
                viewerId: keyInfo.viewerId,
                bucketStartTime: keyInfo.bucketStartTime,
                messageCount: keyInfo.count,
                isQualified: keyInfo.count >= 2
              })
            }
          }

          if (intervalsToCreate.length > 0) {
            await prisma.streamViewerInterval.createMany({
              data: intervalsToCreate
            })
          }

          if (intervalUpdates.length > 0) {
            await prisma.$transaction(intervalUpdates)
          }
        }

        await prisma.stream.update({
          where: { id: stream.id },
          data: { nextPageToken: newPageToken }
        })

        results.push({ streamId: stream.id, status: "success", messagesProcessed: items.length })
      } catch (err) {
        results.push({ streamId: stream.id, status: "failed_processing_chat" })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
