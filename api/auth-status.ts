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

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKeyConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  return res.status(200).json({
    ok: true,
    provider: "supabase",
    configured: Boolean(supabaseUrl && anonKey),
    serviceKeyConfigured,
    publicConfig: supabaseUrl && anonKey ? {
      supabaseUrl,
      anonKeyAvailable: true,
    } : null,
    nextSteps: supabaseUrl && anonKey
      ? "Frontend can initialize Supabase Auth with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
      : "Set SUPABASE_URL and SUPABASE_ANON_KEY, plus SUPABASE_SERVICE_ROLE_KEY for trusted backend operations.",
  });
}
