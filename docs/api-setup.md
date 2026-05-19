# MedLens API Setup Checklist

MedLens can run as a static GitHub Pages app, but API-backed features need a serverless deployment such as Vercel.

## API Routes

| Route | Method | Purpose | Required provider |
| --- | --- | --- | --- |
| `/api/health` | `GET` | Reports enabled backend features and missing configuration | None |
| `/api/drug-search` | `GET` | Backend proxy for RxNorm medication search | RxNorm public API |
| `/api/symptom-advice` | `POST` | Safety-first AI symptom guidance | OpenAI |
| `/api/translate` | `POST` | Medical translation for drug-label sections | OpenAI |
| `/api/medication-management` | `POST` | Validates calendar/cabinet sync payloads | None yet |
| `/api/auth-status` | `GET` | Reports Supabase account setup readiness | Supabase |
| `/api/billing-checkout` | `POST` | Creates a Stripe subscription Checkout Session | Stripe |

## Recommended Deployment Shape

1. Keep GitHub Pages for the public static frontend, or move the whole app to Vercel.
2. Deploy this repository to Vercel so the `api/` directory becomes live serverless routes.
3. Add backend environment variables in Vercel.
4. If the frontend remains on GitHub Pages, set `VITE_API_BASE_URL` in the GitHub Pages build environment to the Vercel backend URL.

Example:

```bash
VITE_API_BASE_URL=https://medlens-yourname.vercel.app
```

With that value set, the app will call:

- `https://medlens-yourname.vercel.app/api/drug-search`
- `https://medlens-yourname.vercel.app/api/symptom-advice`
- `https://medlens-yourname.vercel.app/api/translate`
- `https://medlens-yourname.vercel.app/api/auth-status`
- `https://medlens-yourname.vercel.app/api/billing-checkout`

## Environment Variables

```bash
APP_URL=https://ryisegg.github.io/medlens
ALLOWED_ORIGIN=https://ryisegg.github.io

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

VITE_API_BASE_URL=
VITE_AI_API_URL=
VITE_TRANSLATE_API_URL=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```

## Feature Status

- Drug search: live public RxNorm fallback works without backend; backend proxy works when deployed.
- Translation: code is wired, but real output requires `OPENAI_API_KEY` on the backend.
- AI symptom advice: code is wired, but real output requires `OPENAI_API_KEY` on the backend.
- Accounts: Supabase readiness endpoint is present; sign-in UI and persistent cloud sync are the next phase.
- Payments: Stripe Checkout creation endpoint is present; plan gates, customer portal, and webhook fulfillment are the next phase.

## Safety Boundary

The symptom endpoint must remain educational and triage-oriented. It should not diagnose, prescribe, or calculate personalized dosing. Medication reminders and cabinet warnings are informational and should not replace clinician or pharmacist advice.
