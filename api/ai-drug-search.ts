type ApiRequest = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  end: () => void;
};

type AiDrugSearchRequest = {
  query?: string;
  language?: "en" | "zh";
};

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-4o-mini";

const drugSearchSchema = {
  type: "json_schema",
  name: "ai_drug_search",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["suggestions", "seeDoctor", "disclaimer"],
    properties: {
      suggestions: {
        type: "array",
        maxItems: 6,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["name", "genericName", "category", "summary", "otcOrRx", "keyUses", "warnings"],
          properties: {
            name: { type: "string" },
            genericName: { type: "string" },
            category: { type: "string" },
            summary: { type: "string" },
            otcOrRx: { type: "string", enum: ["OTC", "Rx", "Unknown"] },
            keyUses: { type: "array", items: { type: "string" }, maxItems: 4 },
            warnings: { type: "string" },
          },
        },
      },
      seeDoctor: { type: "boolean" },
      disclaimer: { type: "string" },
    },
  },
} as const;

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function setCors(res: ApiResponse) {
  const origin = process.env.ALLOWED_ORIGIN?.trim();
  res.setHeader("Access-Control-Allow-Origin", origin || "https://ryisegg.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function enforceRateLimit(req: ApiRequest, res: ApiResponse): boolean {
  const forwarded = req.headers?.["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  let bucket = rateBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + 60_000 };
    rateBuckets.set(ip, bucket);
  }
  bucket.count += 1;
  if (bucket.count > 30) {
    res.status(429).json({ error: "Too many requests" });
    return false;
  }
  return true;
}

function normalizeBody(body: unknown): AiDrugSearchRequest {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as AiDrugSearchRequest;
    } catch {
      return {};
    }
  }
  if (body && typeof body === "object") {
    return body as AiDrugSearchRequest;
  }
  return {};
}

function extractOutputText(data: unknown): string {
  const d = data as Record<string, unknown>;
  if (typeof d?.output_text === "string") {
    return d.output_text;
  }

  const parts: string[] = [];
  for (const item of (d?.output as unknown[] | undefined) ?? []) {
    const it = item as Record<string, unknown>;
    for (const content of (it?.content as unknown[] | undefined) ?? []) {
      const ct = content as Record<string, unknown>;
      if (typeof ct?.text === "string") {
        parts.push(ct.text);
      }
    }
  }

  return parts.join("\n");
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!enforceRateLimit(req, res)) {
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "AI search backend is not configured. Set OPENAI_API_KEY in the deployment environment.",
    });
  }

  const body = normalizeBody(req.body);
  const query = body.query?.trim() ?? "";
  const language = body.language === "zh" ? "zh" : "en";

  if (!query || query.length < 2) {
    return res.status(400).json({ error: "Query must be at least 2 characters" });
  }

  try {
    const aiResponse = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
        input: [
          {
            role: "system",
            content:
              "You are MedLens, a cautious medication education assistant. When given a drug name or symptom query, return relevant medications with educational summaries. Include OTC and Rx options. For each drug: provide its common name, generic name, category, a brief patient-friendly summary, whether it is OTC or Rx, key uses (up to 4), and important warnings or contraindications in a single sentence. Set seeDoctor to true if the query suggests a condition that warrants professional evaluation. Do not diagnose. Do not recommend specific doses. Respond in the requested language.",
          },
          {
            role: "user",
            content: JSON.stringify({ query, language }),
          },
        ],
        text: { format: drugSearchSchema },
      }),
    });

    const data = await aiResponse.json().catch(() => null);

    if (!aiResponse.ok) {
      return res.status(aiResponse.status).json({
        error: "AI search request failed",
        detail: data?.error?.message ?? "Unknown OpenAI API error",
      });
    }

    const outputText = extractOutputText(data);
    if (!outputText) {
      return res.status(502).json({ error: "AI response did not include usable text" });
    }

    return res.status(200).json(JSON.parse(outputText));
  } catch (error) {
    return res.status(500).json({
      error: "AI search is temporarily unavailable",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
