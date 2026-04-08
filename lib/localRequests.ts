import {
  REQUEST_CATEGORIES,
  type HelpRequest,
  type RequestCategory,
  type RequestUrgency,
} from "@/data/helpRequests";

export const LOCAL_REQUESTS_STORAGE_KEY = "gather-local-help-requests";

export type LocalHelpRequestInput = {
  title: string;
  category: RequestCategory;
  neighborhood: string;
  urgency: RequestUrgency;
  description: string;
  timing: string;
  helperNote: string;
  distance?: string;
  boroughArea?: HelpRequest["boroughArea"];
  authorName?: string;
};

export type LocalHelpRequest = HelpRequest & {
  isLocal: true;
  createdAt: string;
};

function isKnownCategory(value: string): value is RequestCategory {
  return REQUEST_CATEGORIES.includes(value as RequestCategory);
}

function isKnownUrgency(value: string): value is RequestUrgency {
  return value === "Urgent" || value === "New" || value === "Open";
}

function normalizeBoroughArea(neighborhood: string): HelpRequest["boroughArea"] {
  const normalized = neighborhood.toLowerCase();

  if (normalized.includes("queens")) return "Queens";
  if (normalized.includes("bronx")) return "Bronx";
  if (normalized.includes("staten")) return "Staten Island";
  if (normalized.includes("manhattan") || normalized.includes("inwood") || normalized.includes("harlem")) {
    return "Manhattan";
  }

  return "Brooklyn";
}

function sanitizeStoredRequest(raw: unknown): LocalHelpRequest | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const value = raw as Partial<LocalHelpRequest>;

  if (
    typeof value.id !== "string" ||
    typeof value.authorName !== "string" ||
    typeof value.title !== "string" ||
    typeof value.description !== "string" ||
    typeof value.neighborhood !== "string" ||
    typeof value.timing !== "string" ||
    typeof value.distance !== "string" ||
    typeof value.helperNote !== "string" ||
    typeof value.createdAt !== "string"
  ) {
    return null;
  }

  if (!value.category || !isKnownCategory(value.category)) {
    return null;
  }

  if (!value.urgency || !isKnownUrgency(value.urgency)) {
    return null;
  }

  const boroughArea = value.boroughArea || normalizeBoroughArea(value.neighborhood);

  if (
    boroughArea !== "Brooklyn" &&
    boroughArea !== "Queens" &&
    boroughArea !== "Manhattan" &&
    boroughArea !== "Bronx" &&
    boroughArea !== "Staten Island"
  ) {
    return null;
  }

  return {
    id: value.id,
    authorName: value.authorName,
    boroughArea,
    category: value.category,
    title: value.title,
    description: value.description,
    neighborhood: value.neighborhood,
    timing: value.timing,
    urgency: value.urgency,
    distance: value.distance,
    helperNote: value.helperNote,
    createdAt: value.createdAt,
    isLocal: true,
  };
}

export function loadLocalRequests(): LocalHelpRequest[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(LOCAL_REQUESTS_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry) => sanitizeStoredRequest(entry))
      .filter((entry): entry is LocalHelpRequest => entry !== null)
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  } catch {
    return [];
  }
}

export function saveLocalRequests(requests: LocalHelpRequest[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
}

export function addLocalRequest(input: LocalHelpRequestInput): LocalHelpRequest {
  const next: LocalHelpRequest = {
    id: `local-${Date.now()}`,
    authorName: input.authorName || "You",
    boroughArea: input.boroughArea || normalizeBoroughArea(input.neighborhood),
    category: input.category,
    title: input.title,
    description: input.description,
    neighborhood: input.neighborhood,
    timing: input.timing,
    urgency: input.urgency,
    distance: input.distance || "0.2 mi away",
    helperNote: input.helperNote,
    createdAt: new Date().toISOString(),
    isLocal: true,
  };

  const existing = loadLocalRequests();
  saveLocalRequests([next, ...existing]);

  return next;
}
