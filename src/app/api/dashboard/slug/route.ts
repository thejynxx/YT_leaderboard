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

    const { slug } = await req.json()
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "")
    if (cleanSlug.length < 3) {
      return NextResponse.json({ error: "Slug must be at least 3 characters" }, { status: 400 })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        customSlug: cleanSlug,
        NOT: { email: session.user.email || "" }
      }
    })

    if (existingUser) {
      return NextResponse.json({ error: "Slug is already in use" }, { status: 400 })
    }

    await prisma.user.update({
      where: { email: session.user.email || "" },
      data: { customSlug: cleanSlug }
    })

    return NextResponse.json({ success: true, slug: cleanSlug })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
