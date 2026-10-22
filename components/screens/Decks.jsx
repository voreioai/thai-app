'use client';

import { C, Icon, ScreenTitle } from '@/components/ui';
import { DECK_META, DECK_ORDER } from '@/lib/data';
import { plural, LEARNED_BOX } from '@/lib/srs';

export default function Decks({ phrases, reviews, onDeck, onAdd }) {
  const decks = DECK_ORDER.map((key) => {
    const all = phrases.filter((p) => p.deck === key && !p.hidden);
    const learned = all.filter((p) => (reviews[p.id]?.box ?? -1) >= LEARNED_BOX).length;
    // Started: already seen in a session, but not yet learned
    const started = all.filter((p) => reviews[p.id] && reviews[p.id].box < LEARNED_BOX).length;
    const total = all.length;
    return {
      key,
      ...DECK_META[key],
      total,
      learned,
      started,
      pct: total > 0 ? Math.round((learned / total) * 100) : 0,
      startedPct: total > 0 ? Math.round((started / total) * 100) : 0,
    };
  });

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <ScreenTitle>Topics</ScreenTitle>
        <div className="press-sm" onClick={onAdd} style={{
          width: 44, height: 44, borderRadius: 999, background: '#17181A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon d="M12 5v14M5 12h14" size={18} color="#fff" width={1.8} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        {decks.map((d) => (
          <div key={d.key} className="press" onClick={() => onDeck(d.key)}
            style={{ background: '#fff', borderRadius: 20, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon d={d.icon} size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 800 }}>{d.name}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.sub, marginTop: 2 }}>
                  {d.learned} of {d.total} {plural(d.total, 'phrase', 'phrases')} learned
                  {d.started > 0 ? ` · ${d.started} in progress` : ''}
                </div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon d="M9 6l6 6-6 6" size={14} width={1.8} />
              </div>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: '#F1F1EF', marginTop: 14, overflow: 'hidden', display: 'flex' }}>
              <div style={{ height: 6, background: C.green, width: `${d.pct}%`, flexShrink: 0 }} />
              <div style={{ height: 6, background: C.lime, width: `${d.startedPct}%`, flexShrink: 0 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
