const DEFAULT_API_V2_BASE_URL = "http://localhost:3001/api/v2";
export class OrganizerDraftApiError extends Error {
    status;
    issues;
    constructor(message, status, issues = []) {
        super(message);
        this.name = "OrganizerDraftApiError";
        this.status = status;
        this.issues = issues;
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
        headers: {
            Accept: "application/json",
            ...(init.body ? { "Content-Type": "application/json" } : {}),
            ...init.headers
        }
    });
    const payload = await readPayload(response);
    if (!response.ok) {
        const message = extractErrorMessage(payload) ?? `API request failed with status ${response.status}`;
        const issues = extractIssues(payload);
        throw new OrganizerDraftApiError(message, response.status, issues);
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
    const record = payload;
    const message = record.message;
    if (typeof message === "string") {
        return message;
    }
    if (Array.isArray(message)) {
        return message.filter((item) => typeof item === "string").join(", ");
    }
    return null;
}
function extractIssues(payload) {
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
        return [];
    }
    const record = payload;
    const issues = record.issues;
    if (!Array.isArray(issues)) {
        return [];
    }
    return issues.filter((issue) => typeof issue === "string");
}
export function listOrganizerDrafts() {
    return requestJson("/organizer/drafts");
}
export function createOrganizerDraft(input) {
    return requestJson("/organizer/drafts", {
        method: "POST",
        body: JSON.stringify(toDraftPayload(input))
    });
}
export function updateOrganizerDraft(draftId, input) {
    return requestJson(`/organizer/drafts/${encodeURIComponent(draftId)}`, {
        method: "PATCH",
        body: JSON.stringify(toDraftPayload(input))
    });
}
export function saveOrganizerDraft(draftId) {
    return requestJson(`/organizer/drafts/${encodeURIComponent(draftId)}/save`, {
        method: "POST"
    });
}
export function validateOrganizerDraft(draftId) {
    return requestJson(`/organizer/drafts/${encodeURIComponent(draftId)}/validate`, {
        method: "POST"
    });
}
export function submitOrganizerDraft(draftId) {
    return requestJson(`/organizer/drafts/${encodeURIComponent(draftId)}/submit`, {
        method: "POST"
    });
}
function toDraftPayload(input) {
    return {
        ...input,
        startsAt: toIsoDateTime(input.startsAt),
        endsAt: toIsoDateTime(input.endsAt)
    };
}
function toIsoDateTime(value) {
    if (value === undefined || value.trim().length === 0) {
        return value;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toISOString();
}
//# sourceMappingURL=organizerDrafts.js.map