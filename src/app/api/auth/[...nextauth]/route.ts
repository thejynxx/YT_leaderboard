import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly",
          access_type: "offline",
          prompt: "consent"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.googleId = account.providerAccountId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).refreshToken = token.refreshToken;
        (session.user as any).googleId = token.googleId;
        
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email || "" }
        })
        if (dbUser) {
          (session.user as any).id = dbUser.id;
          (session.user as any).youtubeChannelId = dbUser.youtubeChannelId;
          (session.user as any).customSlug = dbUser.customSlug;
        }
      }
      return session
    },
    async signIn({ user, account }) {
      if (!user.email || !account) return false
      
      let youtubeChannelId: string | null = null
      try {
        const res = await fetch(
          "https://www.googleapis.com/youtube/v3/channels?part=id&mine=true",
          {
            headers: {
              Authorization: `Bearer ${account.access_token}`
            }
          }
        )
        const data = await res.json()
        youtubeChannelId = data.items?.[0]?.id || null
      } catch (err) {}

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      })

      const defaultSlug = user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase() + Math.floor(1000 + Math.random() * 9000);

      if (existingUser) {
        await prisma.user.update({
          where: { email: user.email },
          data: {
            name: user.name || existingUser.name,
            googleId: account.providerAccountId,
            youtubeChannelId: youtubeChannelId || existingUser.youtubeChannelId,
            googleRefreshToken: account.refresh_token || existingUser.googleRefreshToken
          }
        })
      } else {
        await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            googleId: account.providerAccountId,
            youtubeChannelId: youtubeChannelId,
            googleRefreshToken: account.refresh_token,
            customSlug: defaultSlug
          }
        })
      }
      return true
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
