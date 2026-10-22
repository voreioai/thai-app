// Deck metadata. Phrase content lives in lib/content.js; this is just presentation.
export const DECK_META = {
  base: { name: 'Basics', icon: 'M12 3l2.7 5.6 6.3.9-4.5 4.4 1 6.1-5.5-2.9-5.5 2.9 1-6.1L3 9.5l6.3-.9z' },
  num: { name: 'Numbers', icon: 'M9 3L7 21M17 3l-2 18M4 8h17M3 16h17' },
  coffee: { name: 'Coffee shop', icon: 'M4 8h13v6a5 5 0 01-5 5H9a5 5 0 01-5-5zM17 9h2a2.5 2.5 0 010 5h-2' },
  resto: { name: 'Café', icon: 'M6 3v6a2 2 0 004 0V3M8 3v18M16 3v18M16 3a3.5 3.5 0 013.5 3.5V13H16' },
  shop: { name: 'Shop', icon: 'M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 016 0v2' },
  market: { name: 'Market', icon: 'M4 10h16M5 10l1.5-5h11L19 10M6 10v10h12V10M10 14h4' },
  massage: { name: 'Massage', icon: 'M12 21s-7-4.5-9-9a5 5 0 019-3 5 5 0 019 3c-2 4.5-9 9-9 9z' },
};

export const DECK_ORDER = ['base', 'num', 'coffee', 'resto', 'shop', 'market', 'massage'];

// "I am now at…" — place buttons on the home screen
export const PLACES = [
  { deck: 'coffee', name: 'Coffee shop', emoji: '☕' },
  { deck: 'resto', name: 'Café', emoji: '🍜' },
  { deck: 'shop', name: 'Shop', emoji: '🏪' },
  { deck: 'market', name: 'Market', emoji: '🍍' },
  { deck: 'massage', name: 'Massage', emoji: '💆‍♀️' },
];

// "They might say to you" — common Thai replies by place
export const THEY_SAY = {
  coffee: [
    { th: 'ร้อนหรือเย็นคะ', tr: 'rɔ́ɔn rʉ̌ʉ yen khá', ru: 'Hot or cold?' },
    { th: 'แก้วไหนคะ', tr: 'gɛ̂ɛo nǎi khá', ru: 'Which size?' },
    { th: 'หวานปกติไหมคะ', tr: 'wǎan pòk-gà-tì mǎi khá', ru: 'Normal sweetness?' },
    { th: 'ทานที่นี่หรือเอากลับคะ', tr: 'thaan thîi-nîi rʉ̌ʉ ao glàp khá', ru: 'For here or to go?' },
    { th: '...บาทค่ะ', tr: '... bàat khâ', ru: '… baht (price)' },
  ],
  resto: [
    { th: 'รับอะไรดีคะ', tr: 'ráp à-rai dii khá', ru: 'What would you like?' },
    { th: 'รับน้ำอะไรคะ', tr: 'ráp náam à-rai khá', ru: 'What would you like to drink?' },
    { th: 'เผ็ดได้ไหมคะ', tr: 'phèt dâai mǎi khá', ru: 'Spicy okay?' },
    { th: 'รับอะไรเพิ่มไหมคะ', tr: 'ráp à-rai phə̂əm mǎi khá', ru: 'Anything else?' },
  ],
  shop: [
    { th: 'รับถุงไหมคะ', tr: 'ráp thǔng mǎi khá', ru: 'Do you need a bag?' },
    { th: 'อุ่นไหมคะ', tr: 'ùn mǎi khá', ru: 'Heat it up?' },
    { th: 'มีบัตรสมาชิกไหมคะ', tr: 'mii bàt sà-maa-chík mǎi khá', ru: 'Do you have a membership card?' },
    { th: 'จ่ายเงินสดหรือสแกนคะ', tr: 'jàai ngən-sòt rʉ̌ʉ sà-gɛɛn khá', ru: 'Cash or QR?' },
    { th: 'ทั้งหมด...บาทค่ะ', tr: 'tháng-mòt ... bàat khâ', ru: 'Total … baht' },
  ],
  market: [
    { th: 'เอากี่โลคะ', tr: 'ao gìi loo khá', ru: 'How many kilos?' },
    { th: 'เอาอะไรอีกไหมคะ', tr: 'ao à-rai ìik mǎi khá', ru: 'Anything else?' },
  ],
  massage: [
    { th: 'นวดอะไรดีคะ', tr: 'nûat à-rai dii khá', ru: 'Which massage?' },
    { th: 'กี่ชั่วโมงคะ', tr: 'gìi chûa-moong khá', ru: 'How many hours?' },
    { th: 'หนักไหมคะ', tr: 'nàk mǎi khá', ru: 'Is the pressure okay?' },
    { th: 'เจ็บไหมคะ', tr: 'jèp mǎi khá', ru: 'Does it hurt?' },
    { th: 'เปลี่ยนชุดค่ะ', tr: 'plìan chút khâ', ru: 'Please change your clothes' },
  ],
};

