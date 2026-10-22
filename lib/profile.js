// User profile and on-the-fly substitution of the polite particle.
// The database and code store the feminine particle (ค่ะ/คะ, khâ/khá); the masculine
// variant is produced by a transform based on NEXT_PUBLIC_USER_GENDER — nothing is duplicated.

export const GENDER = process.env.NEXT_PUBLIC_USER_GENDER === 'male' ? 'male' : 'female';
export const USER_NAME = process.env.NEXT_PUBLIC_USER_NAME || 'friend';

// env-free core — convenient to test.
export function applyGenderWith(text, gender) {
  if (gender !== 'male' || typeof text !== 'string' || !text) return text;
  return text
    .replace(/ค่ะ/g, 'ครับ')
    .replace(/คะ/g, 'ครับ')
    .replace(/khâ/g, 'khráp')
    .replace(/khá/g, 'khráp');
}

export function applyGender(text) {
  return applyGenderWith(text, GENDER);
}

export function genderPhrase(p) {
  if (!p) return p;
  return { ...p, th: applyGender(p.th), tr: applyGender(p.tr) };
}
