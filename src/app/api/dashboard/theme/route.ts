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

    const { themeBackground } = await req.json()

    await prisma.user.update({
      where: { email: session.user.email || "" },
      data: { themeBackground }
    })

    return NextResponse.json({ success: true, themeBackground })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
