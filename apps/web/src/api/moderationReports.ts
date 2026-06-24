import type { ModerationReport, ReportAction, ReportActionResponse } from "../types/moderationReports";

const DEFAULT_API_V2_BASE_URL = "http://localhost:3001/api/v2";

export class ModerationReportApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ModerationReportApiError";
    this.status = status;
  }
}

function getApiV2BaseUrl(): string {
  const configuredV2BaseUrl =
    typeof import.meta !== "undefined" && typeof import.meta.env !== "undefined"
      ? import.meta.env.VITE_API_V2_BASE_URL
      : undefined;

  if (typeof configuredV2BaseUrl === "string" && configuredV2BaseUrl.trim().length > 0) {
    return configuredV2BaseUrl.replace(/\/$/, "");
  }

  const configuredV1BaseUrl =
    typeof import.meta !== "undefined" && typeof import.meta.env !== "undefined"
      ? import.meta.env.VITE_API_BASE_URL
      : undefined;

  if (typeof configuredV1BaseUrl === "string" && configuredV1BaseUrl.trim().length > 0) {
    return configuredV1BaseUrl.replace(/\/api\/v1\/?$/, "/api/v2").replace(/\/$/, "");
  }

  return DEFAULT_API_V2_BASE_URL;
}

async function requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getApiV2BaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers
    }
  });

  const payload = await readPayload(response);

  if (!response.ok) {
    const message = extractErrorMessage(payload) ?? `API request failed with status ${response.status}`;
    throw new ModerationReportApiError(message, response.status);
  }

  return payload as T;
}

async function readPayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return (await response.json()) as unknown;
}

function extractErrorMessage(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return null;
  }

  const message = (payload as Record<string, unknown>).message;
  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    return message.filter((item): item is string => typeof item === "string").join(", ");
  }

  return null;
}

export function listModerationReports(): Promise<ModerationReport[]> {
  return requestJson<ModerationReport[]>("/moderation/reports");
}

export function getModerationReport(reportId: string): Promise<ModerationReport> {
  return requestJson<ModerationReport>(`/moderation/reports/${encodeURIComponent(reportId)}`);
}

export function actOnModerationReport(reportId: string, action: ReportAction, reason: string): Promise<ReportActionResponse> {
  return requestJson<ReportActionResponse>(`/moderation/reports/${encodeURIComponent(reportId)}/${action}`, {
    method: "POST",
    body: JSON.stringify({ reason })
  });
}
