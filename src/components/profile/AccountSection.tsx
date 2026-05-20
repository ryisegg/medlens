import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { Translations } from "../../i18n";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e]">
      {children}
    </div>
  );
}

type AuthMode = "signin" | "register" | "magic";

interface Props {
  p: Translations["profile"];
}

export function AccountSection({ p }: Props) {
  const {
    user,
    loading,
    configured,
    syncStatus,
    lastSyncedAt,
    syncMessage,
    signInWithEmail,
    signInWithPassword,
    signUpWithPassword,
    signInWithGoogle,
    signOut,
    syncNow,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

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
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
          {p.account}
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-[#636366]">{p.authNotConfigured}</p>
        <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">{p.authSetupHint}</p>
      </Card>
    );
  }

  if (user) {
    const syncLabel =
      syncStatus === "syncing"
        ? p.syncInProgress
        : syncStatus === "success"
          ? p.syncSuccess
          : syncStatus === "error"
            ? `${p.syncFailed}: ${syncMessage ?? ""}`
            : lastSyncedAt
              ? `${p.lastSynced}: ${new Date(lastSyncedAt).toLocaleString()}`
              : p.syncIdle;

    return (
      <Card>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
          {p.account}
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-[#8e8e93]">{syncLabel}</p>
        {syncMessage === "pulled" && (
          <p className="mt-1 text-xs text-blue-600 dark:text-[#0a84ff]">{p.syncPulledHint}</p>
        )}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={syncStatus === "syncing"}
            onClick={() => void syncNow()}
            className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50 dark:bg-[#0a84ff]"
          >
            {p.syncNow}
          </button>
          <button
            type="button"
            onClick={() => void signOut()}
            className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-red-600 dark:bg-[#2c2c2e] dark:text-red-400"
          >
            {p.signOut}
          </button>
        </div>
      </Card>
    );
  }

  async function handleMagicLink() {
    if (!email.trim()) return;
    setWorking(true);
    setError(null);
    setInfo(null);
    const { error: err } = await signInWithEmail(email.trim());
    setWorking(false);
    if (err) setError(err);
    else setSent(true);
  }

  async function handlePasswordAuth() {
    if (!email.trim() || !password) return;
    if (mode === "register" && password !== confirmPassword) {
      setError(p.passwordMismatch);
      return;
    }
    setWorking(true);
    setError(null);
    setInfo(null);

    if (mode === "register") {
      const { error: err, needsConfirmation } = await signUpWithPassword(email.trim(), password);
      setWorking(false);
      if (err) setError(err);
      else if (needsConfirmation) setInfo(p.confirmEmail);
      else setInfo(p.registerSuccess);
    } else {
      const { error: err } = await signInWithPassword(email.trim(), password);
      setWorking(false);
      if (err) setError(err);
    }
  }

  async function handleGoogle() {
    setWorking(true);
    setError(null);
    const { error: err } = await signInWithGoogle();
    setWorking(false);
    if (err) setError(err);
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white dark:placeholder-[#636366]";

  return (
    <Card>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]">
        {p.account}
      </p>
      <p className="mb-3 text-sm text-slate-500 dark:text-[#8e8e93]">{p.signInDesc}</p>

      <div className="mb-3 flex rounded-xl bg-slate-100 p-1 dark:bg-[#2c2c2e]">
        {([
          ["signin", p.signIn],
          ["register", p.register],
          ["magic", p.magicLinkTab],
        ] as [AuthMode, string][]).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(null); setInfo(null); setSent(false); }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
              mode === m
                ? "bg-white text-slate-900 shadow-sm dark:bg-black dark:text-white"
                : "text-slate-500 dark:text-[#8e8e93]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {sent && mode === "magic" ? (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
          {p.magicLinkSent}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={p.emailPlaceholder}
            className={inputClass}
            autoComplete="email"
          />
          {mode !== "magic" && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={p.passwordPlaceholder}
              className={inputClass}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
            />
          )}
          {mode === "register" && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={p.confirmPasswordPlaceholder}
              className={inputClass}
              autoComplete="new-password"
            />
          )}

          {mode === "magic" ? (
            <button
              type="button"
              onClick={() => void handleMagicLink()}
              disabled={working || !email.trim()}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50 dark:bg-[#0a84ff]"
            >
              {working ? "…" : p.sendMagicLink}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void handlePasswordAuth()}
              disabled={working || !email.trim() || !password}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50 dark:bg-[#0a84ff]"
            >
              {working
                ? "…"
                : mode === "register"
                  ? p.createAccount
                  : p.signIn}
            </button>
          )}

          <button
            type="button"
            onClick={() => void handleGoogle()}
            disabled={working}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 dark:border-[#3a3a3c] dark:text-white"
          >
            {p.signInWithGoogle}
          </button>
        </div>
      )}

      {info && <p className="mt-2 text-xs text-green-600 dark:text-green-400">{info}</p>}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </Card>
  );
}
