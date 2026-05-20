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

type TranslateRequest = {
  targetLanguage?: "zh" | "en";
  context?: string;
  sections?: Array<{ id: string; text: string }>;
};

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-4o-mini";

const translationSchema = {
  type: "json_schema",
  name: "medical_translation",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["translations", "disclaimer"],
    properties: {
      translations: {
        type: "array",
        maxItems: 12,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "text"],
          properties: {
            id: { type: "string" },
            text: { type: "string" },
          },
        },
      },
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

function normalizeBody(body: unknown): TranslateRequest {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as TranslateRequest;
    } catch {
      return {};
    }
  }

  if (body && typeof body === "object") {
    return body as TranslateRequest;
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
      error: "Translation backend is not configured. Set OPENAI_API_KEY in the deployment environment.",
    });
  }

  const body = normalizeBody(req.body);
  const targetLanguage = body.targetLanguage === "en" ? "en" : "zh";
  const sections = Array.isArray(body.sections)
    ? body.sections
        .filter((section): section is { id: string; text: string } => (
          typeof section?.id === "string" && typeof section?.text === "string" && section.text.trim().length > 0
        ))
        .slice(0, 12)
        .map((section) => ({ id: section.id.slice(0, 48), text: section.text.slice(0, 5000) }))
    : [];

  if (sections.length === 0) {
    return res.status(400).json({ error: "No text sections to translate" });
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
              "You translate medication label content for a consumer health app. Preserve medical meaning, warnings, contraindications, units, drug names, and uncertainty. Do not add new medical claims or simplify away risk language. Keep the output readable for patients, but faithful to the source. Translate only the provided sections and keep each id unchanged.",
          },
          {
            role: "user",
            content: JSON.stringify({ targetLanguage, context: body.context ?? "Medication label", sections }),
          },
        ],
        text: { format: translationSchema },
      }),
    });

    const data = await aiResponse.json().catch(() => null);

    if (!aiResponse.ok) {
      return res.status(aiResponse.status).json({
        error: "Translation request failed",
        detail: data?.error?.message ?? "Unknown OpenAI API error",
      });
    }

    const outputText = extractOutputText(data);
    if (!outputText) {
      return res.status(502).json({ error: "Translation response did not include usable text" });
    }

    return res.status(200).json(JSON.parse(outputText));
  } catch (error) {
    return res.status(500).json({
      error: "Translation is temporarily unavailable",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
