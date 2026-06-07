import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EventListPanel } from "./EventListPanel";
import { EventMapPlaceholder } from "./EventMapPlaceholder";
export function DiscoveryLayout({ events, pagination, appliedFilters, status, errorMessage, onRetry, view }) {
    const totalVisibleEvents = pagination?.totalItems ?? events.length;
    const stateClass = `is-${status}`;
    return (_jsxs("section", { className: view === "map"
            ? `discovery-shell__content is-map-active ${stateClass}`
            : `discovery-shell__content is-list-active ${stateClass}`, children: [_jsx("div", { className: "discovery-shell__map", children: _jsx(EventMapPlaceholder, { eventCount: totalVisibleEvents }) }), _jsx("div", { className: "discovery-shell__list", children: _jsx(EventListPanel, { events: events, pagination: pagination, appliedFilters: appliedFilters, status: status, errorMessage: errorMessage, onRetry: onRetry }) })] }));
}
//# sourceMappingURL=DiscoveryLayout.js.map