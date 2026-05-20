import { CABINET_KEY, DOSE_LOG_KEY, SCHEDULE_KEY } from "./medicationKeys";
import { removeKey } from "./storage";

/** All MedLens localStorage keys used by the app. */
export const MEDLENS_STORAGE_KEYS = [
  "medlens_lang",
  "medlens_theme",
  "medlens_onboarded",
  "medlens_region",
  "medlens_recent",
  "medlens_favorites",
  "medlens_reminders",
  "medlens_saved_api",
  "medlens_api_history",
  "medlens_recent_searches",
  "medlens_health_profile",
  SCHEDULE_KEY,
  DOSE_LOG_KEY,
  CABINET_KEY,
] as const;

export function clearMedlensLocalData(): void {
  for (const key of MEDLENS_STORAGE_KEYS) {
    removeKey(key);
  }
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("medlens_cache_")) keysToRemove.push(key);
    }
    keysToRemove.forEach(removeKey);
  } catch {
    /* ignore */
  }
}
