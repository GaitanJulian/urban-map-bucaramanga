import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function formatSchedule(startsAt, endsAt) {
    const startDate = new Date(startsAt);
    const endDate = new Date(endsAt);
    const sameDay = startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate();
    const dayFormatter = new Intl.DateTimeFormat("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
    const timeFormatter = new Intl.DateTimeFormat("es-CO", {
        hour: "numeric",
        minute: "2-digit"
    });
    if (sameDay) {
        return `${dayFormatter.format(startDate)} • ${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`;
    }
    return `${dayFormatter.format(startDate)} • ${timeFormatter.format(startDate)}`;
}
function getAccent(categoryId) {
    const normalized = categoryId.toLowerCase();
    if (normalized.includes("music") || normalized.includes("mus")) {
        return "linear-gradient(135deg, #ff5a1f 0%, #ff8a52 100%)";
    }
    if (normalized.includes("gastr") || normalized.includes("food")) {
        return "linear-gradient(135deg, #b85e00 0%, #ffb347 100%)";
    }
    if (normalized.includes("art") || normalized.includes("culture") || normalized.includes("theater")) {
        return "linear-gradient(135deg, #004493 0%, #5ea1ff 100%)";
    }
    return "linear-gradient(135deg, #5b4038 0%, #ae3200 100%)";
}
function getStatusLabel(status) {
    return status === "live" ? "Vigente" : "Proximo";
}
function getStatusClass(status) {
    return status === "live" ? "badge badge--live" : "badge badge--upcoming";
}
export function EventCard({ event }) {
    const accent = getAccent(event.category.id);
    const approximate = event.isApproximateLocation || event.location.isApproximateLocation;
    return (_jsxs("article", { className: "event-card", "aria-label": event.title, children: [_jsxs("div", { className: "event-card__media", style: { "--card-accent": accent }, children: [_jsx("div", { className: "event-card__media-overlay" }), _jsx("div", { className: "event-card__media-icon", "aria-hidden": "true", children: event.category.name.slice(0, 1).toUpperCase() }), _jsxs("div", { className: "event-card__badge-stack", children: [_jsx("span", { className: getStatusClass(event.status), children: getStatusLabel(event.status) }), _jsx("span", { className: event.isFree ? "badge badge--free" : "badge badge--cost", children: event.isFree ? "Gratis" : event.costLabel })] })] }), _jsxs("div", { className: "event-card__body", children: [_jsxs("div", { className: "event-card__header", children: [_jsx("h3", { className: "event-card__title", children: event.title }), _jsx("span", { className: "event-card__category", children: event.category.name })] }), _jsx("p", { className: "event-card__summary", children: event.summary }), _jsxs("div", { className: "event-card__meta", children: [_jsxs("div", { className: "event-card__meta-row", children: [_jsx("span", { className: "event-card__meta-label", children: "Fecha" }), _jsx("span", { className: "event-card__meta-value", children: formatSchedule(event.startsAt, event.endsAt) })] }), _jsxs("div", { className: "event-card__meta-row", children: [_jsx("span", { className: "event-card__meta-label", children: "Lugar" }), _jsx("span", { className: "event-card__meta-value", children: event.location.label })] })] }), _jsxs("div", { className: "event-card__footer", children: [_jsx("span", { className: "chip chip--zone", children: event.zone.name }), approximate ? _jsx("span", { className: "chip chip--approximate", children: "Ubicacion aproximada" }) : null] })] })] }));
}
//# sourceMappingURL=EventCard.js.map