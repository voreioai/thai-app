# Manual setup (without Claude)

1. Install dependencies: `npm install`.
2. Create a project at https://supabase.com.
3. In the **SQL Editor**, run in order:
   - `supabase/schema.sql`
   - `supabase/seed.sql`
4. In **Project Settings → API**, grab the Project URL and the anon (publishable) key.
5. Copy `.env.example` to `.env.local` and fill it in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_USER_NAME=YourName
   NEXT_PUBLIC_USER_GENDER=female   # or male
   ```
6. Run: `npm run dev` → http://localhost:3000.
7. Deploy (optional): import the repository into Vercel, set the same 4
   environment variables, deploy.

Intro phrases like "My name is…" and "I'm from…" are not in the base seed — add them
yourself via the "➕ Add phrase" screen or ask Claude.
