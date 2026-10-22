'use client';

import { C, ScreenTitle, SectionLabel, SpeakBtn } from '@/components/ui';
import { TONES, TONE_DEMO } from '@/lib/data';

export default function Tones({ noVoice }) {
  return (
    <div className="fade-in">
      <ScreenTitle>Tones</ScreenTitle>
      <div style={{ fontSize: 13, fontWeight: 500, color: C.sub, marginTop: 6, lineHeight: 1.5 }}>
        Thai has 5 tones, and tone changes a word's meaning. Listen and repeat out loud.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        {TONES.map((t) => (
          <div key={t.name} style={{ background: '#fff', borderRadius: 20, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14, background: C.bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18, fontWeight: 800, color: C.greenDark,
              }}>
                {t.mark}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 800 }}>{t.name}</div>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: C.sub, marginTop: 3, lineHeight: 1.45 }}>
                  {t.hint}
                </div>
              </div>
              <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 40 }}>
                <div className="thai" style={{ fontSize: 19, fontWeight: 800, color: C.greenDark, lineHeight: 1 }}>{t.markThai}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: C.faint, marginTop: 3, whiteSpace: 'nowrap' }}>{t.markName}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
              {t.words.map((w) => (
                <div key={w.word} style={{
                  display: 'flex', alignItems: 'center', gap: 10, background: C.bg,
                  borderRadius: 14, padding: '8px 8px 8px 14px',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span className="thai" style={{ fontSize: 15, fontWeight: 800 }}>{w.word}</span>{' '}
                    <span style={{ color: C.greenDark, fontSize: 12.5, fontWeight: 700 }}>{w.tr}</span>
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: C.sub, marginTop: 1 }}>{w.ru}</div>
                  </div>
                  <SpeakBtn text={w.word} size={32} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, fontWeight: 500, color: C.faint, lineHeight: 1.5, marginTop: 14, padding: '0 6px' }}>
        The same mark over a letter can sound different in different words — the tone also depends on the consonant itself. The marks are a guide; your ear and repeating out loud are more reliable.
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionLabel>FEEL THE DIFFERENCE</SectionLabel>
      </div>
      <div style={{ background: '#17181A', borderRadius: 24, marginTop: 10, padding: '6px 0', overflow: 'hidden' }}>
        {TONE_DEMO.map((w, i) => (
          <div key={w.th} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px',
            borderBottom: i < TONE_DEMO.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
          }}>
            <div className="thai" style={{ fontSize: 22, fontWeight: 700, color: '#fff', width: 74, flexShrink: 0 }}>{w.th}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.lime }}>{w.tr}</div>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>
                {w.ru} · {w.tone}
              </div>
            </div>
            <SpeakBtn text={w.th} bg="rgba(255,255,255,0.12)" color="#fff" />
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: C.faint, lineHeight: 1.5, marginTop: 12, padding: '0 6px' }}>
        Nearly identical words, yet different meanings — all because of tone. The classic: ไม้ใหม่ไม่ไหม้ — "new wood does not burn".
      </div>
    </div>
  );
}
