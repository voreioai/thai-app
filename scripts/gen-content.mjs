// Parse the public seed.sql into lib/content.js (embedded, no DB).
import fs from 'node:fs';

const sql = fs.readFileSync(process.argv[2], 'utf8');
const marker = 'values';
const start = sql.indexOf(marker, sql.indexOf('insert into phrases'));
const body = sql.slice(start + marker.length);

// Tokenize top-level rows: ( ... ) , ... respecting single-quoted strings (no escapes in this file).
const rows = [];
let i = 0, inStr = false, depth = 0, cur = '';
for (; i < body.length; i++) {
  const c = body[i];
  if (inStr) {
    cur += c;
    if (c === "'") inStr = false;
    continue;
  }
  if (c === "'") { inStr = true; cur += c; continue; }
  if (c === '(') { depth++; if (depth === 1) { cur = ''; continue; } }
  if (c === ')') { depth--; if (depth === 0) { rows.push(cur); cur = ''; continue; } }
  if (depth >= 1) cur += c;
  if (c === ';' && depth === 0) break;
}

function splitFields(s) {
  const out = [];
  let inStr = false, f = '';
  for (let k = 0; k < s.length; k++) {
    const c = s[k];
    if (inStr) { f += c; if (c === "'") inStr = false; continue; }
    if (c === "'") { inStr = true; f += c; continue; }
    if (c === ',') { out.push(f.trim()); f = ''; continue; }
    f += c;
  }
  out.push(f.trim());
  return out;
}
const unq = (v) => (v.startsWith("'") ? v.slice(1, -1) : v);

// Stable id from th|ru|deck, uniqueness guaranteed with a suffix on collision.
function hash(str) {
  let h = 5381;
  for (let k = 0; k < str.length; k++) h = ((h << 5) + h + str.charCodeAt(k)) >>> 0;
  return h.toString(36);
}
const seen = new Map();
const base = Date.parse('2026-07-13T00:00:00Z');

const items = rows.map((r, idx) => {
  const [ru, th, tr, deck, source, hidden, video] = splitFields(r);
  let id = 's' + hash(`${unq(th)}|${unq(ru)}|${unq(deck)}`);
  const n = seen.get(id) || 0; seen.set(id, n + 1);
  if (n) id += '-' + n;
  return {
    id,
    ru: unq(ru),
    th: unq(th),
    tr: unq(tr),
    deck: unq(deck),
    source: unq(source),
    hidden: hidden === 'true',
    video_id: video === 'null' ? null : unq(video),
    created_at: new Date(base + idx * 60000).toISOString(),
  };
});

const out =
  `// AUTO-GENERATED from the public starter content (originally supabase/seed.sql).\n` +
  `// ${items.length} hand-checked phrases across 7 topics. Feminine particle ค่ะ/คะ;\n` +
  `// the masculine one is substituted in the UI (lib/profile.js) when NEXT_PUBLIC_USER_GENDER=male.\n` +
  `// Words from videos (source='video') start hidden and appear after the clip is watched.\n` +
  `// Regenerate with scripts/gen-content.mjs. Progress is stored per-browser (lib/store.js).\n\n` +
  `export const CONTENT = ${JSON.stringify(items, null, 2)};\n`;

fs.writeFileSync(process.argv[3], out);
console.log(`wrote ${items.length} phrases ->`, process.argv[3]);
// sanity
const byDeck = {}; const bySource = {};
for (const p of items) { byDeck[p.deck] = (byDeck[p.deck]||0)+1; bySource[p.source]=(bySource[p.source]||0)+1; }
console.log('by deck:', byDeck);
console.log('by source:', bySource);
console.log('hidden(video):', items.filter(p=>p.hidden).length, 'uniqueIds:', new Set(items.map(p=>p.id)).size);
