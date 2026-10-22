#!/usr/bin/env python3
"""
Downloads subtitles (transcripts) of YouTube clips into the transcripts/ folder.
From these files you, together with Claude, pick out Thai words/phrases and add them
to the database as video words (source='video'), after which they surface in the app.

Why the script: the app and Claude in a session have no access to YouTube
(blocked by the network policy), so transcripts are collected on your own machine.

How to use:
  1. Install Python 3 and the library:
       pip install youtube-transcript-api
  2. Run from the project root:
       python scripts/fetch_transcripts.py
  3. Files <number>_<id>.txt appear in the transcripts/ folder.
     Send them to Claude (or paste the text into the chat) — I'll parse the words per video.

If a clip has no Thai subtitles — we take the English auto-subtitles,
which still show which phrases are covered in the video.
"""

import os
import sys

# The same 12 clips as in the app (lib/data.js → VIDEOS).
VIDEOS = [
    ("vpGdD9fgWsw", "The First 10 Thai Words You Must Know!"),
    ("RJGG9hOJOVo", "20 First-to-Know Thai Language Verbs"),
    ("Vrgeac31-Cw", "Ways to call yourself and others in Thai"),
    ("Y9gUTvhaVLI", "Basic Thai Language Grammar Rules!"),
    ("DBxro6aGCPk", "Thai ways to ending sentences"),
    ("fhcDc8Ge1d4", "Thai sentences based on English Tense"),
    ("RSlSpcaq9M0", "How to make questions in Thai"),
    ("Let5JPI2R0I", "What to say to motorcycle taxis"),
    ("u4af2z4sPq4", "What to say to a taxi driver"),
    ("nBeMnQZ_Knk", "How to order food in Thailand"),
    ("KRdLsDmiUpg", "How to order drinks in Thailand"),
    ("FSZFYNNYh38", "Counting in Thai — Numbers 1-10"),
]

# Languages in order of preference: Thai, then English (including auto).
LANGS = ["th", "en"]

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "transcripts")


def fetch_one(video_id):
    """Returns a list of subtitle lines or raises an exception."""
    try:
        # New API (youtube-transcript-api >= 1.0)
        from youtube_transcript_api import YouTubeTranscriptApi
        api = YouTubeTranscriptApi()
        fetched = api.fetch(video_id, languages=LANGS)
        return [snippet.text for snippet in fetched]
    except (ImportError, AttributeError, TypeError):
        # Old API (youtube-transcript-api < 1.0)
        from youtube_transcript_api import YouTubeTranscriptApi
        data = YouTubeTranscriptApi.get_transcript(video_id, languages=LANGS)
        return [row["text"] for row in data]


def main():
    try:
        import youtube_transcript_api  # noqa: F401
    except ImportError:
        print("The library is not installed. Run:\n  pip install youtube-transcript-api")
        sys.exit(1)

    os.makedirs(OUT_DIR, exist_ok=True)
    ok, failed = 0, []
    for i, (vid, title) in enumerate(VIDEOS, start=1):
        try:
            lines = fetch_one(vid)
            text = "\n".join(lines)
            path = os.path.join(OUT_DIR, f"{i:02d}_{vid}.txt")
            with open(path, "w", encoding="utf-8") as f:
                f.write(f"# Video {i}: {title}\n")
                f.write(f"# https://www.youtube.com/watch?v={vid}\n\n")
                f.write(text)
            print(f"[OK]   Video {i:2d}  {vid}  → {os.path.relpath(path)}  ({len(lines)} lines)")
            ok += 1
        except Exception as e:  # noqa: BLE001
            print(f"[SKIP] Video {i:2d}  {vid}  — no subtitles? ({type(e).__name__})")
            failed.append((i, vid, title))

    print(f"\nDone: {ok}/{len(VIDEOS)} clips. Files in: {OUT_DIR}")
    if failed:
        print("Without subtitles (open \"Show transcript\" on YouTube manually and send the text):")
        for i, vid, title in failed:
            print(f"  Video {i}: {title} — https://www.youtube.com/watch?v={vid}")


if __name__ == "__main__":
    main()
