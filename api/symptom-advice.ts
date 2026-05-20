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

type HealthProfilePayload = {
  allergies?: string[];
  conditions?: string[];
  currentMeds?: string[];
};

type SymptomAdviceRequest = {
  language?: "en" | "zh";
  freeText?: string;
  selectedSymptoms?: string[];
  healthProfile?: HealthProfilePayload;
};

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-4o-mini";

const adviceSchema = {
  type: "json_schema",
  name: "symptom_advice",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "source",
      "emergency",
      "summary",
      "redFlags",
      "otcCategories",
      "selfCare",
      "askForMore",
      "disclaimer",
    ],
    properties: {
      source: { type: "string", enum: ["ai"] },
      emergency: { type: "boolean" },
      summary: { type: "string" },
      redFlags: { type: "array", items: { type: "string" }, maxItems: 6 },
      otcCategories: {
        type: "array",
        maxItems: 4,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["name", "examples", "rationale", "avoidIf", "keyRisks"],
          properties: {
            name: { type: "string" },
            examples: { type: "array", items: { type: "string" }, maxItems: 5 },
            rationale: { type: "string" },
            avoidIf: { type: "string" },
            keyRisks: { type: "string" },
          },
        },
      },
      selfCare: { type: "array", items: { type: "string" }, maxItems: 6 },
      askForMore: { type: "array", items: { type: "string" }, maxItems: 6 },
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
  const windowMs = 60_000;
  const max = 30;
  let bucket = rateBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    rateBuckets.set(ip, bucket);
  }
  bucket.count += 1;
  if (bucket.count > max) {
    res.status(429).json({ error: "Too many requests" });
    return false;
  }
  return true;
}

function normalizeBody(body: unknown): SymptomAdviceRequest {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as SymptomAdviceRequest;
    } catch {
      return {};
    }
  }

  if (body && typeof body === "object") {
    return body as SymptomAdviceRequest;
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
      error: "AI backend is not configured. Set OPENAI_API_KEY in the deployment environment.",
    });
  }

  const body = normalizeBody(req.body);
  const language = body.language === "zh" ? "zh" : "en";
  const freeText = body.freeText?.trim() ?? "";
  const selectedSymptoms = Array.isArray(body.selectedSymptoms)
    ? body.selectedSymptoms.filter((item): item is string => typeof item === "string").slice(0, 12)
    : [];

  if (!freeText && selectedSymptoms.length === 0) {
    return res.status(400).json({ error: "Missing symptom description" });
  }

  const profile = body.healthProfile ?? {};
  const healthProfile = {
    allergies: Array.isArray(profile.allergies)
      ? profile.allergies.filter((item): item is string => typeof item === "string").slice(0, 20)
      : [],
    conditions: Array.isArray(profile.conditions)
      ? profile.conditions.filter((item): item is string => typeof item === "string").slice(0, 20)
      : [],
    currentMeds: Array.isArray(profile.currentMeds)
      ? profile.currentMeds.filter((item): item is string => typeof item === "string").slice(0, 20)
      : [],
  };

  const userPayload = {
    language,
    freeText,
    selectedSymptoms,
    healthProfile,
  };

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
              "You are MedLens, a cautious medication education assistant. Provide educational triage guidance only. Do not diagnose, prescribe, calculate personalized dosing, or claim that a medicine is safe for a specific person. Prioritize emergency red flags and advise urgent care when appropriate. When healthProfile is provided, personalize avoidIf guidance for listed allergies, conditions, and current medications without claiming safety. Suggest OTC medication classes only when reasonable, include who should avoid them, key risks, and when to ask a clinician or pharmacist. Respond in the requested language.",
          },
          {
            role: "user",
            content: JSON.stringify(userPayload),
          },
        ],
        text: { format: adviceSchema },
      }),
    });

    const data = await aiResponse.json().catch(() => null);

    if (!aiResponse.ok) {
      return res.status(aiResponse.status).json({
        error: "AI advice request failed",
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
      error: "AI advice is temporarily unavailable",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
