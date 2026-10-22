'use client';

import { useState } from 'react';
import { C, Icon } from '@/components/ui';
import { DECK_META, DECK_ORDER } from '@/lib/data';

const inputStyle = {
  width: '100%', boxSizing: 'border-box', background: C.bg, border: 'none', borderRadius: 14,
  padding: '14px 16px', fontSize: 15, fontWeight: 600, color: C.text,
};

// "New phrase" sheet: ru/th/tr + deck choice, insert with source='manual'
export default function AddSheet({ onClose, onAdd }) {
  const [ru, setRu] = useState('');
  const [th, setTh] = useState('');
  const [tr, setTr] = useState('');
  const [deck, setDeck] = useState(DECK_ORDER[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const clear = () => { setRu(''); setTh(''); setTr(''); setError(null); };

  const submit = async () => {
    if (!ru.trim() || !th.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      await onAdd({ ru: ru.trim(), th: th.trim(), tr: tr.trim(), deck });
      onClose();
    } catch (e) {
      setError('Could not save — try again');
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', maxWidth: 430, margin: '0 auto' }}>
      <div className="fade-in" onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(23,24,26,0.45)' }} />
      <div className="sheet-up" style={{ position: 'relative', background: '#fff', borderRadius: '28px 28px 0 0', padding: '12px 20px calc(24px + env(safe-area-inset-bottom))' }}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: '#E4E4E2', margin: '0 auto' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>New phrase</div>
          <div className="press-sm" onClick={onClose} style={{
            width: 34, height: 34, borderRadius: 999, background: C.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d="M6 6l12 12M18 6L6 18" size={14} width={1.8} />
          </div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.sub, lineHeight: 1.5, marginTop: 6 }}>
          Ask Claude for a phrase and paste it here. It will go into the topic and the review schedule.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 18 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.sub, marginBottom: 6 }}>In English</div>
            <input value={ru} onChange={(e) => setRu(e.target.value)} placeholder="Just a moment, please" style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.sub, marginBottom: 6 }}>In Thai</div>
            <input value={th} onChange={(e) => setTh(e.target.value)} placeholder="รอแป๊บนึงนะคะ" className="thai" style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.sub, marginBottom: 6 }}>Transcription</div>
            <input value={tr} onChange={(e) => setTr(e.target.value)} placeholder="rɔɔ pɛ́p-nʉng ná khá" style={inputStyle} />
          </div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.sub, marginTop: 16 }}>Topic</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {DECK_ORDER.map((key) => {
            const on = key === deck;
            return (
              <div key={key} onClick={() => setDeck(key)} style={{
                background: on ? '#17181A' : C.bg, color: on ? '#fff' : C.text, borderRadius: 999,
                padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>
                {DECK_META[key].name}
              </div>
            );
          })}
        </div>
        {error && (
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#C4453A', marginTop: 12 }}>{error}</div>
        )}
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <div className="press" onClick={clear} style={{
            flex: 1, background: C.bg, color: C.text, borderRadius: 999, height: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800,
          }}>
            Clear
          </div>
          <div className="press" onClick={submit} style={{
            flex: 2, background: '#17181A', color: '#fff', borderRadius: 999, height: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800,
            opacity: ru.trim() && th.trim() && !saving ? 1 : 0.5,
          }}>
            {saving ? 'Saving…' : 'Add'}
          </div>
        </div>
      </div>
    </div>
  );
}
