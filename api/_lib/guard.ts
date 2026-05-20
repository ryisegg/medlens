type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  end: () => void;
};

type ApiRequest = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
};

const buckets = new Map<string, { count: number; resetAt: number }>();

function firstHeader(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function getClientIp(req: ApiRequest): string {
  const forwarded = firstHeader(req.headers?.["x-forwarded-for"]);
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return firstHeader(req.headers?.["x-real-ip"]) || "unknown";
}

export function setCors(res: ApiResponse): void {
  const origin = process.env.ALLOWED_ORIGIN?.trim();
  res.setHeader("Access-Control-Allow-Origin", origin || "https://ryisegg.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
}

export function checkRateLimit(
  ip: string,
  max = Number(process.env.API_RATE_LIMIT_MAX ?? 30),
  windowMs = Number(process.env.API_RATE_LIMIT_WINDOW_MS ?? 60_000),
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  let bucket = buckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(ip, bucket);
  }
  bucket.count += 1;
  const allowed = bucket.count <= max;
  const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  return { allowed, retryAfterSec };
}

export function enforceRateLimit(req: ApiRequest, res: ApiResponse): boolean {
  const ip = getClientIp(req);
  const { allowed, retryAfterSec } = checkRateLimit(ip);
  if (!allowed) {
    res.setHeader("Retry-After", String(retryAfterSec));
    res.status(429).json({
      error: "Too many requests. Please try again later.",
      retryAfterSec,
    });
    return false;
  }
  return true;
}
