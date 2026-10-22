// Local store — replaces the database. Content is bundled (lib/content.js);
// all per-user state (progress, streak, hidden words, watched videos, phrases
// you add) lives in the browser's localStorage. Nothing leaves the device,
// and the app deploys to Vercel with zero setup.

import { CONTENT } from './content';

const K = {
  reviews: 'thai-reviews',     // { [phrase_id]: { phrase_id, box, due_date, updated_at } }
  activity: 'thai-activity',   // [{ day, did_review, did_new }]
  watched: 'thai-watched',     // [{ video_id, words_added, watched_at }]
  hidden: 'thai-hidden',       // { [phrase_id]: boolean } — overrides a phrase's default
  custom: 'thai-custom',       // [phrase] — phrases you added by hand
};

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

const newId = () =>
  'manual-' + (globalThis.crypto?.randomUUID?.() || Date.now() + '-' + Math.random().toString(36).slice(2));

// Everything the app needs on load — read synchronously from localStorage + bundled content.
export function loadAll() {
  const hidden = read(K.hidden, {});
  const custom = read(K.custom, []);
  const phrases = [...CONTENT, ...custom].map((p) =>
    p.id in hidden ? { ...p, hidden: hidden[p.id] } : p
  );
  return {
    phrases,
    reviews: read(K.reviews, {}),
    activity: read(K.activity, []),
    watchedVideos: read(K.watched, []),
  };
}

export function saveReview(row) {
  const r = read(K.reviews, {});
  r[row.phrase_id] = row;
  write(K.reviews, r);
}
export function deleteReview(phraseId) {
  const r = read(K.reviews, {});
  delete r[phraseId];
  write(K.reviews, r);
}

export function upsertActivity(row) {
  const a = read(K.activity, []).filter((x) => x.day !== row.day);
  a.push(row);
  write(K.activity, a);
}

export function setHidden(phraseId, hidden) {
  const h = read(K.hidden, {});
  h[phraseId] = hidden;
  write(K.hidden, h);
}
export function setHiddenMany(ids, hidden) {
  const h = read(K.hidden, {});
  for (const id of ids) h[id] = hidden;
  write(K.hidden, h);
}

export function getWatched() {
  return read(K.watched, []);
}
export function markWatched(videoId) {
  const w = read(K.watched, []);
  if (!w.some((x) => x.video_id === videoId)) {
    w.push({ video_id: videoId, words_added: false, watched_at: new Date().toISOString() });
    write(K.watched, w);
  }
  return w;
}
export function setWordsAdded(videoId) {
  const w = read(K.watched, []).map((x) =>
    x.video_id === videoId ? { ...x, words_added: true } : x
  );
  write(K.watched, w);
}

export function addCustomPhrase({ ru, th, tr, deck }) {
  const custom = read(K.custom, []);
  const phrase = {
    id: newId(), ru, th, tr, deck,
    source: 'manual', hidden: false, video_id: null,
    created_at: new Date().toISOString(),
  };
  custom.push(phrase);
  write(K.custom, custom);
  return phrase;
}
