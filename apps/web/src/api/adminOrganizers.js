const DEFAULT_API_V2_BASE_URL = "http://localhost:3001/api/v2";
export class AdminOrganizersApiError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.name = "AdminOrganizersApiError";
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
    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json") ? await response.json() : null;
    if (!response.ok) {
        const message = payload && typeof payload === "object" && typeof payload.message === "string"
            ? payload.message
            : `API request failed with status ${response.status}`;
        throw new AdminOrganizersApiError(message, response.status);
    }
    return payload;
}
export function listAdminOrganizers() {
    return requestJson("/admin/organizers");
}
//# sourceMappingURL=adminOrganizers.js.map