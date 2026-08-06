import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email || "" }
    })
    if (!dbUser || !dbUser.googleRefreshToken) {
      return NextResponse.json({ error: "Streamer credentials not found" }, { status: 400 })
    }

    const { action } = await req.json()

    if (action === "start") {
      const activeStream = await prisma.stream.findFirst({
        where: { userId: dbUser.id, status: "LIVE" }
      })
      if (activeStream) {
        return NextResponse.json({ error: "Already tracking an active stream" }, { status: 400 })
      }

      let accessToken = ""
      try {
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID || "",
            client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
            refresh_token: dbUser.googleRefreshToken,
            grant_type: "refresh_token"
          })
        })
        const tokens = await tokenRes.json()
        accessToken = tokens.access_token
      } catch (err) {
        return NextResponse.json({ error: "Failed to authenticate with YouTube" }, { status: 500 })
      }

      if (!accessToken) {
        return NextResponse.json({ error: "Failed to retrieve access token" }, { status: 500 })
      }

      let youtubeStreamId = ""
      let title = ""
      let liveChatId = ""

      const broadcastRes = await fetch(
        "https://www.googleapis.com/youtube/v3/liveBroadcasts?broadcastStatus=active&part=snippet,contentDetails",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const broadcastData = await broadcastRes.json()
      const broadcast = broadcastData.items?.[0]

      if (broadcast) {
        youtubeStreamId = broadcast.id
        title = broadcast.snippet?.title || "Live Stream"
        liveChatId = broadcast.contentDetails?.activeLiveChatId || ""
      } else if (dbUser.youtubeChannelId) {
        const searchRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?channelId=${dbUser.youtubeChannelId}&eventType=live&type=video&part=snippet`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const searchData = await searchRes.json()
        const searchItem = searchData.items?.[0]

        if (searchItem) {
          youtubeStreamId = searchItem.id?.videoId
          title = searchItem.snippet?.title || "Live Stream"

          const videoRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${youtubeStreamId}&part=liveStreamingDetails`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          )
          const videoData = await videoRes.json()
          liveChatId = videoData.items?.[0]?.liveStreamingDetails?.activeLiveChatId || ""
        }
      }

      if (!youtubeStreamId || !liveChatId) {
        return NextResponse.json({
          error: "No active live stream found. Make sure your stream is live on YouTube!"
        }, { status: 400 })
      }

      const stream = await prisma.stream.upsert({
        where: { youtubeStreamId },
        update: { status: "LIVE", liveChatId },
        create: {
          userId: dbUser.id,
          youtubeStreamId,
          title,
          status: "LIVE",
          liveChatId
        }
      })

      return NextResponse.json({ success: true, stream })
    } else if (action === "stop") {
      const activeStream = await prisma.stream.findFirst({
        where: { userId: dbUser.id, status: "LIVE" }
      })

      if (!activeStream) {
        return NextResponse.json({ error: "No stream is currently being tracked" }, { status: 400 })
      }

      await prisma.stream.update({
        where: { id: activeStream.id },
        data: { status: "ENDED", endedAt: new Date() }
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