// Step-by-step mini-dialogues. who: 'thai' — spoken automatically,
// 'me' — the meaning is shown, the answer opens on a button tap
export const DIALOGS = [
  {
    id: 'coffee',
    name: 'Coffee shop',
    sub: 'Order a coffee from start to finish',
    icon: DECK_META.coffee.icon,
    steps: [
      { who: 'thai', th: 'สวัสดีค่ะ รับอะไรดีคะ', tr: 'sà-wàt-dii khâ, ráp à-rai dii khá', ru: 'Hello! What would you like?' },
      { who: 'me', ru: 'Iced latte, please', th: 'ขอลาเต้เย็นค่ะ', tr: 'khɔ̌ɔ laa-têe yen khâ' },
      { who: 'thai', th: 'หวานปกติไหมคะ', tr: 'wǎan pòk-gà-tì mǎi khá', ru: 'Normal sweetness?' },
      { who: 'me', ru: 'A little sweet', th: 'หวานน้อยค่ะ', tr: 'wǎan nɔ́ɔi khâ' },
      { who: 'thai', th: 'ทานที่นี่หรือเอากลับคะ', tr: 'thaan thîi-nîi rʉ̌ʉ ao glàp khá', ru: 'For here or to go?' },
      { who: 'me', ru: 'To go', th: 'เอากลับค่ะ', tr: 'ao glàp khâ' },
      { who: 'thai', th: 'ห้าสิบห้าบาทค่ะ', tr: 'hâa-sìp-hâa bàat khâ', ru: '55 baht' },
      { who: 'me', ru: 'Here you go. Thank you!', th: 'นี่ค่ะ ขอบคุณค่ะ', tr: 'nîi khâ, khɔ̀ɔp-khun khâ' },
    ],
  },
  {
    id: 'resto',
    name: 'Café',
    sub: 'Order food and ask for the bill',
    icon: DECK_META.resto.icon,
    steps: [
      { who: 'thai', th: 'รับอะไรดีคะ', tr: 'ráp à-rai dii khá', ru: 'What would you like?' },
      { who: 'me', ru: 'Pad thai with chicken, please', th: 'ขอผัดไทยไก่ค่ะ', tr: 'khɔ̌ɔ phàt-thai gài khâ' },
      { who: 'thai', th: 'เผ็ดได้ไหมคะ', tr: 'phèt dâai mǎi khá', ru: 'Spicy okay?' },
      { who: 'me', ru: 'Not spicy, please', th: 'ไม่เผ็ดค่ะ', tr: 'mâi phèt khâ' },
      { who: 'thai', th: 'รับน้ำอะไรคะ', tr: 'ráp náam à-rai khá', ru: 'What would you like to drink?' },
      { who: 'me', ru: 'Water, please', th: 'ขอน้ำเปล่าค่ะ', tr: 'khɔ̌ɔ nám-plàao khâ' },
      { who: 'thai', th: 'รับอะไรเพิ่มไหมคะ', tr: 'ráp à-rai phə̂əm mǎi khá', ru: 'Anything else?' },
      { who: 'me', ru: 'That is enough, thank you', th: 'พอแล้วค่ะ ขอบคุณค่ะ', tr: 'phɔɔ lɛ́ɛo khâ, khɔ̀ɔp-khun khâ' },
      { who: 'me', ru: 'Check, please', th: 'เช็คบิลค่ะ', tr: 'chék-bin khâ' },
    ],
  },
  {
    id: 'seven',
    name: '7-Eleven',
    sub: 'Checkout: heating, bag, payment',
    icon: 'M4 7l2-4h12l2 4M4 7h16v13H4zM9 20v-6h6v6',
    steps: [
      { who: 'thai', th: 'สวัสดีค่ะ', tr: 'sà-wàt-dii khâ', ru: 'Hello!' },
      { who: 'me', ru: 'Hello', th: 'สวัสดีค่ะ', tr: 'sà-wàt-dii khâ' },
      { who: 'thai', th: 'อุ่นไหมคะ', tr: 'ùn mǎi khá', ru: 'Heat it up?' },
      { who: 'me', ru: 'Yes, please heat it up', th: 'อุ่นค่ะ', tr: 'ùn khâ' },
      { who: 'thai', th: 'รับถุงไหมคะ', tr: 'ráp thǔng mǎi khá', ru: 'Do you need a bag?' },
      { who: 'me', ru: 'No, thank you', th: 'ไม่เอาถุงค่ะ', tr: 'mâi ao thǔng khâ' },
      { who: 'thai', th: 'จ่ายเงินสดหรือสแกนคะ', tr: 'jàai ngən-sòt rʉ̌ʉ sà-gɛɛn khá', ru: 'Cash or QR?' },
      { who: 'me', ru: 'By QR code', th: 'สแกนค่ะ', tr: 'sà-gɛɛn khâ' },
      { who: 'thai', th: 'ขอบคุณค่ะ', tr: 'khɔ̀ɔp-khun khâ', ru: 'Thank you!' },
    ],
  },
];

