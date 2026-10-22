# Thai Trainer — an app for learning spoken Thai

> No database, no setup. Content is bundled in `lib/content.js`; progress is
> stored in the browser (`lib/store.js`). It deploys to Vercel as-is.

## What it is
A spoken-Thai trainer (single-user per browser, no auth, no backend). Mobile-first
PWA. UI language — English. In the content, phrases are stored with the feminine
particle ค่ะ/คะ; for a male user the particle is substituted in the UI on the fly
(`lib/profile.js`, `ครับ`) via `NEXT_PUBLIC_USER_GENDER=male`. Thai replies
(THEY_SAY, the `thai` roles in dialogues) don't change the particle.

## Stack
- Next.js (App Router) + PWA, deployed to Vercel. No backend, no database.
- Content bundled in `lib/content.js`. Per-user state in `localStorage` (`lib/store.js`).
- Speech: Web Speech API `speechSynthesis`, voice `th-TH` (rate 0.85, "slow" = 0.6).
  If no Thai voice is found — show a hint to install a Thai TTS voice.
- Design: the reference is the already-implemented UI in `app/` + `components/`.
  Don't invent your own style — stick to the existing look.

## Data model (no DB — all in the browser)
`lib/content.js` holds the bundled phrases:
```
{ id, ru, th, tr, deck, source, hidden, video_id, created_at }
```
- `ru` — the meaning (English), `th` — Thai, `tr` — transcription with tones.
- `deck` ∈ `base|num|coffee|resto|shop|market|massage`.
- `source` ∈ `seed|chat|manual|video`.
- `hidden` — words from videos start hidden until the clip is watched.
- `video_id` — the clip a `source='video'` word belongs to.

`lib/store.js` (localStorage) holds everything the user changes:
- `thai-reviews` — `{ [phrase_id]: { box, due_date, updated_at } }` (SRS state).
- `thai-activity` — `[{ day, did_review, did_new }]` (for the streak).
- `thai-watched` — `[{ video_id, words_added, watched_at }]`.
- `thai-hidden` — `{ [phrase_id]: boolean }`, overrides a phrase's default.
- `thai-custom` — phrases added by hand in the app (`source='manual'`).
- `thai-pinned-new` — words pushed into the next "Learn new" queue.

## SRS logic
- Intervals by box level: `[0, 1, 2, 4, 7, 15, 30]` days.
- Grades after showing a card: "Forgot" → box=0, show again in this same session;
  "Hard" → box unchanged; "Got it" → box+1 (max 6). due_date = today + interval[box].
- New phrases: 6 per day (phrases with no record in reviews, hidden=false).
- "Review" = all phrases with due_date <= today.
- Card: show the meaning → tap "Show answer" → TH large + transcription + 🔊/🐢
  (speech plays automatically on open) → three grade buttons.

## Streak
When a session finishes, write the day into `thai-activity`. The streak = an
unbroken chain of days with did_review or did_new. Gamification is minimal:
only the number of days, no leagues/rewards.

## Screens / features
1. **Today**: streak, plan (Review N / Learn new 6), a row of "📍 I'm now at…"
   buttons (coffee shop, café, shop, market, massage), mission of the day.
2. **"I'm now at…"**: a 30-second cheat sheet before entering a place — a "Say this"
   block (5 key phrases with 🔊) + a "They might say" block (common Thai replies
   with translation and 🔊). Thai replies — see THEY_SAY in `lib/data.js`.
3. **Decks**: a list of decks with progress → inside, a list of phrases
   (🔊, hide ✗ / restore ↩, "Train"), a "➕ Add phrase" button (ru/th/tr + deck,
   stored with `source='manual'` in `thai-custom`).
4. **Dialogues**: step-by-step mini-dialogues (coffee shop, café, 7-Eleven). The
   Thai's lines are spoken automatically; your lines: the meaning is shown, you say
   it out loud, then "Show answer" → TH+transcription+🔊. Dialogues live in `lib/data.js`.
5. **Tones**: 5 tones, each with a 🔊 example word (including ใหม่/ไม่/ไม้/หม้าย).
   Explanation through imagery ("falling — like a stern No!").
6. **Progress**: in progress / learned (box>=4) / streak / total phrases.

## Content pipeline
Phrases are edited in `lib/content.js`. To add a batch, append rows to the phrase
list and regenerate ids with `scripts/gen-content.mjs`, or add them directly with a
new stable `id`. Add ad-hoc words in the app ("➕ Add phrase") — they go to
`localStorage` (`thai-custom`), not into the repo.

## Words from videos (source='video')
After a clip is watched, its words pop up and are added to learning. Mechanics:
- a clip's words live in `lib/content.js` with `source='video'`, `video_id=<id>`,
  `hidden=true` (so they don't clutter "new" words until the video is watched);
- tapping "Watch" on the Videos tab records the clip in `thai-watched`;
- on app open, `app/page.jsx` finds the most recently watched clip with
  `words_added=false` that has words, and shows `VideoWords.jsx`;
- the words are added **in any case** (both via "Start now" and the close button):
  the hidden override is cleared, the words are pinned into the "Learn new" queue,
  `words_added=true` is set. "Start now" additionally opens a video lesson.

Filling in the words — strictly from the clip's transcript (don't make things up).
Collecting subtitles: `scripts/fetch_transcripts.py` or manually from YouTube; pick
out the Thai phrases, add tones/meaning/particles ค่ะ/คะ, dedup against existing
`th`, add under the right `video_id` (topic — from `VIDEOS[].deck` in `lib/data.js`).

## What NOT to do
- Don't add auth, payments, a backend, or UI multi-language.
- Don't re-introduce a database — progress is per-browser by design.
- Don't over-complicate gamification.
- Don't change the design "to taste".
