# MedLens

MedLens is a medication lookup and safety companion for helping people understand what a medicine is used for, what risks to watch for, and when to seek professional care.

## What It Does

- Search medications by brand name, generic name, ingredient, or imprint
- View medication uses, side effects, contraindications, interactions, pregnancy/lactation notes, and emergency warning signs
- Identify pills from color, shape, imprint, and strength clues
- Check common symptom categories and see safer OTC direction with red-flag escalation
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

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Query
- Capacitor for iOS packaging

## Local Development

```bash
npm install
npm run dev
```

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
