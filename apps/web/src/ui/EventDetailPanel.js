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
function getStatusLabel(status) {
    if (status === "live") {
        return "Vigente";
    }
    if (status === "cancelled") {
        return "Cancelado";
    }
    if (status === "ended") {
        return "Finalizado";
    }
    return "Proximo";
}
export function EventDetailPanel({ event, onClose }) {
    const approximate = event.isApproximateLocation || event.location.isApproximateLocation;
    return (_jsxs("aside", { className: "event-detail-panel", "aria-label": `Detalle de ${event.title}`, children: [_jsx("div", { className: "event-detail-panel__backdrop", onClick: onClose, "aria-hidden": "true" }), _jsxs("section", { className: "event-detail-panel__sheet", role: "dialog", "aria-modal": "false", children: [_jsxs("div", { className: "event-detail-panel__header", children: [_jsxs("div", { children: [_jsx("span", { className: "event-detail-panel__eyebrow", children: event.category.name }), _jsx("h2", { className: "event-detail-panel__title", children: event.title })] }), _jsx("button", { type: "button", className: "event-detail-panel__close", onClick: onClose, "aria-label": "Cerrar detalle", children: "\u00D7" })] }), _jsxs("div", { className: "event-detail-panel__meta", children: [_jsx("span", { className: "badge badge--upcoming", children: getStatusLabel(event.status) }), _jsx("span", { className: event.isFree ? "badge badge--free" : "badge badge--cost", children: event.isFree ? "Gratis" : event.costLabel }), _jsx("span", { className: "chip chip--zone", children: event.zone.name })] }), _jsx("p", { className: "event-detail-panel__summary", children: event.summary }), _jsxs("dl", { className: "event-detail-panel__grid", children: [_jsxs("div", { className: "event-detail-panel__field", children: [_jsx("dt", { children: "Fecha" }), _jsx("dd", { children: formatSchedule(event.startsAt, event.endsAt) })] }), _jsxs("div", { className: "event-detail-panel__field", children: [_jsx("dt", { children: "Lugar" }), _jsx("dd", { children: event.location.label })] }), _jsxs("div", { className: "event-detail-panel__field", children: [_jsx("dt", { children: "Direccion visible" }), _jsx("dd", { children: event.location.addressText })] }), _jsxs("div", { className: "event-detail-panel__field", children: [_jsx("dt", { children: "Ubicacion" }), _jsxs("dd", { children: [event.location.latitude.toFixed(4), ", ", event.location.longitude.toFixed(4)] })] })] }), approximate ? _jsx("p", { className: "event-detail-panel__note", children: "Ubicacion aproximada se\u00F1alizada en el mapa." }) : null, _jsx("p", { className: "event-detail-panel__footer-note", children: "Este detalle usa solo el mismo payload de descubrimiento. No requiere otra llamada al backend." })] })] }));
}
//# sourceMappingURL=EventDetailPanel.js.map