import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DiscoveryToolbar } from "./DiscoveryToolbar";
import { EventListPanel } from "./EventListPanel";
import { EventMapPlaceholder } from "./EventMapPlaceholder";
export function DiscoveryLayout({ events, pagination, appliedFilters, status, errorMessage, onRetry }) {
    const totalVisibleEvents = pagination?.totalItems ?? events.length;
    return (_jsxs("main", { className: "discovery-shell", children: [_jsx(DiscoveryToolbar, {}), _jsxs("section", { className: "discovery-shell__content", children: [_jsx("div", { className: "discovery-shell__map", children: _jsx(EventMapPlaceholder, { eventCount: totalVisibleEvents }) }), _jsx("div", { className: "discovery-shell__list", children: _jsx(EventListPanel, { events: events, pagination: pagination, appliedFilters: appliedFilters, status: status, errorMessage: errorMessage, onRetry: onRetry }) })] })] }));
}
//# sourceMappingURL=DiscoveryLayout.js.map