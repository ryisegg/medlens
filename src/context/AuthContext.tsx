import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, supabaseConfigured } from "../services/supabase";
import { ensureUserProfile, syncUserAppData, type SyncResult } from "../services/syncService";

export type SyncStatus = "idle" | "syncing" | "success" | "error";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  syncMessage: string | null;
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithPassword: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<SyncResult | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(supabaseConfigured);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const autoSyncedRef = useRef<string | null>(null);

  const runSync = useCallback(async (userId: string, email?: string | null) => {
    if (!supabaseConfigured) return null;
    setSyncStatus("syncing");
    setSyncMessage(null);
    try {
      await ensureUserProfile(userId, email);
      const result = await syncUserAppData(userId);
      setLastSyncedAt(result.updatedAt);
      setSyncStatus("success");
      setSyncMessage(result.action);
      return result;
    } catch (error) {
      setSyncStatus("error");
      setSyncMessage(error instanceof Error ? error.message : "Sync failed");
      return null;
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.id || !supabaseConfigured) return;
    if (autoSyncedRef.current === user.id) return;
    autoSyncedRef.current = user.id;
    void runSync(user.id, user.email);
  }, [user?.id, user?.email, runSync]);

  const profileUrl = `${window.location.origin}${import.meta.env.BASE_URL}profile`;

  const signInWithEmail = useCallback(async (email: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: "Auth not configured" };
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: profileUrl },
    });
    return { error: error?.message ?? null };
  }, [profileUrl]);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: "Auth not configured" };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUpWithPassword = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: "Auth not configured" };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: profileUrl },
    });
    if (error) return { error: error.message };
    const needsConfirmation = !data.session;
    if (data.user?.id) {
      try {
        await ensureUserProfile(data.user.id, email);
      } catch {
        /* profile table may not exist yet */
      }
    }
    return { error: null, needsConfirmation };
  }, [profileUrl]);

  const signInWithGoogle = useCallback(async (): Promise<{ error: string | null }> => {
    if (!supabase) return { error: "Auth not configured" };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: profileUrl },
    });
    return { error: error?.message ?? null };
  }, [profileUrl]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    autoSyncedRef.current = null;
    setSyncStatus("idle");
    setLastSyncedAt(null);
    setSyncMessage(null);
  }, []);

  const syncNow = useCallback(async () => {
    if (!user?.id) return null;
    return runSync(user.id, user.email);
  }, [runSync, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        configured: supabaseConfigured,
        syncStatus,
        lastSyncedAt,
        syncMessage,
        signInWithEmail,
        signInWithPassword,
        signUpWithPassword,
        signInWithGoogle,
        signOut,
        syncNow,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
