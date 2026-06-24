import { jsx as _jsx } from "react/jsx-runtime";
const TONE_BY_STATUS = {
    approved: "success",
    resolved: "success",
    published: "success",
    live: "success",
    draft: "neutral",
    incomplete: "neutral",
    open: "info",
    ready_for_review: "info",
    pending: "info",
    submitted: "info",
    in_review: "info",
    triaged: "warning",
    changes_requested: "warning",
    needs_correction: "warning",
    waiting_correction: "warning",
    escalated: "warning",
    rejected: "danger",
    hidden: "danger",
    dismissed: "danger",
    cancelled: "danger",
    high: "warning",
    normal: "neutral",
    low: "neutral"
};
function resolveTone(value) {
    if (!value) {
        return "neutral";
    }
    return TONE_BY_STATUS[value] ?? "neutral";
}
function formatLabel(value, fallback) {
    if (!value) {
        return fallback;
    }
    return value.replace(/_/g, " ");
}
export function StatusBadge({ value, fallback = "Sin estado", tone }) {
    const resolvedTone = tone ?? resolveTone(value);
    return _jsx("span", { className: `status-badge status-badge--${resolvedTone}`, children: formatLabel(value, fallback) });
}
//# sourceMappingURL=StatusBadge.js.map