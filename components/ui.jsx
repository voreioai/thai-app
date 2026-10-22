'use client';

import { speak, RATE_NORMAL, RATE_SLOW } from '@/lib/tts';

export const C = {
  text: '#17181A',
  sub: '#8A8A85',
  faint: '#A3A39E',
  bg: '#F3F3F1',
  card: '#fff',
  lime: '#C6F150',
  green: '#A9D919',
  greenDark: '#6B9A0E',
  line: '#F3F3F1',
};

export function Icon({ d, size = 20, color = C.text, width = 1.7, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
      <path d={d} stroke={fill === 'none' ? color : undefined} fill={fill !== 'none' ? color : 'none'}
        strokeWidth={fill === 'none' ? width : undefined} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FlameIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C13.2 6 8 7.6 8 12.2a4.6 4.6 0 0 0 9.2 0c0-1.9-.8-3.4-1.9-4.9-.6 1.5-1.8 2.1-1.8 2.1C14.8 7 14.6 4.4 12 2z" fill={C.green} />
    </svg>
  );
}

const SPEAKER_PATH = 'M11 5L6 9H3v6h3l5 4V5zM15.5 8.5a5 5 0 010 7';

// Round 🔊 button
export function SpeakBtn({ text, size = 36, bg = C.bg, color = C.text, rate = RATE_NORMAL }) {
  return (
    <div
      className="press-sm"
      onClick={(e) => { e.stopPropagation(); speak(text, rate); }}
      style={{
        width: size, height: size, borderRadius: 999, background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}
    >
      <Icon d={SPEAKER_PATH} size={size * 0.44} color={color} />
    </div>
  );
}

// 🐢 pill — slow speech
export function SlowBtn({ text, height = 46 }) {
  return (
    <div
      className="press-sm"
      onClick={(e) => { e.stopPropagation(); speak(text, RATE_SLOW); }}
      style={{
        height, borderRadius: 999, background: C.bg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '0 18px', fontSize: 15, fontWeight: 800, flexShrink: 0,
      }}
    >
      🐢
    </div>
  );
}

export function BackBtn({ onClick, x = false }) {
  return (
    <div
      className="press-sm"
      onClick={onClick}
      style={{
        width: 36, height: 36, borderRadius: 999, background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}
    >
      <Icon d={x ? 'M6 6l12 12M18 6L6 18' : 'M15 6l-6 6 6 6'} size={15} width={1.8} />
    </div>
  );
}

export function ScreenTitle({ children }) {
  return <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -0.5 }}>{children}</div>;
}

export function SectionLabel({ children, color = C.faint }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color }}>{children}</div>
  );
}

const NAV_ICONS = {
  home: 'M4 11L12 4l8 7v9h-5v-6h-6v6H4z',
  decks: 'M12 3l9 5-9 5-9-5 9-5zM3 14l9 5 9-5',
  dialogs: 'M4 6a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3H10l-6 4z',
  videos: 'M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2zM10 9.5l5 2.5-5 2.5z',
  tones: 'M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4',
  progress: 'M5 20v-8M12 20V6M19 20V10',
};

const NAV_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'decks', label: 'Topics' },
  { key: 'dialogs', label: 'Dialogues' },
  { key: 'videos', label: 'Videos' },
  { key: 'tones', label: 'Tones' },
  { key: 'progress', label: 'Progress' },
];

export function BottomNav({ active, onNav }) {
  return (
    <div style={{
      display: 'flex', background: 'rgba(255,255,255,0.96)', borderTop: '1px solid #EBEBE9',
      padding: '10px 8px calc(10px + env(safe-area-inset-bottom))', flexShrink: 0,
      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
    }}>
      {NAV_ITEMS.map((item) => {
        const color = item.key === active ? C.text : C.faint;
        return (
          <div key={item.key} onClick={() => onNav(item.key)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <Icon d={NAV_ICONS[item.key]} size={22} color={color} width={1.8} />
            <span style={{ fontSize: 10, fontWeight: 700, color }}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Hint shown when the device has no Thai TTS voice
export function NoVoiceHint() {
  return (
    <div style={{
      background: '#FFF6E0', borderRadius: 16, padding: '12px 16px', marginTop: 12,
      fontSize: 12.5, fontWeight: 600, color: '#A87B12', lineHeight: 1.5,
    }}>
      🔇 No Thai voice found. Install a Thai TTS voice: iPhone — Settings → Accessibility →
      Spoken Content → Voices → Thai; Android — Google TTS settings.
    </div>
  );
}
