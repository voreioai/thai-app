---
name: setup
description: Set up Thai Trainer for the user — interview (name, gender, country, topics), create the Supabase database, fill it with content, write .env.local, launch and deploy. Use on first run or when there is no .env.local.
---

# Thai Trainer setup

You guide the user through setup as a conversation. Don't dump everything at once —
go step by step, ask one question at a time, show progress.

## Step 0. Roadmap
Show the plan and an estimate (~15 minutes). What's needed: a Supabase account and
a Supabase connector connected to Claude; optionally Vercel for deployment.
Ask whether they're ready to start.

## Step 1. Interview (one question at a time)
1. Name (how to address them, goes into the greeting "สวัสดี …").
2. Gender — female or male (determines the polite particle ค่ะ/คะ vs ครับ).
3. Country (for the phrase "I'm from …").
4. Show the 7 topics: Basics, Numbers, Coffee shop, Café, Shop, Market, Massage.
   Ask: are they all a good fit? Anything to add?

## Step 2. Supabase database
- If the connector is connected: create a new project (or offer an existing one),
  run `supabase/schema.sql`, then `supabase/seed.sql`.
- If there's no connector — point them to `docs/manual-setup.md` and help step by step.
- Grab the Project URL and the anon (publishable) key.

## Step 3. Personal intro phrases
Generate them for the user and insert into `phrases` with `source='chat'`, `deck='base'`,
`hidden=false` (add the particle by gender: female ค่ะ, male ครับ):
- "My name is {name}" → `ฉันชื่อ{name}{particle}`
- "I'm from {country}" → `มาจาก{country}{particle}`
Give the transcription with tones. Transliterate the name/country into Thai carefully.

## Step 4. Extra topics
If the user asked for topics beyond the seven — add hand-checked phrases with
`source='chat'`, strict Thai with tones and the right particle, nothing made up.

## Step 5. .env.local
Create `.env.local` (see `.env.example`):
```
NEXT_PUBLIC_SUPABASE_URL=<url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
NEXT_PUBLIC_USER_NAME=<name>
NEXT_PUBLIC_USER_GENDER=<female|male>
```

## Step 6. Launch
```
npm install
npm run dev
```
Open http://localhost:3000 and make sure the greeting shows the name and phrases load.

## Step 7. Deploy (optional)
Offer Vercel: import the repository, the same 4 environment variables in the project
settings, deploy. Give them the production link.

## Notes
- The particle is substituted automatically in the UI (`lib/profile.js`) — the database
  always holds the feminine variant, don't duplicate the masculine one.
- Thai replies (THEY_SAY, the `thai` roles in dialogues) don't change the particle.
- The 12 videos in `lib/data.js → VIDEOS` are the starter Thai playlist; it can be
  replaced by asking Claude (see `scripts/fetch_transcripts.py`).
