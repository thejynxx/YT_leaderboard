# LoyalStream

LoyalStream is a production-ready Next.js application designed to track YouTube live stream viewer engagement in real-time, calculate watch times using a rolling 5-minute bucket algorithm, and compile a public Loyal Viewers Leaderboard for your channel.

## Features

- **Google OAuth Login:** Streamers securely authenticate with Google to access active live broadcasts.
- **YouTube Chat Polling:** Background cron workers fetch live chat messages using nextPageTokens and calculate watcher intervals.
- **Watch Credit Algorithm:** Reward viewers with 1 active watch interval (5 minutes) for every 5-minute bucket in which they send 2 or more chat messages.
- **Public Leaderboards:** Viewers search for their name on custom slug URL paths (e.g. `/leaderboard/your-custom-slug`) and track their rankings.
- **Prisma & Supabase:** Fully integrated with Prisma ORM and Supabase PostgreSQL.

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-nextauth-secret-key"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
CRON_SECRET="optional-cron-security-token"
```

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Initialize and sync database schema:
```bash
npx prisma db push
```

3. Run local development server:
```bash
npm run dev
```

Open `http://localhost:3000` to access the application.

## Vercel Deployment

1. Create a new project on Vercel and import this repository.
2. Configure all environment variables in the Vercel project settings.
3. Vercel automatically reads the `vercel.json` and schedules a cron job calling `/api/chat/poll` every 5 minutes.
4. Ensure you set the `Authorization: Bearer <your-cron-secret>` header for security if `CRON_SECRET` is defined.
