import { useCallback } from "react";
import { useApp } from "../../context/AppContext";
import { clearMedlensLocalData } from "../../lib/medlensStorage";
import type { Translations } from "../../i18n";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e]">
      {children}
    </div>
  );
}

interface Props {
  p: Translations["profile"];
}

export function DataPrivacyCard({ p }: Props) {
  const {
    favorites,
    savedApiDrugs,
    healthProfile,
    recentSearches,
    apiHistory,
    clearRecentSearches,
    clearApiHistory,
  } = useApp();

  const exportLocalData = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      favorites,
      savedApiDrugs,
      healthProfile,
      recentSearches,
      apiHistory,
      schedules: localStorage.getItem("medlens_schedules"),
      doseLogs: localStorage.getItem("medlens_dose_logs"),
      cabinet: localStorage.getItem("medlens_cabinet"),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medlens-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [apiHistory, favorites, healthProfile, recentSearches, savedApiDrugs]);

  function handleClearAll() {
    if (!window.confirm(p.clearAllConfirm)) return;
    clearMedlensLocalData();
    window.location.reload();
  }

  return (
    <Card>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
        {p.dataPrivacy}
      </p>
      <div className="space-y-2">
        <button
          type="button"
          onClick={exportLocalData}
          className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 dark:border-[#3a3a3c] dark:text-[#c7c7cc]"
        >
          {p.exportData}
        </button>
        <button
          type="button"
          onClick={clearApiHistory}
          disabled={apiHistory.length === 0}
          className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-[#3a3a3c] dark:text-[#c7c7cc]"
        >
          {p.clearViewHistoryBtn}
        </button>
        <button
          type="button"
          onClick={clearRecentSearches}
          disabled={recentSearches.length === 0}
          className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-[#3a3a3c] dark:text-[#c7c7cc]"
        >
          {p.clearRecentBtn}
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          className="w-full rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400"
        >
          {p.clearAllData}
        </button>
      </div>
      <p className="mt-3 text-[10px] text-slate-400 dark:text-[#636366]">
        {p.version} 0.0.0
      </p>
    </Card>
  );
}
