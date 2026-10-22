// Speech via the Web Speech API, th-TH voice.
// rate 0.85 — normal, 0.6 — "slow" (🐢)
export const RATE_NORMAL = 0.85;
export const RATE_SLOW = 0.6;

function findThaiVoice() {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => (v.lang || '').toLowerCase().replace('_', '-').startsWith('th'));
}

export function hasThaiVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return true;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return true; // voices not loaded yet — do not alarm needlessly
  return !!findThaiVoice();
}

// Check after voices load; cb(true|false) — whether a Thai voice exists
export function checkThaiVoice(cb) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const check = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) cb(!!findThaiVoice());
  };
  check();
  window.speechSynthesis.addEventListener('voiceschanged', check);
}

export function speak(text, rate = RATE_NORMAL) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'th-TH';
  u.rate = rate;
  const voice = findThaiVoice();
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}
