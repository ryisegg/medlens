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

export interface UserAppData {
  healthProfile: HealthProfile;
  favorites: string[];
  savedApiDrugs: SavedApiDrug[];
  apiHistory: ApiHistoryEntry[];
  recentSearches: RecentSearch[];
  reminders: Reminder[];
  schedules: MedicationSchedule[];
  doseLogs: DoseLog[];
  cabinet: CabinetItem[];
}

export interface UserAppDataRow {
  user_id: string;
  data: UserAppData;
  updated_at: string;
}

export const EMPTY_USER_APP_DATA: UserAppData = {
  healthProfile: { allergies: [], conditions: [], currentMeds: [] },
  favorites: [],
  savedApiDrugs: [],
  apiHistory: [],
  recentSearches: [],
  reminders: [],
  schedules: [],
  doseLogs: [],
  cabinet: [],
};
