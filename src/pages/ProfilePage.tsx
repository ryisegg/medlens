import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { AccountSection } from "../components/profile/AccountSection";
import { getTranslations } from "../i18n";
import { lookupZhDrug } from "../data/zhDrugNames";
import { getDrugById } from "../data/catalog";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { QuickLinks } from "../components/profile/QuickLinks";
import { ViewHistoryCard } from "../components/profile/ViewHistoryCard";
import { DataPrivacyCard } from "../components/profile/DataPrivacyCard";
import type { Translations } from "../i18n";

type P = Translations["profile"];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white shadow-soft px-5 py-4 dark:bg-[#1c1c1e] ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
        {children}
      </p>
      {action}
    </div>
  );
}

function TagList({
  items, onAdd, onRemove, placeholder, addLabel,
}: {
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  placeholder: string;
  addLabel: string;
}) {
  const [input, setInput] = useState("");

  function handleAdd() {
    const val = input.trim();
    if (!val || items.includes(val)) return;
    onAdd(val);
    setInput("");
  }

  return (
    <div className="space-y-2">
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-[#2c2c2e] dark:text-[#c7c7cc]"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="ml-0.5 text-slate-400 hover:text-red-500 dark:text-[#636366]"
                aria-label={`Remove ${item}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white dark:placeholder-[#636366]"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!input.trim()}
          className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40 dark:bg-[#0a84ff]"
        >
          {addLabel}
        </button>
      </div>
    </div>
  );
}

function MyMedicationsCard({ p }: { p: P }) {
  const { favorites, toggleFavorite, savedApiDrugs, toggleSavedApiDrug, language } = useApp();
  const navigate = useNavigate();

  const localFavDrugs = favorites
    .map((id) => getDrugById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getDrugById>>[];

  const hasAny = localFavDrugs.length > 0 || savedApiDrugs.length > 0;

  return (
    <Card>
      <SectionTitle>{p.savedMeds}</SectionTitle>
      {!hasAny ? (
        <p className="text-sm text-slate-400 dark:text-[#636366]">{p.savedMedsEmpty}</p>
      ) : (
        <div className="space-y-2">
          {localFavDrugs.map((drug) => {
            const zh = lookupZhDrug(drug.genericName ?? drug.name);
            const displayName =
              language === "zh" && (drug.chineseName ?? zh?.genericZh)
                ? (drug.chineseName ?? zh?.genericZh ?? drug.name)
                : drug.name;
            return (
              <div
                key={drug.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-[#2c2c2e]"
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => navigate(`/drugs/${drug.id}`)}
                >
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {displayName}
                  </p>
                  {displayName !== drug.name && (
                    <p className="text-xs text-slate-400 dark:text-[#636366]">{drug.name}</p>
                  )}
                  <p className="text-xs text-slate-400 dark:text-[#636366]">
                    {drug.otcOrRx} · {language === "zh" ? "本地收录" : "local"}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(drug.id)}
                  className="ml-3 flex-shrink-0 text-red-400 hover:text-red-500"
                  aria-label="Remove favorite"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </button>
              </div>
            );
          })}
          {savedApiDrugs.map((drug) => {
            const zh = lookupZhDrug(drug.genericName ?? drug.name);
            const displayName = language === "zh" && zh ? zh.genericZh : drug.name;
            return (
              <div
                key={drug.name}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-[#2c2c2e]"
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => navigate(`/drugs/api/${encodeURIComponent(drug.name)}`)}
                >
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {displayName}
                  </p>
                  {displayName !== drug.name && (
                    <p className="text-xs text-slate-400 dark:text-[#636366]">{drug.name}</p>
                  )}
                  <p className="text-xs text-slate-400 dark:text-[#636366]">FDA / RxNorm</p>
                </button>
                <button
                  type="button"
                  onClick={() => toggleSavedApiDrug(drug.name)}
                  className="ml-3 flex-shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-[#3a3a3c]"
                  aria-label="Remove saved drug"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function RecentSearchesCard({ p }: { p: P }) {
  const { recentSearches, clearRecentSearches, setSearchQuery } = useApp();
  const navigate = useNavigate();

  return (
    <Card>
      <SectionTitle
        action={
          recentSearches.length > 0 ? (
            <button
              type="button"
              onClick={clearRecentSearches}
              className="text-xs font-semibold text-red-500"
            >
              {p.clearRecent}
            </button>
          ) : undefined
        }
      >
        {p.recentSearches}
      </SectionTitle>
      {recentSearches.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-[#636366]">{p.recentSearchesEmpty}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {recentSearches.map(({ query }) => (
            <button
              key={query}
              type="button"
              onClick={() => {
                setSearchQuery(query);
                navigate("/drugs");
              }}
              className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:bg-[#2c2c2e] dark:text-[#c7c7cc] dark:hover:bg-blue-950/40 dark:hover:text-[#0a84ff]"
            >
              <svg className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              {query}
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

function HealthProfileCard({ p }: { p: P }) {
  const { healthProfile, updateHealthProfile } = useApp();

  function addItem(field: keyof typeof healthProfile, val: string) {
    updateHealthProfile({ [field]: [...healthProfile[field], val] });
  }
  function removeItem(field: keyof typeof healthProfile, val: string) {
    updateHealthProfile({ [field]: healthProfile[field].filter((v) => v !== val) });
  }

  const totalItems =
    healthProfile.allergies.length +
    healthProfile.conditions.length +
    healthProfile.currentMeds.length;

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
          {p.healthProfile}
        </p>
        {totalItems > 0 && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {totalItems}
          </span>
        )}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
          ⚠ {p.healthProfileDisclaimer}
        </p>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-[#8e8e93]">
            🚫 {p.allergies}
          </p>
          <TagList
            items={healthProfile.allergies}
            onAdd={(v) => addItem("allergies", v)}
            onRemove={(v) => removeItem("allergies", v)}
            placeholder={p.itemPlaceholder}
            addLabel={p.addItem}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-[#8e8e93]">
            🏥 {p.conditions}
          </p>
          <TagList
            items={healthProfile.conditions}
            onAdd={(v) => addItem("conditions", v)}
            onRemove={(v) => removeItem("conditions", v)}
            placeholder={p.itemPlaceholder}
            addLabel={p.addItem}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-[#8e8e93]">
            💊 {p.currentMeds}
          </p>
          <TagList
            items={healthProfile.currentMeds}
            onAdd={(v) => addItem("currentMeds", v)}
            onRemove={(v) => removeItem("currentMeds", v)}
            placeholder={p.itemPlaceholder}
            addLabel={p.addItem}
          />
        </div>
      </div>
    </Card>
  );
}

function SafetyAccordion({ p }: { p: P }) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <button
        type="button"
        className="flex w-full items-center justify-between"
        onClick={() => setOpen((o) => !o)}
      >
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
          {p.safetyInfo}
        </p>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          <div className="rounded-xl bg-red-50 px-4 py-3 dark:bg-red-950/50">
            <p className="text-sm font-bold text-red-700 dark:text-red-300">{p.emergencyNumbers}</p>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-[#636366]">
            {p.disclaimerShort}
          </p>
        </div>
      )}
    </Card>
  );
}

export function ProfilePage() {
  const { language } = useApp();
  const t = getTranslations(language);
  const p = t.profile;

  useEffect(() => {
    document.title = `${p.title} — ${t.appName}`;
  }, [p.title, t.appName]);

  return (
    <div className="space-y-3 px-4 py-4">
      <ProfileHeader p={p} />
      <AccountSection p={p} />
      <QuickLinks p={p} />
      <HealthProfileCard p={p} />
      <MyMedicationsCard p={p} />
      <ViewHistoryCard p={p} />
      <RecentSearchesCard p={p} />
      <DataPrivacyCard p={p} />
      <SafetyAccordion p={p} />
      <div className="h-2" />
    </div>
  );
}
