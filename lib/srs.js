// Spaced repetition (Leitner): intervals in days per box level
export const INTERVALS = [0, 1, 2, 4, 7, 15, 30];
export const MAX_BOX = 6;
export const NEW_PER_DAY = 6;
export const LEARNED_BOX = 4; // box >= 4 counts as "learned"

export function todayStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// "Forgot" → box=0 (and show again in this same session);
// "Hard" → box stays the same; "Got it" → box+1 (max 6)
export function nextBox(currentBox, grade) {
  if (grade === 'again') return 0;
  if (grade === 'hard') return currentBox;
  return Math.min(MAX_BOX, currentBox + 1);
}

export function dueDateFor(box) {
  return todayStr(INTERVALS[box]);
}

// Streak: an unbroken chain of days with did_review or did_new,
// ending today (or yesterday, if there was no session today yet)
export function calcStreak(activityRows) {
  const days = new Set(
    activityRows.filter((a) => a.did_review || a.did_new).map((a) => a.day)
  );
  let streak = 0;
  let offset = days.has(todayStr()) ? 0 : -1;
  while (days.has(todayStr(offset - streak))) streak++;
  return streak;
}

// English pluralization: singular for 1, plural otherwise
export function plural(n, one, many) {
  return n === 1 ? one : many;
}
