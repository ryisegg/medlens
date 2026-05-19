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

type DoseStatus = "upcoming" | "taken" | "missed" | "skipped";

type MedicationSchedule = {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  linkedCabinetItemId?: string;
};

type DoseLog = {
  id: string;
  scheduleId: string;
  date: string;
  time: string;
  status: DoseStatus;
};

type CabinetItem = {
  id: string;
  medicationName: string;
  genericName?: string;
  strength?: string;
  quantity: number;
  dosageForm?: string;
  expirationDate?: string;
  type: "OTC" | "Prescription";
  storageLocation?: string;
  notes?: string;
};

type MedicationManagementPayload = {
  schedules?: MedicationSchedule[];
  doseLogs?: DoseLog[];
  cabinetItems?: CabinetItem[];
};

const DOSE_STATUSES = new Set<DoseStatus>(["upcoming", "taken", "missed", "skipped"]);
const CABINET_TYPES = new Set(["OTC", "Prescription"]);

function setCors(res: ApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN ?? "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function normalizeBody(body: unknown): MedicationManagementPayload {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as MedicationManagementPayload;
    } catch {
      return {};
    }
  }

  if (body && typeof body === "object") {
    return body as MedicationManagementPayload;
  }

  return {};
}

function isIsoDate(value: unknown) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isTime(value: unknown) {
  return typeof value === "string" && /^\d{2}:\d{2}$/.test(value);
}

function validateSchedule(item: MedicationSchedule, index: number) {
  const errors: string[] = [];
  if (!item || typeof item !== "object") return [`schedules[${index}] must be an object`];
  if (!item.id) errors.push(`schedules[${index}].id is required`);
  if (!item.medicationName) errors.push(`schedules[${index}].medicationName is required`);
  if (!item.frequency) errors.push(`schedules[${index}].frequency is required`);
  if (!Array.isArray(item.times) || item.times.length === 0 || item.times.some((time) => !isTime(time))) {
    errors.push(`schedules[${index}].times must contain HH:mm values`);
  }
  if (!isIsoDate(item.startDate)) errors.push(`schedules[${index}].startDate must be YYYY-MM-DD`);
  if (item.endDate && !isIsoDate(item.endDate)) errors.push(`schedules[${index}].endDate must be YYYY-MM-DD`);
  return errors;
}

function validateDoseLog(item: DoseLog, index: number) {
  const errors: string[] = [];
  if (!item || typeof item !== "object") return [`doseLogs[${index}] must be an object`];
  if (!item.id) errors.push(`doseLogs[${index}].id is required`);
  if (!item.scheduleId) errors.push(`doseLogs[${index}].scheduleId is required`);
  if (!isIsoDate(item.date)) errors.push(`doseLogs[${index}].date must be YYYY-MM-DD`);
  if (!isTime(item.time)) errors.push(`doseLogs[${index}].time must be HH:mm`);
  if (!DOSE_STATUSES.has(item.status)) errors.push(`doseLogs[${index}].status is invalid`);
  return errors;
}

function validateCabinetItem(item: CabinetItem, index: number) {
  const errors: string[] = [];
  if (!item || typeof item !== "object") return [`cabinetItems[${index}] must be an object`];
  if (!item.id) errors.push(`cabinetItems[${index}].id is required`);
  if (!item.medicationName) errors.push(`cabinetItems[${index}].medicationName is required`);
  if (typeof item.quantity !== "number" || item.quantity < 0) errors.push(`cabinetItems[${index}].quantity must be a non-negative number`);
  if (!CABINET_TYPES.has(item.type)) errors.push(`cabinetItems[${index}].type must be OTC or Prescription`);
  if (item.expirationDate && !isIsoDate(item.expirationDate)) errors.push(`cabinetItems[${index}].expirationDate must be YYYY-MM-DD`);
  return errors;
}

export default function handler(req: ApiRequest, res: ApiResponse) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = normalizeBody(req.body);
  const schedules = Array.isArray(body.schedules) ? body.schedules : [];
  const doseLogs = Array.isArray(body.doseLogs) ? body.doseLogs : [];
  const cabinetItems = Array.isArray(body.cabinetItems) ? body.cabinetItems : [];

  const errors = [
    ...schedules.flatMap(validateSchedule),
    ...doseLogs.flatMap(validateDoseLog),
    ...cabinetItems.flatMap(validateCabinetItem),
  ];

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Invalid medication management payload",
      errors,
    });
  }

  return res.status(200).json({
    ok: true,
    mode: "contract-only",
    message: "Payload validated. Persistent cloud sync is ready to be connected to a database provider.",
    received: {
      schedules: schedules.length,
      doseLogs: doseLogs.length,
      cabinetItems: cabinetItems.length,
    },
    nextBackendStep: "Connect this contract to Supabase, Neon Postgres, or another persistent database.",
  });
}
