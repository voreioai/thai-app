'use client';

import { C, Icon, BackBtn, SpeakBtn } from '@/components/ui';
import { DECK_META } from '@/lib/data';
import { plural, LEARNED_BOX } from '@/lib/srs';

export default function Deck({ deck, phrases, reviews, onBack, onTrain, onToggleHidden }) {
  const meta = DECK_META[deck];
  const all = phrases.filter((p) => p.deck === deck);
  const visible = all.filter((p) => !p.hidden);
  const learned = visible.filter((p) => (reviews[p.id]?.box ?? -1) >= LEARNED_BOX).length;

  return (
    <div className="fade-in">
      <BackBtn onClick={onBack} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon d={meta.icon} size={24} />
        </div>
        <div>
          <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -0.5 }}>{meta.name}</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.sub, marginTop: 2 }}>
            {learned} of {visible.length} {plural(visible.length, 'phrase', 'phrases')} learned
          </div>
        </div>
      </div>

      {visible.length > 0 && (
        <div className="press" onClick={onTrain} style={{
          background: '#17181A', color: '#fff', borderRadius: 999, height: 52, display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: 9, fontSize: 15, fontWeight: 800, marginTop: 18,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z" fill={C.lime} /></svg>
          Train · {visible.length} {plural(visible.length, 'phrase', 'phrases')}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 24, marginTop: 16, overflow: 'hidden' }}>
        {all.map((p) => {
          const off = p.hidden;
          return (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
              borderBottom: `1px solid ${C.line}`, opacity: off ? 0.45 : 1,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, textDecoration: off ? 'line-through' : 'none' }}>{p.ru}</div>
                <div className="thai" style={{ fontSize: 14, fontWeight: 600, color: '#55564F', marginTop: 2 }}>{p.th}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.greenDark, marginTop: 2 }}>{p.tr}</div>
              </div>
              <SpeakBtn text={p.th} />
              <div className="press-sm" onClick={() => onToggleHidden(p)} style={{
                width: 36, height: 36, borderRadius: 999, background: off ? '#F2F8DC' : C.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon d={off ? 'M12 6v12M6 12h12' : 'M6 12h12'} size={15} color={off ? C.greenDark : C.sub} width={1.8} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: C.faint, lineHeight: 1.5, marginTop: 12, padding: '0 6px' }}>
        Minus removes a phrase from learning and reviews. Changed your mind? Bring it back with plus.
      </div>
    </div>
  );
}
