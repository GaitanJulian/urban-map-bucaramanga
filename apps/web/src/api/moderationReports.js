const DEFAULT_API_V2_BASE_URL = "http://localhost:3001/api/v2";
export class ModerationReportApiError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.name = "ModerationReportApiError";
        this.status = status;
    }
}
function getApiV2BaseUrl() {
    const configuredV2BaseUrl = typeof import.meta !== "undefined" && typeof import.meta.env !== "undefined"
        ? import.meta.env.VITE_API_V2_BASE_URL
        : undefined;
    if (typeof configuredV2BaseUrl === "string" && configuredV2BaseUrl.trim().length > 0) {
        return configuredV2BaseUrl.replace(/\/$/, "");
    }
    const configuredV1BaseUrl = typeof import.meta !== "undefined" && typeof import.meta.env !== "undefined"
        ? import.meta.env.VITE_API_BASE_URL
        : undefined;
    if (typeof configuredV1BaseUrl === "string" && configuredV1BaseUrl.trim().length > 0) {
        return configuredV1BaseUrl.replace(/\/api\/v1\/?$/, "/api/v2").replace(/\/$/, "");
    }
    return DEFAULT_API_V2_BASE_URL;
}
async function requestJson(path, init = {}) {
    const response = await fetch(`${getApiV2BaseUrl()}${path}`, {
        ...init,
        credentials: "include",
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
    return payload;
}
async function readPayload(response) {
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
        return null;
    }
    return (await response.json());
}
function extractErrorMessage(payload) {
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
        return null;
    }
    const message = payload.message;
    if (typeof message === "string") {
        return message;
    }
    if (Array.isArray(message)) {
        return message.filter((item) => typeof item === "string").join(", ");
    }
    return null;
}
export function listModerationReports() {
    return requestJson("/moderation/reports");
}
export function getModerationReport(reportId) {
    return requestJson(`/moderation/reports/${encodeURIComponent(reportId)}`);
}
export function actOnModerationReport(reportId, action, reason) {
    return requestJson(`/moderation/reports/${encodeURIComponent(reportId)}/${action}`, {
        method: "POST",
        body: JSON.stringify({ reason })
    });
}
//# sourceMappingURL=moderationReports.js.map