// 5 tones: the Latin diacritic (mark), the real Thai tone sign (markThai/markName)
// and 2-3 example words for each — with an imagery-based explanation
export const TONES = [
  {
    name: 'Mid', mark: 'a', markThai: '—', markName: 'no mark',
    words: [
      { word: 'กา', tr: 'gaa', ru: 'crow' },
      { word: 'ตา', tr: 'dtaa', ru: 'eye' },
      { word: 'มา', tr: 'maa', ru: 'to come' },
    ],
    hint: 'Flat, like a phone dial tone — no movement in the voice.',
  },
  {
    name: 'Low', mark: 'à', markThai: '่', markName: 'ไม้เอก',
    words: [
      { word: 'ข่า', tr: 'khàa', ru: 'galangal' },
      { word: 'ไข่', tr: 'khài', ru: 'egg' },
      { word: 'ป่า', tr: 'pàa', ru: 'forest' },
    ],
    hint: 'Calm and a bit lower than usual, like a tired "uh-huh".',
  },
  {
    name: 'Falling', mark: 'â', markThai: '่ / ้', markName: 'ไม้เอก or ไม้โท',
    words: [
      { word: 'ค่า', tr: 'khâa', ru: 'price, fee' },
      { word: 'ห้า', tr: 'hâa', ru: 'five' },
      { word: 'ก้าว', tr: 'kâao', ru: 'step' },
    ],
    hint: 'From high to low, like a stern "No!".',
  },
  {
    name: 'High', mark: 'á', markThai: '้', markName: 'ไม้โท',
    words: [
      { word: 'ค้า', tr: 'kháa', ru: 'to trade' },
      { word: 'ม้า', tr: 'máa', ru: 'horse' },
      { word: 'น้ำ', tr: 'náam', ru: 'water' },
    ],
    hint: 'High and tense, like a surprised "yeah?!" rising up.',
  },
  {
    name: 'Rising', mark: 'ǎ', markThai: '—', markName: 'no mark',
    words: [
      { word: 'ขา', tr: 'khǎa', ru: 'leg' },
      { word: 'ขาว', tr: 'khǎao', ru: 'white' },
      { word: 'สอง', tr: 'sǎwng', ru: 'two' },
    ],
    hint: 'From low to high, like asking again: "whaa-at?"',
  },
];

