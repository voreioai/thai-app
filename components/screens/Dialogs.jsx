'use client';

import { useEffect, useState } from 'react';
import { C, Icon, BackBtn, ScreenTitle, SpeakBtn, SlowBtn, NoVoiceHint } from '@/components/ui';
import { DIALOGS } from '@/lib/data';
import { speak } from '@/lib/tts';
import { applyGender } from '@/lib/profile';

export default function Dialogs({ onOpen }) {
  return (
    <div className="fade-in">
      <ScreenTitle>Dialogues</ScreenTitle>
      <div style={{ fontSize: 13, fontWeight: 500, color: C.sub, marginTop: 6, lineHeight: 1.5 }}>
        Go through the dialogue out loud: the Thai lines are spoken for you, your own lines you say yourself, then check.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        {DIALOGS.map((d) => (
          <div key={d.id} className="press" onClick={() => onOpen(d.id)}
            style={{ background: '#fff', borderRadius: 20, padding: 16, display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon d={d.icon} size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15.5, fontWeight: 800 }}>{d.name}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.sub, marginTop: 2 }}>{d.sub}</div>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon d="M9 6l6 6-6 6" size={14} width={1.8} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Step-by-step dialogue player: the Thai lines are spoken automatically,
// your lines — the meaning is shown, say it out loud, then "Show answer"
export function DialogPlayer({ dialogId, noVoice, onBack }) {
  const dialog = DIALOGS.find((d) => d.id === dialogId);
  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const steps = dialog.steps.slice(0, step + 1);
  const current = dialog.steps[step];
  const isLast = step >= dialog.steps.length - 1;
  const canNext = current.who === 'thai' || revealed;

  useEffect(() => {
    if (current.who === 'thai') speak(current.th);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => {
    if (isLast) return;
    setRevealed(false);
    setStep(step + 1);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <BackBtn onClick={onBack} />
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>{dialog.name}</div>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: C.sub, marginTop: 1 }}>
            step {step + 1} of {dialog.steps.length}
          </div>
        </div>
      </div>

      {noVoice && <NoVoiceHint />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, paddingBottom: 10 }}>
        {steps.map((s, i) => {
          const isCurrent = i === step;
          if (s.who === 'thai') {
            return (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', maxWidth: '88%' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 999, background: '#17181A', color: C.lime,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0,
                }}>🇹🇭</div>
                <div style={{ background: '#fff', borderRadius: '18px 18px 18px 6px', padding: '12px 15px' }}>
                  <div className="thai" style={{ fontSize: 17, fontWeight: 700 }}>{s.th}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.greenDark, marginTop: 2 }}>{s.tr}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: C.sub, marginTop: 4 }}>{s.ru}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <SpeakBtn text={s.th} size={32} />
                    <SlowBtn text={s.th} height={32} />
                  </div>
                </div>
              </div>
            );
          }
          const open = !isCurrent || revealed;
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ background: '#17181A', borderRadius: '18px 18px 6px 18px', padding: '12px 15px', maxWidth: '88%' }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'rgba(255,255,255,0.45)' }}>
                  SAY IT IN THAI
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginTop: 4 }}>{s.ru}</div>
                {open ? (
                  <>
                    <div className="thai" style={{ fontSize: 17, fontWeight: 700, color: C.lime, marginTop: 8 }}>{applyGender(s.th)}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{applyGender(s.tr)}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <SpeakBtn text={applyGender(s.th)} size={32} bg="rgba(255,255,255,0.12)" color="#fff" />
                    </div>
                  </>
                ) : (
                  <div className="press" onClick={() => { setRevealed(true); speak(applyGender(s.th)); }} style={{
                    background: C.lime, color: C.text, borderRadius: 999, height: 38, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800,
                    marginTop: 10, padding: '0 16px',
                  }}>
                    Show answer
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {canNext && !isLast && (
        <div className="press" onClick={next} style={{
          background: '#17181A', color: '#fff', borderRadius: 999, height: 50, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, marginTop: 8,
        }}>
          Next
        </div>
      )}
      {canNext && isLast && (
        <div className="press" onClick={onBack} style={{
          background: C.lime, color: C.text, borderRadius: 999, height: 50, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, marginTop: 8,
        }}>
          Dialogue complete 🎉
        </div>
      )}
    </div>
  );
}
