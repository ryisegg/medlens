import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { lookupZhDrug } from "../../data/zhDrugNames";
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

export function ViewHistoryCard({ p }: Props) {
  const { language, apiHistory, clearApiHistory } = useApp();
  const navigate = useNavigate();

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
          {p.viewHistory}
        </p>
        {apiHistory.length > 0 && (
          <button
            type="button"
            onClick={clearApiHistory}
            className="text-xs font-semibold text-red-500"
          >
            {p.clearViewHistory}
          </button>
        )}
      </div>

      {apiHistory.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-[#636366]">{p.viewHistoryEmpty}</p>
      ) : (
        <div className="space-y-2">
          {apiHistory.map((entry) => {
            const zh = lookupZhDrug(entry.genericName ?? entry.name);
            const displayName =
              language === "zh" && zh ? zh.genericZh : entry.name;
            return (
              <button
                key={`${entry.name}-${entry.viewedAt}`}
                type="button"
                onClick={() =>
                  navigate(`/drugs/api/${encodeURIComponent(entry.name)}`)
                }
                className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-left dark:bg-[#2c2c2e]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {displayName}
                  </p>
                  {displayName !== entry.name && (
                    <p className="text-xs text-slate-400 dark:text-[#636366]">
                      {entry.name}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 dark:text-[#636366]">RxNorm / FDA</p>
                </div>
                <span className="text-slate-300 dark:text-[#636366]">›</span>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
