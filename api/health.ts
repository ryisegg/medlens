type ApiRequest = {
  method?: string;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  end: () => void;
};

function setCors(res: ApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN ?? "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default function handler(req: ApiRequest, res: ApiResponse) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY);
  const supabaseConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
  const supabaseServiceConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);

  return res.status(200).json({
    ok: true,
    service: "medlens-api",
    version: "0.2.0",
    timestamp: new Date().toISOString(),
    features: {
      drugSearch: true,
      symptomAdvice: openaiConfigured,
      translation: openaiConfigured,
      medicationManagementSync: "contract-only",
      auth: supabaseConfigured ? "ready-to-wire" : "not-configured",
      billing: stripeConfigured ? "checkout-ready" : "not-configured",
    },
    configuration: {
      openaiConfigured,
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      allowedOrigin: process.env.ALLOWED_ORIGIN ?? "*",
      appUrl: process.env.APP_URL ?? null,
      supabaseConfigured,
      supabaseServiceConfigured,
      stripeConfigured,
    },
  });
}
