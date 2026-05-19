# MedLens

MedLens is a medication lookup and safety companion for helping people understand what a medicine is used for, what risks to watch for, and when to seek professional care.

## What It Does

- Search medications by brand name, generic name, ingredient, or imprint
- View medication uses, side effects, contraindications, interactions, pregnancy/lactation notes, and emergency warning signs
- Identify pills from color, shape, imprint, and strength clues
- Check common symptom categories and see safer OTC direction with red-flag escalation
- Enhance symptom guidance with an optional AI backend that returns structured, safety-first triage suggestions
- Save favorites, recently viewed medications, dark mode, language preference, and simple medication reminders locally
- Pull live search/detail data from RxNorm, openFDA, and DailyMed where available

## Safety Position

MedLens is an educational medication-information tool. It does not diagnose conditions, prescribe treatment, replace a clinician or pharmacist, or guarantee that a medication is appropriate for a specific person.

For emergencies such as chest pain, trouble breathing, stroke symptoms, severe allergic reaction, overdose, poisoning, or self-harm risk, users should call emergency services or Poison Control instead of using the app for self-treatment.

## Data Sources

The app combines curated demo medication records with live public data sources:

- RxNorm for normalized medication names and RxCUIs
- openFDA drug labeling for FDA label fields
- DailyMed for official structured product labeling from the National Library of Medicine

Curated records should be treated as seed data and reviewed before production use. Legacy pregnancy letter categories are not used as primary safety guidance because FDA labeling has moved to narrative pregnancy and lactation risk information.

## AI Symptom Backend

The repo includes a Vercel-compatible serverless function at `api/symptom-advice.ts`. It accepts symptom text and selected chips, calls the OpenAI Responses API, and returns structured JSON for the symptom page.

The AI backend is intentionally conservative:

- It gives education and triage guidance only
- It does not diagnose, prescribe, or calculate personalized dosing
- It prioritizes emergency red flags
- It suggests OTC medication classes, examples, avoid-if guidance, and key risks
- It always keeps the local rule-based symptom suggestions as a fallback

### Environment Variables

Copy `.env.example` and configure these values in your deployment host:

```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
ALLOWED_ORIGIN=https://ryisegg.github.io
```

If the frontend stays on GitHub Pages and the API is deployed elsewhere, also set this when building the frontend:

```bash
VITE_AI_API_URL=https://your-vercel-app.vercel.app/api/symptom-advice
```

If the full app is deployed on Vercel, the frontend can use the default same-origin path `/api/symptom-advice`.

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

- Add age, pregnancy/lactation, chronic-condition, and current-medication triage before symptom suggestions
- Add stronger drug-interaction checks and duplicate-active-ingredient warnings
- Add source citations at the field level for live drug-label content
- Add accessibility and mobile viewport regression tests
- Add production review workflow for curated medication records
