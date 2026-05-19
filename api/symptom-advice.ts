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

type SymptomAdviceRequest = {
  language?: "en" | "zh";
  freeText?: string;
  selectedSymptoms?: string[];
};

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-4.1-mini";

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

function setCors(res: ApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN ?? "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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

function extractOutputText(data: any): string {
  if (typeof data?.output_text === "string") {
    return data.output_text;
  }

  const parts: string[] = [];
  for (const item of data?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === "string") {
        parts.push(content.text);
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

  const userPayload = {
    language,
    freeText,
    selectedSymptoms,
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
              "You are MedLens, a cautious medication education assistant. Provide educational triage guidance only. Do not diagnose, prescribe, calculate personalized dosing, or claim that a medicine is safe for a specific person. Prioritize emergency red flags and advise urgent care when appropriate. Suggest OTC medication classes only when reasonable, include who should avoid them, key risks, and when to ask a clinician or pharmacist. Respond in the requested language.",
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
