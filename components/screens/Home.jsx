'use client';

import { C, Icon, FlameIcon, SpeakBtn, SectionLabel } from '@/components/ui';
import { PLACES, missionOfToday } from '@/lib/data';
import { plural, NEW_PER_DAY, LEARNED_BOX } from '@/lib/srs';
import { USER_NAME, applyGender } from '@/lib/profile';

// Round action button next to a word: ➕ "learn today" / ✓ "already know"
function WordActionBtn({ active, d, onClick }) {
  return (
    <div className="press-sm" onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 999, background: active ? C.lime : C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon d={d} size={15} width={2} />
    </div>
  );
}

export default function Home({
  streak, newCount, reviewCount, chatCount, recentWords = [], reviews = {}, pinnedIds = [],
  onTogglePin, onToggleLearned, onStartNew, onStartReview, onPlace,
}) {
  const mission = missionOfToday();
  const hasNew = newCount > 0;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="thai" style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1 }}>สวัสดี {USER_NAME}</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.sub, marginTop: 3 }}>sà-wàt-dii khâ · Sawasdee</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', borderRadius: 999, padding: '8px 13px', flexShrink: 0 }}>
          <FlameIcon />
          <span style={{ fontSize: 14, fontWeight: 800 }}>{streak}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, overflowX: 'auto', margin: '18px -20px 0', padding: '0 20px' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.faint, flexShrink: 0 }}>📍 I am now at:</span>
        {PLACES.map((p) => (
          <span key={p.deck} className="press" onClick={() => onPlace(p.deck)}
            style={{ background: '#fff', borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
            {p.name}
          </span>
        ))}
      </div>

      <div style={{ background: '#17181A', borderRadius: 24, padding: '22px 20px 20px', marginTop: 20 }}>
        <SectionLabel color={C.lime}>TODAY</SectionLabel>
        <div style={{ fontSize: 21, fontWeight: 800, color: '#fff', marginTop: 8 }}>
          {hasNew ? 'Learn something new' : 'All new phrases learned'}
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
          {hasNew
            ? `${newCount} ${plural(newCount, 'new phrase', 'new phrases')} · up to ${NEW_PER_DAY} per day`
            : 'New phrases will appear from your chat with Claude'}
        </div>
        {chatCount > 0 && (
          <div style={{ fontSize: 13, fontWeight: 700, color: C.lime, marginTop: 6 }}>
            New from chat with Claude: {chatCount}
          </div>
        )}
        {hasNew && (
          <div className="press" onClick={onStartNew} style={{
            background: C.lime, color: C.text, borderRadius: 999, height: 50, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, marginTop: 18,
          }}>
            Start session
          </div>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: 24, padding: 18, marginTop: 12, display: 'flex', alignItems: 'center', gap: 14, opacity: reviewCount > 0 ? 1 : 0.6 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon d="M20 12a8 8 0 1 1-2.3-5.6M20 3v4h-4" size={20} width={1.8} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>Review</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.sub, marginTop: 2 }}>
            {reviewCount > 0
              ? `${reviewCount} ${plural(reviewCount, 'phrase', 'phrases')} waiting for review`
              : 'Nothing to review yet 🎉'}
          </div>
        </div>
        {reviewCount > 0 && (
          <div className="press-sm" onClick={onStartReview} style={{
            width: 40, height: 40, borderRadius: 999, background: '#17181A', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon d="M7 17L17 7M9 7h8v8" size={16} color="#fff" width={1.8} />
          </div>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: 24, padding: 18, marginTop: 12 }}>
        <SectionLabel>MISSION OF THE DAY</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.35 }}>{mission.text}</div>
            <div className="thai" style={{ fontSize: 15, fontWeight: 600, color: '#55564F', marginTop: 6 }}>{applyGender(mission.th)}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.greenDark, marginTop: 2 }}>{applyGender(mission.tr)}</div>
          </div>
          <SpeakBtn text={mission.th} />
        </div>
      </div>

      {recentWords.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 24, padding: 18, marginTop: 12 }}>
          <SectionLabel>RECENT WORDS</SectionLabel>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: C.faint, marginTop: 6 }}>
            + to today's session · ✓ already know
          </div>
          <div style={{ marginTop: 4 }}>
            {recentWords.map((w, i) => {
              const learned = (reviews[w.id]?.box ?? -1) >= LEARNED_BOX;
              const isNew = !reviews[w.id];
              const queued = pinnedIds.includes(w.id);
              return (
                <div key={w.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0',
                  borderTop: i === 0 ? 'none' : `1px solid ${C.line}`,
                }}>
                  <div style={{ flex: 1, minWidth: 0, opacity: learned ? 0.45 : 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.3 }}>{w.tr}</div>
                    <div className="thai" style={{ fontSize: 17, fontWeight: 700, color: '#55564F', marginTop: 2 }}>{w.th}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.sub, marginTop: 3 }}>{w.ru}</div>
                  </div>
                  {isNew && (
                    <WordActionBtn active={queued} d="M12 5v14M5 12h14" onClick={() => onTogglePin(w)} />
                  )}
                  <WordActionBtn active={learned} d="M5 12.5l4.5 4.5L19 7.5" onClick={() => onToggleLearned(w)} />
                  <SpeakBtn text={w.th} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
