# MedLens Backend

MedLens currently ships as a static React app plus Vercel-compatible serverless API routes.

## Current API Routes

| Route | Purpose | Status |
| --- | --- | --- |
| `GET /api/health` | Backend health/config check | Ready |
| `POST /api/symptom-advice` | AI symptom triage guidance | Ready, requires `OPENAI_API_KEY` |
| `POST /api/translate` | Medical label translation | Ready, requires `OPENAI_API_KEY` |
| `POST /api/medication-management` | Calendar/cabinet sync contract validation | Contract-only |

## Environment Variables

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
ALLOWED_ORIGIN=https://ryisegg.github.io
```

If the frontend remains on GitHub Pages while the backend is deployed on Vercel, set these frontend build variables:

```bash
VITE_AI_API_URL=https://your-vercel-app.vercel.app/api/symptom-advice
VITE_TRANSLATE_API_URL=https://your-vercel-app.vercel.app/api/translate
```

## Medication Management Backend Plan

The frontend MVP stores schedules, dose logs, and cabinet inventory in `localStorage`:

- `medlens_schedules`
- `medlens_dose_logs`
- `medlens_cabinet`

The backend contract endpoint accepts the same data models and validates them. The next production step is connecting it to persistent storage.

Recommended database tables:

```sql
create table profiles (
  id uuid primary key,
  email text,
  created_at timestamptz default now()
);

create table medication_schedules (
  id uuid primary key,
  user_id uuid references profiles(id),
  medication_name text not null,
  dosage text,
  frequency text not null,
  times text[] not null,
  start_date date not null,
  end_date date,
  notes text,
  linked_cabinet_item_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table dose_logs (
  id uuid primary key,
  user_id uuid references profiles(id),
  schedule_id uuid references medication_schedules(id),
  dose_date date not null,
  dose_time time not null,
  status text check (status in ('upcoming', 'taken', 'missed', 'skipped')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table cabinet_items (
  id uuid primary key,
  user_id uuid references profiles(id),
  medication_name text not null,
  generic_name text,
  strength text,
  quantity integer not null default 0,
  dosage_form text,
  expiration_date date,
  type text check (type in ('OTC', 'Prescription')),
  storage_location text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## Safety Notes

Medication reminders are informational. Backend sync must not imply a medication is appropriate, safe, or prescribed. Keep clinician/pharmacist disclaimers visible in the UI.
