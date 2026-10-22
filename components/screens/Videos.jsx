'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { C, Icon, ScreenTitle } from '@/components/ui';
import { VIDEOS } from '@/lib/data';

// "Videos" tab: clips from a YouTube channel, in order. "Watch" opens YouTube
// and marks the video as watched. The marks are stored in Supabase (table watched_videos),
// so they survive a reload and sync across devices.
export default function Videos() {
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    supabase.from('watched_videos').select('video_id').then(({ data }) => {
      if (data) setWatched(data.map((r) => r.video_id));
    });
  }, []);

  const markWatched = (id) => {
    if (watched.includes(id)) return;
    setWatched((prev) => (prev.includes(id) ? prev : [...prev, id]));
    supabase.from('watched_videos').upsert({ video_id: id }).then(() => {});
  };

  return (
    <div className="fade-in">
      <ScreenTitle>Videos</ScreenTitle>
      <div style={{ fontSize: 13, fontWeight: 500, color: C.sub, marginTop: 6, lineHeight: 1.5 }}>
        Watch them in order — watched ones get a checkmark.
      </div>

      {VIDEOS.length === 0 && (
        <div style={{ background: '#fff', borderRadius: 24, padding: '28px 20px', marginTop: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 30 }}>🎬</div>
          <div style={{ fontSize: 15, fontWeight: 800, marginTop: 10 }}>No videos added yet</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.sub, marginTop: 6, lineHeight: 1.5 }}>
            Send Claude a playlist link —<br />the videos will appear here
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        {VIDEOS.map((v, i) => {
          const seen = watched.includes(v.id);
          return (
            <div key={v.id} style={{ background: '#fff', borderRadius: 20, padding: 16, display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14, background: seen ? '#F2F8DC' : C.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {seen
                  ? <Icon d="M5 12.5l4.5 4.5L19 7.5" size={20} color={C.greenDark} width={2} />
                  : <svg width="16" height="16" viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z" fill={C.text} /></svg>}
              </div>
              <div style={{ flex: 1, minWidth: 0, opacity: seen ? 0.5 : 1 }}>
                <div style={{ fontSize: 15.5, fontWeight: 800 }}>Video {i + 1}</div>
                {v.title && <div style={{ fontSize: 12.5, fontWeight: 500, color: C.sub, marginTop: 2, lineHeight: 1.35 }}>{v.title}</div>}
              </div>
              <a
                className="press-sm"
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => markWatched(v.id)}
                style={{
                  background: seen ? C.bg : '#17181A', color: seen ? C.text : '#fff',
                  borderRadius: 999, padding: '11px 18px', fontSize: 13, fontWeight: 800,
                  textDecoration: 'none', flexShrink: 0,
                }}
              >
                {seen ? 'Again' : 'Watch'}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
