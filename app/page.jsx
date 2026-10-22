'use client';

import { useEffect, useMemo, useState } from 'react';
import * as store from '@/lib/store';
import { todayStr, nextBox, dueDateFor, calcStreak, NEW_PER_DAY, LEARNED_BOX } from '@/lib/srs';
import { checkThaiVoice } from '@/lib/tts';
import { DECK_META, VIDEOS } from '@/lib/data';
import { genderPhrase } from '@/lib/profile';
import { BottomNav, C } from '@/components/ui';
import Home from '@/components/screens/Home';
import Place from '@/components/screens/Place';
import Decks from '@/components/screens/Decks';
import Deck from '@/components/screens/Deck';
import Lesson from '@/components/screens/Lesson';
import Dialogs, { DialogPlayer } from '@/components/screens/Dialogs';
import Tones from '@/components/screens/Tones';
import Videos from '@/components/screens/Videos';
import Progress from '@/components/screens/Progress';
import AddSheet from '@/components/screens/AddSheet';
import VideoWords from '@/components/screens/VideoWords';

export default function App() {
  const [tab, setTab] = useState('home');
  // Overlays on top of tabs: {type:'deck'|'place'|'dialog', id} or {type:'lesson', mode, deck?}
  const [overlay, setOverlay] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const [phrases, setPhrases] = useState([]);
  const [reviews, setReviews] = useState({}); // phrase_id -> {box, due_date}
  const [activity, setActivity] = useState([]);
  // Watched videos: [{ video_id, words_added, watched_at }] — for the "New words from a video" popup
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noVoice, setNoVoice] = useState(false);
  // Words pushed from the home screen into the "Learn new" queue (➕) — survive a reload
  const [pinned, setPinned] = useState([]);

  // Everything comes from the browser (lib/store.js): bundled content + localStorage.
  const load = () => {
    const { phrases, reviews, activity, watchedVideos } = store.loadAll();
    setPhrases(phrases.map(genderPhrase));
    setReviews(reviews);
    setActivity(activity);
    setWatchedVideos(watchedVideos);
    setLoading(false);
  };

  useEffect(() => {
    load();
    try { setPinned(JSON.parse(localStorage.getItem('thai-pinned-new') || '[]')); } catch {}
    checkThaiVoice((ok) => setNoVoice(!ok));
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  const today = todayStr();
  const visible = useMemo(() => phrases.filter((p) => !p.hidden), [phrases]);
  const newPhrases = useMemo(() => visible.filter((p) => !reviews[p.id]), [visible, reviews]);
  const duePhrases = useMemo(
    () => visible.filter((p) => reviews[p.id] && reviews[p.id].due_date <= today),
    [visible, reviews, today]
  );
  const chatCount = useMemo(
    () => newPhrases.filter((p) => p.source === 'chat').length,
    [newPhrases]
  );
  // Recent words: only user-added ones (from chat or manual), by date added, newest first
  const recentWords = useMemo(
    () =>
      visible
        .filter((p) => p.source !== 'seed')
        .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
        .slice(0, 20),
    [visible]
  );
  const streak = useMemo(() => calcStreak(activity), [activity]);

  // Words tied to a video (source='video'): video_id -> [phrases]
  const videoPhrases = useMemo(() => {
    const map = {};
    for (const p of phrases) {
      if (!p.video_id) continue;
      (map[p.video_id] ||= []).push(p);
    }
    return map;
  }, [phrases]);

  // Show the popup for the most recently watched video whose words have not been
  // added yet (words_added=false) and for which words actually exist.
  const pendingVideo = useMemo(() => {
    const cand = watchedVideos
      .filter((w) => !w.words_added && (videoPhrases[w.video_id]?.length))
      .sort((a, b) => (b.watched_at || '').localeCompare(a.watched_at || ''));
    return cand[0] || null;
  }, [watchedVideos, videoPhrases]);

  const savePinned = (ids) => {
    setPinned(ids);
    try { localStorage.setItem('thai-pinned-new', JSON.stringify(ids)); } catch {}
  };
  const unpin = (id) => savePinned(pinned.filter((x) => x !== id));

  // ➕ on the home screen: push a word into the next "Learn new" session's queue (tap again to remove)
  const togglePin = (phrase) => {
    if (pinned.includes(phrase.id)) unpin(phrase.id);
    else savePinned([...pinned, phrase.id]);
  };

  // Add a video's words to learning: clear hidden on the SELECTED ones (not excluded),
  // push them into the "Learn new" queue and mark the video as processed (words_added=true).
  // excludedIds — words unchecked in the popup: they stay hidden.
  const addVideoWords = async (videoId, excludedIds = []) => {
    const list = videoPhrases[videoId] || [];
    if (!list.length) return;
    const ex = new Set(excludedIds);
    const ids = list.filter((p) => !ex.has(p.id)).map((p) => p.id);
    setPhrases((prev) => prev.map((p) => (ids.includes(p.id) ? { ...p, hidden: false } : p)));
    if (ids.length) savePinned([...new Set([...pinned, ...ids])]);
    setWatchedVideos((prev) => prev.map((w) => (w.video_id === videoId ? { ...w, words_added: true } : w)));
    if (ids.length) store.setHiddenMany(ids, false);
    store.setWordsAdded(videoId);
  };

  const startVideoLesson = (videoId, excludedIds = []) => {
    const ex = new Set(excludedIds);
    const ids = (videoPhrases[videoId] || []).filter((p) => !ex.has(p.id)).map((p) => p.id);
    addVideoWords(videoId, excludedIds);
    if (ids.length) setOverlay({ type: 'lesson', mode: 'video', videoId, phraseIds: ids });
  };

  // ✓ on the home screen: "already know" — mark as learned at once (box 4); tap again to undo and return it to new
  const toggleLearned = (phrase) => {
    if ((reviews[phrase.id]?.box ?? -1) >= LEARNED_BOX) {
      setReviews((prev) => {
        const next = { ...prev };
        delete next[phrase.id];
        return next;
      });
      store.deleteReview(phrase.id);
    } else {
      const row = {
        phrase_id: phrase.id,
        box: LEARNED_BOX,
        due_date: dueDateFor(LEARNED_BOX),
        updated_at: new Date().toISOString(),
      };
      setReviews((prev) => ({ ...prev, [phrase.id]: row }));
      if (pinned.includes(phrase.id)) unpin(phrase.id);
      store.saveReview(row);
    }
  };

  // Grade a card: update box/due_date in reviews
  const gradePhrase = (phrase, grade) => {
    const box = nextBox(reviews[phrase.id]?.box ?? 0, grade);
    const row = {
      phrase_id: phrase.id,
      box,
      due_date: dueDateFor(box),
      updated_at: new Date().toISOString(),
    };
    setReviews((prev) => ({ ...prev, [phrase.id]: row }));
    if (pinned.includes(phrase.id)) unpin(phrase.id);
    store.saveReview(row);
  };

  // Finishing a session: record the day in activity (for the streak)
  const finishSession = (mode) => {
    const existing = activity.find((a) => a.day === today);
    const row = {
      day: today,
      did_review: (existing?.did_review ?? false) || mode !== 'new',
      did_new: (existing?.did_new ?? false) || mode === 'new',
    };
    setActivity((prev) => [...prev.filter((a) => a.day !== today), row]);
    store.upsertActivity(row);
  };

  const toggleHidden = (phrase) => {
    const hidden = !phrase.hidden;
    setPhrases((prev) => prev.map((p) => (p.id === phrase.id ? { ...p, hidden } : p)));
    store.setHidden(phrase.id, hidden);
  };

  // Hide a word right from the card in "Learn new" (eye icon) — you can bring it back in the deck
  const hideFromLesson = (phrase) => {
    if (pinned.includes(phrase.id)) unpin(phrase.id);
    toggleHidden(phrase);
  };

  const addPhrase = ({ ru, th, tr, deck }) => {
    const phrase = store.addCustomPhrase({ ru, th, tr, deck });
    setPhrases((prev) => [...prev, genderPhrase(phrase)]);
  };

  // Shuffle phrases so similar words don't run back-to-back and the order doesn't hint at the answer
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Session queue by mode
  const lessonQueue = useMemo(() => {
    if (!overlay || overlay.type !== 'lesson') return [];
    if (overlay.mode === 'new') {
      // Pushed from the home screen (➕) — to the front of the queue, random order within groups
      const pin = new Set(pinned);
      return shuffle(newPhrases)
        .sort((a, b) => (pin.has(b.id) ? 1 : 0) - (pin.has(a.id) ? 1 : 0))
        .slice(0, NEW_PER_DAY);
    }
    if (overlay.mode === 'review') return shuffle(duePhrases);
    if (overlay.mode === 'video') {
      const set = new Set(overlay.phraseIds || []);
      return shuffle(phrases.filter((p) => set.has(p.id)));
    }
    return shuffle(visible.filter((p) => p.deck === overlay.deck));
    // the queue is fixed at the moment the session starts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlay]);

  const lessonTitle =
    overlay?.type === 'lesson'
      ? overlay.mode === 'new' ? 'New'
        : overlay.mode === 'review' ? 'Review'
        : overlay.mode === 'video' ? 'From video'
        : DECK_META[overlay.deck].name
      : '';

  const inLesson = overlay?.type === 'lesson';

  const content = () => {
    // Dialogues and tones don't depend on the database — show them right away
    if (!overlay && tab === 'dialogs') {
      return <Dialogs onOpen={(id) => setOverlay({ type: 'dialog', id })} />;
    }
    if (!overlay && tab === 'tones') {
      return <Tones noVoice={noVoice} />;
    }
    if (!overlay && tab === 'videos') {
      return <Videos />;
    }
    if (overlay?.type === 'dialog') {
      return <DialogPlayer dialogId={overlay.id} noVoice={noVoice} onBack={() => setOverlay(null)} />;
    }
    if (loading) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: C.faint, fontSize: 14, fontWeight: 600 }}>
          Loading phrases…
        </div>
      );
    }
    if (inLesson) {
      return (
        <Lesson
          key={`${overlay.mode}-${overlay.deck || overlay.videoId || ''}`}
          title={lessonTitle}
          initialQueue={lessonQueue}
          noVoice={noVoice}
          onGrade={gradePhrase}
          onHide={overlay.mode === 'new' ? hideFromLesson : undefined}
          onFinish={() => finishSession(overlay.mode === 'video' ? 'new' : overlay.mode)}
          onExit={() => setOverlay(overlay.from ? { type: 'deck', id: overlay.deck } : null)}
        />
      );
    }
    if (overlay?.type === 'place') {
      return <Place deck={overlay.id} phrases={phrases} noVoice={noVoice} onBack={() => setOverlay(null)} />;
    }
    if (overlay?.type === 'deck') {
      return (
        <Deck
          deck={overlay.id}
          phrases={phrases}
          reviews={reviews}
          onBack={() => setOverlay(null)}
          onTrain={() => setOverlay({ type: 'lesson', mode: 'deck', deck: overlay.id, from: 'deck' })}
          onToggleHidden={toggleHidden}
        />
      );
    }
    switch (tab) {
      case 'decks':
        return <Decks phrases={phrases} reviews={reviews} onDeck={(id) => setOverlay({ type: 'deck', id })} onAdd={() => setAddOpen(true)} />;
      case 'progress':
        return <Progress streak={streak} phrases={phrases} reviews={reviews} />;
      default:
        return (
          <Home
            streak={streak}
            newCount={Math.min(newPhrases.length, NEW_PER_DAY)}
            reviewCount={duePhrases.length}
            chatCount={chatCount}
            recentWords={recentWords}
            reviews={reviews}
            pinnedIds={pinned}
            onTogglePin={togglePin}
            onToggleLearned={toggleLearned}
            onStartNew={() => setOverlay({ type: 'lesson', mode: 'new' })}
            onStartReview={() => setOverlay({ type: 'lesson', mode: 'review' })}
            onPlace={(deck) => setOverlay({ type: 'place', id: deck })}
          />
        );
    }
  };

  return (
    <div style={{
      maxWidth: 430, margin: '0 auto', minHeight: '100dvh', background: C.bg,
      display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      <div style={{ flex: 1, overflow: 'auto', padding: 'calc(env(safe-area-inset-top) + 20px) 20px 20px', boxSizing: 'border-box' }}>
        {content()}
      </div>
      {!inLesson && (
        <div style={{ position: 'sticky', bottom: 0 }}>
          <BottomNav active={tab} onNav={(key) => { setTab(key); setOverlay(null); setAddOpen(false); }} />
        </div>
      )}
      {addOpen && <AddSheet onClose={() => setAddOpen(false)} onAdd={addPhrase} />}
      {!loading && !inLesson && !addOpen && pendingVideo && (
        <VideoWords
          videoNo={VIDEOS.findIndex((v) => v.id === pendingVideo.video_id) + 1}
          title={VIDEOS.find((v) => v.id === pendingVideo.video_id)?.title}
          phrases={videoPhrases[pendingVideo.video_id] || []}
          onStart={(excludedIds) => startVideoLesson(pendingVideo.video_id, excludedIds)}
          onClose={(excludedIds) => addVideoWords(pendingVideo.video_id, excludedIds)}
        />
      )}
    </div>
  );
}
