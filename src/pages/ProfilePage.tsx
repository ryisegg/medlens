import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { getTranslations } from "../i18n";
import { lookupZhDrug } from "../data/zhDrugNames";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e] ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
      {children}
    </p>
  );
}

function Row({ label, children, border = true }: { label: string; children: React.ReactNode; border?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${border ? "border-b border-slate-100 dark:border-[#2c2c2e]" : ""}`}>
      <span className="text-sm text-slate-700 dark:text-[#ebebf5cc]">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

// ─── Account Card ────────────────────────────────────────────────────────────
function AccountCard({ p }: { p: ReturnType<typeof getTranslations>["profile"] }) {
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
    if (err) { setError(err); } else { setSent(true); }
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
        <div className="h-10 animate-pulse rounded-xl bg-slate-100 dark:bg-[#2c2c2e]" />
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
    const initials = (user.email ?? "?").slice(0, 2).toUpperCase();
    return (
      <Card>
        <SectionTitle>{p.account}</SectionTitle>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white dark:bg-[#0a84ff]">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 dark:text-[#636366]">{p.signedInAs}</p>
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user.email}</p>
          </div>
        </div>
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
      <p className="mb-4 text-sm text-slate-500 dark:text-[#8e8e93]">{p.signInDesc}</p>

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
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {p.signInWithGoogle}
          </button>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )}
    </Card>
  );
}

// ─── Saved Meds Card ─────────────────────────────────────────────────────────
function SavedMedsCard({ p }: { p: ReturnType<typeof getTranslations>["profile"] }) {
  const { savedApiDrugs, toggleSavedApiDrug, language } = useApp();
  const navigate = useNavigate();

  return (
    <Card>
      <SectionTitle>{p.savedMeds}</SectionTitle>
      {savedApiDrugs.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-[#636366]">{p.savedMedsEmpty}</p>
      ) : (
        <div className="space-y-2">
          {savedApiDrugs.map((drug) => {
            const zh = lookupZhDrug(drug.genericName ?? drug.name);
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
                    {language === "zh" && zh ? zh.genericZh : drug.name}
                  </p>
                  {language === "zh" && zh ? (
                    <p className="text-xs text-slate-400 dark:text-[#636366]">{drug.genericName ?? drug.name}</p>
                  ) : (
                    drug.genericName && drug.genericName !== drug.name && (
                      <p className="text-xs text-slate-400 dark:text-[#636366]">{drug.genericName}</p>
                    )
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => toggleSavedApiDrug(drug.name)}
                  className="ml-3 flex-shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-[#3a3a3c]"
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

// ─── History Card ─────────────────────────────────────────────────────────────
function HistoryCard({ p }: { p: ReturnType<typeof getTranslations>["profile"] }) {
  const { apiHistory, clearApiHistory, language } = useApp();
  const navigate = useNavigate();

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
          {p.history}
        </p>
        {apiHistory.length > 0 && (
          <button
            type="button"
            onClick={clearApiHistory}
            className="text-xs font-semibold text-red-500"
          >
            {p.clearHistory}
          </button>
        )}
      </div>
      {apiHistory.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-[#636366]">{p.historyEmpty}</p>
      ) : (
        <div className="space-y-1">
          {apiHistory.map((entry) => {
            const zh = lookupZhDrug(entry.genericName ?? entry.name);
            return (
              <button
                key={entry.name + entry.viewedAt}
                type="button"
                onClick={() => navigate(`/drugs/api/${encodeURIComponent(entry.name)}`)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-[#2c2c2e]"
              >
                <svg className="h-4 w-4 flex-shrink-0 text-slate-300 dark:text-[#3a3a3c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-white">
                    {language === "zh" && zh ? zh.genericZh : entry.name}
                  </p>
                  {language === "zh" && zh && (
                    <p className="text-xs text-slate-400 dark:text-[#636366]">{entry.name}</p>
                  )}
                </div>
                <svg className="h-3.5 w-3.5 flex-shrink-0 text-slate-300 dark:text-[#3a3a3c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ─── Settings Card ────────────────────────────────────────────────────────────
function SettingsCard({ p }: { p: ReturnType<typeof getTranslations>["profile"] }) {
  const { language, setLanguage, isDark, toggleDark } = useApp();

  return (
    <Card>
      <SectionTitle>{p.settings}</SectionTitle>
      <Row label={p.language}>
        <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-[#3a3a3c]">
          {(["zh", "en"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                language === lang
                  ? "bg-blue-600 text-white dark:bg-[#0a84ff]"
                  : "text-slate-500 dark:text-[#8e8e93]"
              }`}
            >
              {lang === "zh" ? "中文" : "EN"}
            </button>
          ))}
        </div>
      </Row>
      <Row label={p.appearance} border={false}>
        <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-[#3a3a3c]">
          {([false, true] as const).map((dark) => (
            <button
              key={String(dark)}
              type="button"
              onClick={() => { if (isDark !== dark) toggleDark(); }}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                isDark === dark
                  ? "bg-blue-600 text-white dark:bg-[#0a84ff]"
                  : "text-slate-500 dark:text-[#8e8e93]"
              }`}
            >
              {dark ? p.dark : p.light}
            </button>
          ))}
        </div>
      </Row>
    </Card>
  );
}

// ─── Safety Accordion ─────────────────────────────────────────────────────────
function SafetyAccordion({ p }: { p: ReturnType<typeof getTranslations>["profile"] }) {
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
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          <div className="rounded-xl bg-red-50 px-4 py-3 dark:bg-red-950/50">
            <p className="text-sm font-bold text-red-700 dark:text-red-300">{p.emergencyNumbers}</p>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-[#636366]">{p.disclaimerShort}</p>
        </div>
      )}
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function ProfilePage() {
  const { language } = useApp();
  const t = getTranslations(language);
  const p = t.profile;

  useEffect(() => {
    document.title = `${p.title} — ${t.appName}`;
  }, [p.title, t.appName]);

  return (
    <div className="space-y-3 px-4 py-4">
      <AccountCard p={p} />
      <SavedMedsCard p={p} />
      <HistoryCard p={p} />
      <SettingsCard p={p} />
      <SafetyAccordion p={p} />
      <div className="h-2" />
    </div>
  );
}
