import { createClient } from '@supabase/supabase-js';

// Keys come from environment variables (.env.local). The publishable/anon key
// is safe on the client: RLS allow-all, the app is personal and single-user.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // A clear hint instead of a confusing crash when .env.local is not filled in
  console.warn('[thai-trainer] NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY are not set. Run /setup or fill in .env.local (see .env.example).');
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '', {
  auth: { persistSession: false },
});
