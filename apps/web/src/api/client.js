const DEFAULT_API_BASE_URL = "http://localhost:3001/api/v1";
export class ApiError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}
function getApiBaseUrl() {
    const configuredBaseUrl = typeof import.meta !== "undefined" && typeof import.meta.env !== "undefined"
        ? import.meta.env.VITE_API_BASE_URL
        : undefined;
    if (typeof configuredBaseUrl === "string" && configuredBaseUrl.trim().length > 0) {
        return configuredBaseUrl.replace(/\/$/, "");
    }
    return DEFAULT_API_BASE_URL;
}
function toQueryString(query = {}) {
    const params = new URLSearchParams();
    for (const [key, rawValue] of Object.entries(query)) {
        if (rawValue === undefined || rawValue === null || rawValue === "") {
            continue;
        }
        params.set(key, String(rawValue));
    }
    const serialized = params.toString();
    return serialized.length > 0 ? `?${serialized}` : "";
}
export async function fetchDiscoveryEvents(query = {}, signal) {
    const response = await fetch(`${getApiBaseUrl()}/events${toQueryString(query)}`, {
        headers: {
            Accept: "application/json"
        },
        signal
    });
    if (!response.ok) {
        throw new ApiError(`API request failed with status ${response.status}`, response.status);
    }
    return (await response.json());
}
//# sourceMappingURL=client.js.map