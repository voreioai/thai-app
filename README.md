# Thai Trainer

A personal spoken-Thai trainer. Mobile-first PWA: spaced repetition,
"I'm now at…" cheat sheets, mini-dialogues, tones, words from videos.
The content is hand-checked, and setup runs **as a conversation with Claude** — it
personalizes the app for you and fills the database.

## Screenshots

![Thai Trainer — Today, Topics, Tones, Videos and Progress screens](docs/screenshots/overview.png)

## Key value
- Ready, hand-checked content (≈220 phrases across 7 topics, dialogues, tones).
- Personalization: your name, gender (polite particle), your topics.
- Adding phrases and words from videos through a chat with Claude (Supabase connector).

## Quick start (via Claude Code)
1. Fork/clone the repository, open the folder in Claude Code.
2. Connect the Supabase connector to Claude.
3. Say: **"set up"** — the `/setup` skill runs: interview → database → content →
   `.env.local` → launch. Optionally deploys to Vercel.

Without Claude: see [docs/manual-setup.md](docs/manual-setup.md).

## Stack
Next.js (App Router) + PWA → Vercel · Supabase (directly from the client) ·
speech via the Web Speech API (`th-TH`).

## Structure
- `app/page.jsx` — shell: tabs, data loading, SRS.
- `components/screens/` — screens (Today, "I'm now at…", Topics, Lesson,
  Dialogues, Tones, Progress, Videos).
- `lib/srs.js` — spaced repetition and streak.
- `lib/profile.js` — name and polite particle by gender.
- `lib/data.js` — deck presentation, Thai replies, dialogues, tones, videos.
- `supabase/` — `schema.sql` and `seed.sql`.

## Roadmap
See [docs/roadmap.md](docs/roadmap.md).

## License
MIT.
