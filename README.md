# MedLens

MedLens is a medication lookup, safety, and personal medication management companion for helping people understand medicines, track schedules, and manage medicines they already have at home.

## What It Does

- Search medications by brand name, generic name, ingredient, or imprint
- View medication uses, side effects, contraindications, interactions, pregnancy/lactation notes, and emergency warning signs
- Identify pills from color, shape, imprint, and strength clues
- Check common symptom categories and see safer OTC direction with red-flag escalation
- Track medication schedules in a mobile-first daily, weekly, and monthly calendar
- Mark doses as upcoming, taken, missed, or skipped with local dose logs
- Maintain a medicine cabinet inventory with quantity, strength, expiration date, type, storage location, and notes
- Show low-stock, expired, and expiring-soon warnings for cabinet items
- Link cabinet medicines to medication schedules
- Enhance symptom guidance with an optional AI backend that returns structured, safety-first triage suggestions
- Translate live medication-label sections into Chinese through an optional AI translation backend
- Save favorites, recently viewed medications, dark mode, language preference, and simple medication reminders locally
- Pull live search/detail data from RxNorm, openFDA, and DailyMed where available

## Safety Position

MedLens is an educational medication-information and reminder tool. It does not diagnose conditions, prescribe treatment, replace a clinician or pharmacist, or guarantee that a medication is appropriate for a specific person.

Medication reminders, calendar entries, and cabinet inventory warnings are informational. Users should verify labels, follow clinician instructions, and talk to a clinician or pharmacist before starting, stopping, or changing medication.

For emergencies such as chest pain, trouble breathing, stroke symptoms, severe allergic reaction, overdose, poisoning, or self-harm risk, users should call emergency services or Poison Control instead of using the app for self-treatment.

## Data Sources

The app combines curated demo medication records with live public data sources:

- RxNorm for normalized medication names and RxCUIs
- openFDA drug labeling for FDA label fields
- DailyMed for official structured product labeling from the National Library of Medicine

Curated records should be treated as seed data and reviewed before production use. Legacy pregnancy letter categories are not used as primary safety guidance because FDA labeling has moved to narrative pregnancy and lactation risk information.

## Personal Medication Management

The medication management MVP stores data locally in `localStorage`:

- `medlens_schedules` for medication schedules
- `medlens_dose_logs` for taken, missed, skipped, and upcoming dose status
- `medlens_cabinet` for medicine cabinet inventory

This is designed for a client-side MVP. A production version should add authenticated sync, notification permissions, audit history, and clinician-reviewed medication safety rules.

## AI Backends

The repo includes Vercel-compatible serverless functions:

- `api/symptom-advice.ts` accepts symptom text and selected chips, calls the OpenAI Responses API, and returns structured JSON for the symptom page.
- `api/translate.ts` accepts medication-label sections and returns faithful medical translations while preserving drug names, units, warnings, and contraindications.

The AI backends are intentionally conservative:

- They give education and triage guidance only
- They do not diagnose, prescribe, or calculate personalized dosing
- They prioritize emergency red flags
- They preserve source warning language during translation
- The symptom checker keeps local rule-based suggestions as a fallback

### Environment Variables

Copy `.env.example` and configure these values in your deployment host:

```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
ALLOWED_ORIGIN=https://ryisegg.github.io
```

If the frontend stays on GitHub Pages and the API is deployed elsewhere, also set these when building the frontend:

```bash
VITE_AI_API_URL=https://your-vercel-app.vercel.app/api/symptom-advice
VITE_TRANSLATE_API_URL=https://your-vercel-app.vercel.app/api/translate
```

If the full app is deployed on Vercel, the frontend can use the default same-origin paths `/api/symptom-advice` and `/api/translate`.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Query
- Capacitor for iOS packaging
- Vercel serverless functions for the optional AI backend

## Local Development

```bash
npm install
npm run dev
```

For local backend testing, run the app through Vercel's dev server or deploy to Vercel with the environment variables above.

## Build

```bash
npm run build
```

For GitHub Pages:

```bash
npm run build:github
```

## Roadmap

- Add native push/local notifications for medication reminders
- Add authenticated cloud sync for schedules, cabinet items, and dose logs
- Add age, pregnancy/lactation, chronic-condition, and current-medication triage before symptom suggestions
- Add stronger drug-interaction checks and duplicate-active-ingredient warnings
- Add source citations at the field level for live drug-label content
- Add accessibility and mobile viewport regression tests
- Add production review workflow for curated medication records
