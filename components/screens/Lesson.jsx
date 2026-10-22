'use client';

import { useEffect, useRef, useState } from 'react';
import { C, Icon, BackBtn, SpeakBtn, SlowBtn, NoVoiceHint } from '@/components/ui';
import { speak } from '@/lib/tts';

const GRADES = [
  { key: 'again', label: 'Forgot', bg: '#F6E2DE', icon: 'M6 6l12 12M18 6L6 18', color: '#C4453A', w: 2 },
  { key: 'hard', label: 'Hard', bg: '#F4EAD0', icon: 'M4 12c2.5-3.5 5.5-3.5 8 0s5.5 3.5 8 0', color: '#A87B12', w: 2 },
  { key: 'good', label: 'Got it', bg: '#C6F150', icon: 'M5 12.5l4.5 4.5L19 7.5', color: '#17181A', w: 2.2 },
];

// Crossed-out eye — "hide from learning"
const HIDE_ICON = 'M3 3l18 18M10.6 5.1A10.9 10.9 0 0112 5c6.5 0 10 7 10 7a18.2 18.2 0 01-3.2 4M6.5 6.5C3.9 8.2 2 12 2 12s3.5 7 10 7c1.5 0 2.8-.3 4-.9M9.9 9.9a3 3 0 104.2 4.2';

// Session: show the meaning → "Show answer" → TH + transcription + speech → grade.
// "Forgot" sends the card back to the end of the queue in this same session.
export default function Lesson({ title, initialQueue, noVoice, onGrade, onHide, onFinish, onExit }) {
  const [queue, setQueue] = useState(initialQueue);
  const [idx, setIdx] = useState(0);
  const [rev, setRev] = useState(false);
  const [done, setDone] = useState(false);
  const counted = useRef(false);

  const phrase = queue[idx];
  const total = initialQueue.length;

  useEffect(() => {
    if (rev && phrase) speak(phrase.th);
  }, [rev]); // eslint-disable-line react-hooks/exhaustive-deps

  const grade = (g) => {
    onGrade(phrase, g);
    // Count the day toward the streak right after the first grade — even if the session
    // is not finished (otherwise partial sessions never make it into activity)
    if (!counted.current) {
      counted.current = true;
      onFinish();
    }
    let nextQueue = queue;
    if (g === 'again') nextQueue = [...queue, phrase];
    setQueue(nextQueue);
    setRev(false);
    if (idx + 1 >= nextQueue.length) setDone(true);
    else setIdx(idx + 1);
  };

  // Hide a phrase from learning right from the card: remove it from the queue (and its
  // "Forgot" repeats) and move on, without grading
  const hide = (e) => {
    e.stopPropagation();
    onHide(phrase);
    const nextQueue = queue.filter((p, i) => i <= idx || p.id !== phrase.id);
    setQueue(nextQueue);
    setRev(false);
    if (idx + 1 >= nextQueue.length) setDone(true);
    else setIdx(idx + 1);
  };

  const hideBtn = onHide && (
    <div className="press-sm" onClick={hide} title="Hide from learning" style={{
      position: 'absolute', top: 8, right: 8, width: 40, height: 40, zIndex: 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.55,
    }}>
      <Icon d={HIDE_ICON} size={17} color={C.faint} width={1.7} />
    </div>
  );

  const filled = done ? total : Math.min(idx, total);
  const segs = initialQueue.map((_, i) => ({ on: i < filled }));

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <BackBtn x onClick={onExit} />
        <div style={{ flex: 1, display: 'flex', gap: 4 }}>
          {segs.map((s, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: s.on ? C.green : '#E7E7E5' }} />
          ))}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.sub, flexShrink: 0 }}>{title}</div>
      </div>

      {noVoice && !done && <NoVoiceHint />}

      {!done && phrase && !rev && (
        <div onClick={() => setRev(true)} style={{ position: 'relative', marginTop: 32, cursor: 'pointer' }}>
          <div style={{ position: 'absolute', left: 24, right: 24, bottom: -16, height: 40, background: 'rgba(255,255,255,0.4)', borderRadius: 28 }} />
          <div style={{ position: 'absolute', left: 12, right: 12, bottom: -8, height: 40, background: 'rgba(255,255,255,0.7)', borderRadius: 28 }} />
          <div className="press" style={{
            position: 'relative', background: '#fff', borderRadius: 28, padding: '40px 24px 28px', minHeight: 380,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', boxSizing: 'border-box',
          }}>
            {hideBtn}
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: C.faint }}>TRANSLATE INTO THAI</div>
            <div style={{ fontSize: 31, fontWeight: 800, marginTop: 16, letterSpacing: -0.5 }}>{phrase.ru}</div>
            <div style={{
              position: 'absolute', bottom: 26, left: 0, right: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 7, color: C.faint, fontSize: 12, fontWeight: 600,
            }}>
              <Icon d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6zM15 12a3 3 0 11-6 0 3 3 0 016 0z" size={14} color={C.faint} />
              tap to see the answer
            </div>
          </div>
        </div>
      )}

      {!done && phrase && rev && (
        <>
          <div style={{ position: 'relative', marginTop: 32 }}>
            <div style={{ position: 'absolute', left: 24, right: 24, bottom: -16, height: 40, background: 'rgba(255,255,255,0.4)', borderRadius: 28 }} />
            <div style={{ position: 'absolute', left: 12, right: 12, bottom: -8, height: 40, background: 'rgba(255,255,255,0.7)', borderRadius: 28 }} />
            <div style={{
              position: 'relative', background: '#fff', borderRadius: 28, padding: '36px 24px', minHeight: 380,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', boxSizing: 'border-box',
            }}>
              {hideBtn}
              <div style={{ fontSize: 13, fontWeight: 700, color: C.sub }}>{phrase.ru}</div>
              <div className="thai" style={{ fontSize: 38, fontWeight: 700, marginTop: 18, letterSpacing: -0.5 }}>{phrase.th}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.greenDark, marginTop: 8 }}>{phrase.tr}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 26 }}>
                <SpeakBtn text={phrase.th} size={46} />
                <SlowBtn text={phrase.th} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginTop: 30 }}>
            {GRADES.map((g) => (
              <div key={g.key} onClick={() => grade(g.key)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <div className="press-sm" style={{
                  width: 58, height: 58, borderRadius: 999, background: g.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon d={g.icon} size={g.key === 'good' ? 22 : 20} color={g.color} width={g.w} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.sub }}>{g.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {done && (
        <div style={{
          background: '#17181A', borderRadius: 28, marginTop: 32, padding: '40px 24px', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          minHeight: 380, boxSizing: 'border-box',
        }}>
          <div style={{ width: 60, height: 60, borderRadius: 999, background: C.lime, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d="M5 12.5l4.5 4.5L19 7.5" size={26} width={2.2} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 18 }}>Session complete</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginTop: 6, lineHeight: 1.5 }}>
            All phrases done — they will come back<br />on the review schedule
          </div>
          <div className="press" onClick={onExit} style={{
            background: C.lime, color: C.text, borderRadius: 999, height: 52, width: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, marginTop: 32,
          }}>
            Done
          </div>
        </div>
      )}
    </div>
  );
}
