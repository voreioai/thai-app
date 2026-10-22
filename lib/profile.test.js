const { test } = require('node:test');
const assert = require('node:assert');

// applyGenderWith(text, gender) — the testable, env-free core
const { applyGenderWith } = require('./profile.js');

test('female: text is unchanged', () => {
  assert.equal(applyGenderWith('ขอบคุณค่ะ', 'female'), 'ขอบคุณค่ะ');
  assert.equal(applyGenderWith('sà-baai-dii mǎi khá', 'female'), 'sà-baai-dii mǎi khá');
});

test('male: the feminine particle changes to the masculine one', () => {
  assert.equal(applyGenderWith('ขอบคุณค่ะ', 'male'), 'ขอบคุณครับ');
  assert.equal(applyGenderWith('สบายดีไหมคะ', 'male'), 'สบายดีไหมครับ');
  assert.equal(applyGenderWith('khòp-khun khâ', 'male'), 'khòp-khun khráp');
  assert.equal(applyGenderWith('sà-baai-dii mǎi khá', 'male'), 'sà-baai-dii mǎi khráp');
});

test('male: several particles in one string', () => {
  assert.equal(applyGenderWith('ใช่ค่ะ / ไม่ใช่ค่ะ', 'male'), 'ใช่ครับ / ไม่ใช่ครับ');
});

test('idempotency: an already-masculine particle is not broken', () => {
  assert.equal(applyGenderWith('ขอบคุณครับ', 'male'), 'ขอบคุณครับ');
});

test('empty/non-string inputs are safe', () => {
  assert.equal(applyGenderWith('', 'male'), '');
  assert.equal(applyGenderWith(null, 'male'), null);
});
