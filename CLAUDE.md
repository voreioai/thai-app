# Thai Trainer — an app for learning spoken Thai

> No `.env.local`? Run the `/setup` skill — it runs an interview and configures the app. The manual path is in `docs/manual-setup.md`.

## What it is
A personal spoken-Thai trainer (single-user, no auth, no multi-user). Mobile-first PWA. UI language — English. The user's name and gender are set in `.env.local` (`NEXT_PUBLIC_USER_NAME`, `NEXT_PUBLIC_USER_GENDER`). In the database, phrases are stored with the feminine particle ค่ะ/คะ; for a male user the particle is substituted in the UI on the fly (`lib/profile.js`, `ครับ`). Thai replies (THEY_SAY, the `thai` roles in dialogues) don't change the particle.

## Stack
- Next.js (App Router) + PWA, deployed to Vercel
- Supabase (cloud, connected directly from the client, no backend of our own)
- Speech: Web Speech API `speechSynthesis`, voice `th-TH` (rate 0.85, "slow" = 0.6). If no Thai voice is found — show a hint to install a Thai TTS voice.
- Design: the reference is the already-implemented UI in `app/` + `components/`. Don't invent your own style — stick to the existing look.

## Supabase
- URL: filled in from .env.local (see .env.example and /setup)
- Publishable key (can go in the client): filled in from .env.local (see .env.example and /setup)
- RLS enabled, allow-all policies (personal app).

### Schema (DDL — `supabase/schema.sql`, starter content — `supabase/seed.sql`)
```sql
phrases (
  id uuid pk,
  ru text, th text, tr text,          -- meaning, Thai, transcription with tones
  deck text check in ('base','num','coffee','resto','shop','market','massage'),
  source text default 'seed',          -- 'seed' | 'chat' | 'manual' | 'video'
  hidden boolean default false,        -- hidden from learning
  video_id text,                       -- clip id, if the word is from a video (source='video')
  created_at timestamptz
)
reviews (
  phrase_id uuid pk fk->phrases,
  box int default 0,                   -- spaced-repetition level
  due_date date,                       -- when to show it again
  updated_at timestamptz
)
activity (
  day date pk,
  did_review boolean, did_new boolean  -- for computing the streak on the server
)
watched_videos (
  video_id text pk,                    -- watched clips (the "Videos" tab)
  words_added boolean default false,   -- the clip's words have already been offered/added (popup shown)
  watched_at timestamptz
)
```
The starter `seed.sql` holds hand-checked phrases in 7 decks. The app takes content ONLY from the database, nothing hardcoded.

## SRS logic (carry over as-is)
- Intervals by box level: `[0, 1, 2, 4, 7, 15, 30]` days.
- Grades after showing a card: "Forgot" → box=0, show again in this same session; "Hard" → box unchanged; "Got it" → box+1 (max 6). due_date = today + interval[box].
- New phrases: 6 per day (phrases with no record in reviews, hidden=false).
- "Review" = all phrases with due_date <= today.
- Card: show the meaning → tap "Show answer" → TH large + transcription + 🔊/🐢 buttons (speech plays automatically on open) → three grade buttons.

## Streak
When a session finishes, write to `activity` (upsert by day). The streak = an unbroken chain of days with did_review or did_new, computed from the table. Gamification is minimal: only the number of days, no leagues/rewards.

## Screens / features
1. **Today**: streak, plan (Review N / Learn new 6), a row of "📍 I'm now at…" buttons (coffee shop, café, shop, market, massage), mission of the day.
2. **"I'm now at…"** (the main feature): a 30-second cheat sheet before entering a place — a "Say this" block (5 key phrases of the deck with 🔊) + a "They might say" block (common Thai replies with translation and 🔊). Thai replies — see THEY_SAY below — can live in code or be moved to a table, your choice.
3. **Decks**: a list of decks with progress → inside, a list of phrases (🔊, hide ✗ / restore ↩, "Train"), a "➕ Add phrase" button (ru/th/tr + deck choice, insert with source='chat' done manually here = 'manual').
4. **Dialogues**: step-by-step mini-dialogues (coffee shop, café, 7-Eleven). The Thai's lines are spoken automatically; your lines: the meaning is shown, you say it out loud, then "Show answer" → TH+transcription+🔊. IMPORTANT: in the café dialogue, do NOT ask "how many people" — in real places they usually don't ask that.  Dialogues can live in code.
5. **Tones**: 5 tones, each with a 🔊 button with an example word (including the classic set ใหม่/ไม่/ไม้/หม้าย for demonstration). Explanation through imagery ("falling — like a stern No!").
6. **Progress**: in progress / learned (box>=4) / streak / total phrases.

## THEY_SAY (Thai replies for "I'm now at…")
coffee shop: ร้อนหรือเย็นคะ (hot or cold?), แก้วไหนคะ (which size?), หวานปกติไหมคะ (normal sweetness?), ทานที่นี่หรือเอากลับคะ (for here or to go?), ...บาทค่ะ (price)
café: รับอะไรดีคะ (what would you like?), รับน้ำอะไรคะ (what to drink?), เผ็ดได้ไหมคะ (spicy okay?), รับอะไรเพิ่มไหมคะ (anything else?)
shop: รับถุงไหมคะ (a bag?), อุ่นไหมคะ (heat it up?), มีบัตรสมาชิกไหมคะ (membership card?), จ่ายเงินสดหรือสแกนคะ (cash or QR?), ทั้งหมด...บาทค่ะ (total)
market: เอากี่โลคะ (how many kilos?), เอาอะไรอีกไหมคะ (anything else?)
massage: นวดอะไรดีคะ (which massage?), กี่ชั่วโมงคะ (how many hours?), หนักไหมคะ (pressure okay?), เจ็บไหมคะ (does it hurt?), เปลี่ยนชุดค่ะ (please change clothes)

## Content pipeline
Phrases are added to the database from the user's chats with Claude (Supabase connector) with source='chat'. The app should simply show them as new — no special logic needed, but on "Today" you can show a "+N new from chat" badge if phrases with source='chat' that aren't in reviews appear.

## Words from videos (source='video')
After a clip is watched, its words pop up and are added to learning. Mechanics:
- a clip's words live in `phrases` with `source='video'`, `video_id=<id>`, initially `hidden=true` (so they don't clutter the general pool of "new" words until the video is watched);
- tapping "Watch" on the Videos tab writes a row into `watched_videos`;
- on app open, `app/page.jsx` finds the most recently watched clip with `words_added=false` that has words, and shows `VideoWords.jsx`;
- the words are added **in any case** (both via "Start now" and via the close button): hidden is cleared, the words are pinned into the "Learn new" queue, words_added=true is set. "Start now" additionally opens a lesson (mode `lesson.mode='video'` by the `phraseIds` list).
- on the Videos tab, a clip with words has a "Learn words" button — to finish learning them at any time.

Filling in the words — strictly from the clip's transcript (don't make things up). Collecting subtitles: `scripts/fetch_transcripts.py` or manually from YouTube; Claude picks out the Thai phrases, adds tones/meaning/particles ค่ะ/คะ, dedups against existing `th`, inserts under the right `video_id` (topic — from `VIDEOS[].deck` in `lib/data.js`). Already set up as examples: verbs (RJGG9hOJOVo) and pronouns (Vrgeac31-Cw).

## What NOT to do
- Don't add auth, payments, or UI multi-language.
- Don't change the DB schema unless necessary; don't overwrite existing data.
- Don't over-complicate gamification.
- Don't change the design mockup "to taste".
