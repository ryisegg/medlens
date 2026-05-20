import type { UserAppData, UserAppDataRow } from "../types/sync";
import { EMPTY_USER_APP_DATA } from "../types/sync";
import { MEDLENS_STORAGE_KEYS } from "../lib/medlensStorage";
import { loadJSON, saveJSON } from "../lib/storage";
import { notifySyncApplied } from "../lib/syncEvents";
import { supabase } from "./supabase";
import type {
  ApiHistoryEntry,
  CabinetItem,
  DoseLog,
  HealthProfile,
  MedicationSchedule,
  RecentSearch,
  Reminder,
  SavedApiDrug,
} from "../types";

const SYNC_META_KEY = "medlens_sync_updated_at";

export function collectLocalAppData(): UserAppData {
  return {
    healthProfile: loadJSON<HealthProfile>("medlens_health_profile", EMPTY_USER_APP_DATA.healthProfile),
    favorites: loadJSON<string[]>("medlens_favorites", []),
    savedApiDrugs: loadJSON<SavedApiDrug[]>("medlens_saved_api", []),
    apiHistory: loadJSON<ApiHistoryEntry[]>("medlens_api_history", []),
    recentSearches: loadJSON<RecentSearch[]>("medlens_recent_searches", []),
    reminders: loadJSON<Reminder[]>("medlens_reminders", []),
    schedules: loadJSON<MedicationSchedule[]>("medlens_schedules", []),
    doseLogs: loadJSON<DoseLog[]>("medlens_dose_logs", []),
    cabinet: loadJSON<CabinetItem[]>("medlens_cabinet", []),
  };
}

export function applyLocalAppData(data: UserAppData): void {
  saveJSON("medlens_health_profile", data.healthProfile);
  saveJSON("medlens_favorites", data.favorites);
  saveJSON("medlens_saved_api", data.savedApiDrugs);
  saveJSON("medlens_api_history", data.apiHistory);
  saveJSON("medlens_recent_searches", data.recentSearches);
  saveJSON("medlens_reminders", data.reminders);
  saveJSON("medlens_schedules", data.schedules);
  saveJSON("medlens_dose_logs", data.doseLogs);
  saveJSON("medlens_cabinet", data.cabinet);
  notifySyncApplied();
}

function getLocalSyncTime(): number {
  const raw = localStorage.getItem(SYNC_META_KEY);
  return raw ? Number(raw) : 0;
}

function setLocalSyncTime(ms: number) {
  try {
    localStorage.setItem(SYNC_META_KEY, String(ms));
  } catch {
    /* ignore */
  }
}

export async function pullRemoteAppData(userId: string): Promise<UserAppDataRow | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("user_app_data")
    .select("user_id, data, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return data as UserAppDataRow;
}

export async function pushRemoteAppData(userId: string, payload: UserAppData): Promise<string> {
  if (!supabase) throw new Error("Supabase is not configured");

  const updatedAt = new Date().toISOString();
  const { error } = await supabase.from("user_app_data").upsert({
    user_id: userId,
    data: payload,
    updated_at: updatedAt,
  });

  if (error) throw new Error(error.message);
  setLocalSyncTime(Date.parse(updatedAt));
  return updatedAt;
}

export type SyncResult =
  | { action: "pushed"; updatedAt: string }
  | { action: "pulled"; updatedAt: string };

/** Merge strategy: newer updated_at wins; first sync pushes local. */
export async function syncUserAppData(userId: string): Promise<SyncResult> {
  const local = collectLocalAppData();
  const localTime = getLocalSyncTime();
  const remote = await pullRemoteAppData(userId);

  if (!remote) {
    const updatedAt = await pushRemoteAppData(userId, local);
    return { action: "pushed", updatedAt };
  }

  const remoteTime = Date.parse(remote.updated_at);
  if (remoteTime > localTime) {
    applyLocalAppData({ ...EMPTY_USER_APP_DATA, ...remote.data });
    setLocalSyncTime(remoteTime);
    return { action: "pulled", updatedAt: remote.updated_at };
  }

  if (localTime > remoteTime) {
    const updatedAt = await pushRemoteAppData(userId, local);
    return { action: "pushed", updatedAt };
  }

  const updatedAt = await pushRemoteAppData(userId, local);
  return { action: "pushed", updatedAt };
}

export async function ensureUserProfile(userId: string, email?: string | null) {
  if (!supabase) return;

  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    email: email ?? undefined,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
}

export function listSyncStorageKeysForDocs(): readonly string[] {
  return MEDLENS_STORAGE_KEYS;
}
