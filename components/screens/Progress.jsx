'use client';

import { C, FlameIcon, ScreenTitle } from '@/components/ui';
import { LEARNED_BOX } from '@/lib/srs';

export default function Progress({ streak, phrases, reviews }) {
  const visible = phrases.filter((p) => !p.hidden);
  const withReview = visible.filter((p) => reviews[p.id]);
  const learned = withReview.filter((p) => reviews[p.id].box >= LEARNED_BOX).length;
  const learning = withReview.length - learned;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <ScreenTitle>Progress</ScreenTitle>

      <div style={{ background: '#fff', borderRadius: 24, padding: '26px 20px', marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <FlameIcon size={34} />
        <div style={{ fontSize: 42, fontWeight: 800, marginTop: 8, lineHeight: 1 }}>{streak}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginTop: 6 }}>day streak</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{learning}</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.sub, marginTop: 8 }}>in progress</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 20, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: C.greenDark }}>{learned}</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.sub, marginTop: 8 }}>learned</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 20, padding: 20, gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{visible.length}</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.sub, marginTop: 8 }}>phrases in topics</div>
        </div>
      </div>

      <div style={{
        fontSize: 12, fontWeight: 500, color: C.faint, lineHeight: 1.55, textAlign: 'center',
        padding: '24px 12px 0', marginTop: 'auto',
      }}>
        Phrases come back after 1, 2, 4, 7, 15, and 30 days. Didn't recall one? The cycle starts over — that's how it sticks in your memory.
      </div>
    </div>
  );
}
