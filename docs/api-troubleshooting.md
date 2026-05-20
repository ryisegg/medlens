# API Troubleshooting

## Why AI features stopped working

### 1. GitHub Pages has no backend

`https://ryisegg.github.io/medlens/api/*` serves the **SPA HTML**, not serverless functions.

The frontend must call Vercel:

```text
https://medlens-mu.vercel.app/api/symptom-advice
https://medlens-mu.vercel.app/api/translate
```

Set repo variable **`VITE_API_BASE_URL`** = `https://medlens-mu.vercel.app` (already configured in GitHub).

The app also falls back to this URL when hosted on `github.io`.

### 2. Vercel POST routes crashed (`FUNCTION_INVOCATION_FAILED`)

Cause: shared helpers lived in `api/_lib/`. **Vercel ignores `_`-prefixed paths** under `/api`.

Fix: moved to `api/lib/guard.ts`.

### 3. Preview URLs require login

URLs like `medlens-xxx-wenqi-tu-s-projects.vercel.app` may show **Authentication Required**.

Use production: **https://medlens-mu.vercel.app**

### 4. CORS

Vercel env `ALLOWED_ORIGIN` should be `https://ryisegg.github.io` (no trailing slash).

## Verify

```bash
curl https://medlens-mu.vercel.app/api/health
curl -X POST https://medlens-mu.vercel.app/api/symptom-advice \
  -H "Content-Type: application/json" \
  -d '{"language":"en","freeText":"headache"}'
```

## Account sync (Supabase)

Frontend needs at build time:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Run SQL in `docs/supabase-schema.sql` (includes `user_app_data` table).

Vercel backend (optional for health check only):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
