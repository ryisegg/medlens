import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
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
    <div className={`rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e] ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
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

function AccountCard({ p }: { p: P }) {
  const { user, loading, configured, signInWithEmail, signInWithGoogle, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  async function handleMagicLink() {
    if (!email.trim()) return;
    setWorking(true);
    setError(null);
    const { error: err } = await signInWithEmail(email.trim());
    setWorking(false);
    if (err) setError(err);
    else setSent(true);
  }

  async function handleGoogle() {
    setWorking(true);
    const { error: err } = await signInWithGoogle();
    setWorking(false);
    if (err) setError(err);
  }

  if (loading) {
    return (
      <Card>
        <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-[#2c2c2e]" />
      </Card>
    );
  }

  if (!configured) {
    return (
      <Card>
        <SectionTitle>{p.account}</SectionTitle>
        <p className="text-sm text-slate-500 dark:text-[#636366]">{p.authNotConfigured}</p>
      </Card>
    );
  }

  if (user) {
    return (
      <Card>
        <SectionTitle>{p.account}</SectionTitle>
        <p className="mb-3 text-xs leading-relaxed text-slate-500 dark:text-[#8e8e93]">
          {p.syncComingSoon}
        </p>
        <button
          type="button"
          onClick={() => void signOut()}
          className="w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-red-600 dark:bg-[#2c2c2e] dark:text-red-400"
        >
          {p.signOut}
        </button>
      </Card>
    );
  }

  return (
    <Card>
      <SectionTitle>{p.account}</SectionTitle>
      {sent ? (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
          {p.magicLinkSent}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleMagicLink()}
            placeholder={p.emailPlaceholder}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white dark:placeholder-[#636366]"
          />
          <button
            type="button"
            onClick={() => void handleMagicLink()}
            disabled={working || !email.trim()}
            className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50 dark:bg-[#0a84ff]"
          >
            {working ? "…" : p.sendMagicLink}
          </button>
          <button
            type="button"
            onClick={() => void handleGoogle()}
            disabled={working}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 dark:border-[#3a3a3c] dark:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {p.signInWithGoogle}
          </button>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )}
    </Card>
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
      <AccountCard p={p} />
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
