import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { supabaseConfigured } from "../../services/supabase";
import { CABINET_KEY, SCHEDULE_KEY } from "../../lib/medicationKeys";
import { loadJSON } from "../../lib/storage";
import type { MedicationSchedule, CabinetItem } from "../../types";
import type { Translations } from "../../i18n";

interface Props {
  p: Translations["profile"];
}

export function ProfileHeader({ p }: Props) {
  const { favorites, savedApiDrugs } = useApp();
  const { user, syncStatus, lastSyncedAt } = useAuth();

  const scheduleCount = loadJSON<MedicationSchedule[]>(SCHEDULE_KEY, []).length;
  const cabinetCount = loadJSON<CabinetItem[]>(CABINET_KEY, []).length;
  const savedCount = favorites.length + savedApiDrugs.length;
  const stats = [
    { label: p.statsSaved, value: savedCount },
    { label: p.statsSchedules, value: scheduleCount },
    { label: p.statsCabinet, value: cabinetCount },
  ];

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 px-5 py-5 text-white shadow-sm dark:from-[#0a84ff] dark:via-blue-600 dark:to-cyan-600">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-lg font-bold backdrop-blur">
          {user ? initials : "👤"}
        </div>
        <div className="min-w-0 flex-1">
          {user ? (
            <>
              <p className="truncate text-base font-bold">{user.email}</p>
              <p className="mt-0.5 text-xs text-white/80">{p.signedInAs}</p>
            </>
          ) : (
            <>
              <p className="text-base font-bold">{p.title}</p>
              <p className="mt-0.5 text-xs text-white/80">{p.signInDesc}</p>
            </>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">
              {p.planFree}
            </span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">
              {!supabaseConfigured
                ? p.syncLocalOnly
                : user
                  ? syncStatus === "syncing"
                    ? p.syncInProgress
                    : lastSyncedAt
                      ? p.lastSynced
                      : p.syncSignedIn
                  : p.syncLocalOnly}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl bg-white/15 px-2 py-2.5 text-center backdrop-blur"
          >
            <p className="text-lg font-bold leading-none">{value}</p>
            <p className="mt-1 text-[10px] font-medium text-white/85">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
