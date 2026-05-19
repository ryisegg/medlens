import { fetchJson, getApiUrl } from "./apiClient";

export type AuthStatusResponse = {
  ok: boolean;
  auth: {
    provider: "supabase";
    configured: boolean;
    publicClientReady: boolean;
    serverClientReady: boolean;
  };
  nextSteps: string[];
};

export type CheckoutSessionResponse = {
  id: string;
  url: string;
};

export async function fetchAuthStatus() {
  return fetchJson<AuthStatusResponse>(getApiUrl("/api/auth-status"));
}

export async function createBillingCheckoutSession(input?: {
  email?: string;
  successUrl?: string;
  cancelUrl?: string;
}) {
  return fetchJson<CheckoutSessionResponse>(getApiUrl("/api/billing-checkout"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input ?? {}),
  });
}
