type ApiRequest = {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  end: () => void;
};

const RXNORM_BASE = "https://rxnav.nlm.nih.gov/REST";
const SUPPORTED_TTYS = new Set(["SBD", "SBN", "SCD", "GPCK", "IN", "MIN", "BN"]);

function setCors(res: ApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN ?? "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const query = first(req.query?.q)?.trim() ?? "";
  if (query.length < 2) {
    return res.status(400).json({ error: "Search query must be at least 2 characters" });
  }

  const response = await fetch(`${RXNORM_BASE}/drugs.json?name=${encodeURIComponent(query)}`);
  if (!response.ok) {
    return res.status(response.status).json({ error: "RxNorm search failed" });
  }

  const json = await response.json();
  const concepts = json?.drugGroup?.conceptGroup ?? [];
  const results: Array<{ rxcui: string; name: string; tty: string; source: "RxNorm" }> = [];

  for (const group of concepts) {
    for (const concept of group?.conceptProperties ?? []) {
      if (SUPPORTED_TTYS.has(concept?.tty)) {
        results.push({
          rxcui: concept.rxcui,
          name: concept.name,
          tty: concept.tty,
          source: "RxNorm",
        });
      }
    }
  }

  const seen = new Set<string>();
  const deduped = results.filter((result) => {
    if (seen.has(result.rxcui)) return false;
    seen.add(result.rxcui);
    return true;
  }).slice(0, 20);

  return res.status(200).json({
    query,
    source: "RxNorm",
    results: deduped,
  });
}
