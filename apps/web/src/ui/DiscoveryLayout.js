import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EventListPanel } from "./EventListPanel";
import { DiscoveryMapPanel } from "./DiscoveryMapPanel";
import { EventDetailPanel } from "./EventDetailPanel";
export function DiscoveryLayout({ events, pagination, appliedFilters, status, errorMessage, onRetry, view, selectedEventId, selectedEvent, onSelectEvent }) {
    const totalVisibleEvents = pagination?.totalItems ?? events.length;
    const stateClass = `is-${status}`;
    const isMapVisible = status !== "success" || view === "map";
    return (_jsxs("section", { className: view === "map"
            ? `discovery-shell__content is-map-active ${stateClass}`
            : `discovery-shell__content is-list-active ${stateClass}`, children: [_jsx("div", { className: "discovery-shell__map", children: _jsx(DiscoveryMapPanel, { events: events, eventCount: totalVisibleEvents, status: status, isVisible: isMapVisible, selectedEventId: selectedEventId, onSelectEvent: onSelectEvent }) }), _jsx("div", { className: "discovery-shell__list", children: _jsx(EventListPanel, { events: events, pagination: pagination, appliedFilters: appliedFilters, status: status, errorMessage: errorMessage, onRetry: onRetry, selectedEventId: selectedEventId, onSelectEvent: onSelectEvent }) }), selectedEvent ? (_jsx(EventDetailPanel, { event: selectedEvent, onClose: () => onSelectEvent(null) })) : null] }));
}
//# sourceMappingURL=DiscoveryLayout.js.map