// The classic quartet that shows why tone changes meaning
export const TONE_DEMO = [
  { th: 'ใหม่', tr: 'mài', ru: 'new', tone: 'low' },
  { th: 'ไม่', tr: 'mâi', ru: 'no, not', tone: 'falling' },
  { th: 'ไม้', tr: 'máai', ru: 'wood, stick', tone: 'high' },
  { th: 'หม้าย', tr: 'mâai', ru: 'widow', tone: 'falling' },
];

// Videos from a YouTube playlist on Thai. Shown as "Video 1", "Video 2"…
// To add a new one: append { id, title, deck } to the end of the list (id is the part of the link after watch?v=).
// deck — which topic to file this clip's words under (for the transcription pipeline).
export const VIDEOS = [
  { id: 'vpGdD9fgWsw', title: 'The First 10 Thai Words You Must Know!', deck: 'base' },
  { id: 'RJGG9hOJOVo', title: '20 First-to-Know Thai Language Verbs', deck: 'base' },
  { id: 'Vrgeac31-Cw', title: 'Ways to call yourself and others in Thai', deck: 'base' },
  { id: 'Y9gUTvhaVLI', title: 'Basic Thai Language Grammar Rules!', deck: 'base' },
  { id: 'DBxro6aGCPk', title: 'Thai ways to ending sentences', deck: 'base' },
  { id: 'fhcDc8Ge1d4', title: 'Thai sentences based on English Tense', deck: 'base' },
  { id: 'RSlSpcaq9M0', title: 'How to make questions in Thai', deck: 'base' },
  { id: 'Let5JPI2R0I', title: 'What to say to motorcycle taxis', deck: 'base' },
  { id: 'u4af2z4sPq4', title: 'What to say to a taxi driver', deck: 'base' },
  { id: 'nBeMnQZ_Knk', title: 'How to order food in Thailand', deck: 'resto' },
  { id: 'KRdLsDmiUpg', title: 'How to order drinks in Thailand', deck: 'coffee' },
  { id: 'FSZFYNNYh38', title: 'Counting in Thai — Numbers 1-10', deck: 'num' },
];

// Mission of the day — a small real-life task, rotated by date
export const MISSIONS = [
  { text: 'Order a coffee entirely in Thai today', th: 'ขอลาเต้เย็นค่ะ', tr: 'khɔ̌ɔ laa-têe yen khâ' },
  { text: 'Ask the price at the market', th: 'เท่าไหร่คะ', tr: 'thâo-rài khá' },
  { text: 'Decline a bag at 7-Eleven', th: 'ไม่เอาถุงค่ะ', tr: 'mâi ao thǔng khâ' },
  { text: 'Thank three people with a smile', th: 'ขอบคุณค่ะ', tr: 'khɔ̀ɔp-khun khâ' },
  { text: 'Ask for "not spicy" at a café', th: 'ไม่เผ็ดค่ะ', tr: 'mâi phèt khâ' },
  { text: 'Count out loud to ten in Thai', th: 'หนึ่ง สอง สาม สี่ ห้า หก เจ็ด แปด เก้า สิบ', tr: 'nʉ̀ng sɔ̌ɔng sǎam sìi hâa hòk jèt pɛ̀ɛt gâao sìp' },
  { text: 'Say "delicious!" to whoever cooked', th: 'อร่อยค่ะ', tr: 'à-rɔ̀i khâ' },
];

export function missionOfToday() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return MISSIONS[dayOfYear % MISSIONS.length];
}
