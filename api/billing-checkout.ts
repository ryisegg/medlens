type ApiRequest = {
  method?: string;
  body?: unknown;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  end: () => void;
};

type CheckoutRequest = {
  email?: string;
  successUrl?: string;
  cancelUrl?: string;
};

function setCors(res: ApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN ?? "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function normalizeBody(body: unknown): CheckoutRequest {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as CheckoutRequest;
    } catch {
      return {};
    }
  }

  if (body && typeof body === "object") return body as CheckoutRequest;
  return {};
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  const appUrl = process.env.APP_URL ?? process.env.ALLOWED_ORIGIN ?? "http://localhost:5173";

  if (!secretKey || !priceId) {
    return res.status(503).json({
      error: "Billing is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID.",
    });
  }

  const body = normalizeBody(req.body);
  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("success_url", body.successUrl ?? `${appUrl}/cabinet?billing=success`);
  params.set("cancel_url", body.cancelUrl ?? `${appUrl}/cabinet?billing=cancelled`);
  params.set("allow_promotion_codes", "true");
  if (body.email) params.set("customer_email", body.email);

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await stripeResponse.json().catch(() => null);
  if (!stripeResponse.ok) {
    return res.status(stripeResponse.status).json({
      error: "Stripe checkout creation failed",
      detail: data?.error?.message ?? "Unknown Stripe error",
    });
  }

  return res.status(200).json({
    id: data.id,
    url: data.url,
  });
}
