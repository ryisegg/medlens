function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

/** Production Vercel API (also set in GitHub repo variable VITE_API_BASE_URL). */
export const DEFAULT_API_BASE_URL = "https://medlens-mu.vercel.app";

export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (configured?.trim()) return trimTrailingSlash(configured.trim());

  if (typeof window !== "undefined" && window.location.hostname.endsWith("github.io")) {
    return DEFAULT_API_BASE_URL;
  }

  if (import.meta.env.DEV) {
    return DEFAULT_API_BASE_URL;
  }

  return "";
}

export function getApiUrl(path: string, legacyEndpoint?: string) {
  if (legacyEndpoint) return legacyEndpoint;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return "";
  }

  return `${baseUrl}${normalizedPath}`;
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  if (!url) {
    throw new Error("API endpoint is not configured for this deployment.");
  }

  const response = await fetch(url, init);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? data?.message ?? `API request failed with status ${response.status}`);
  }

  return data as T;
}
