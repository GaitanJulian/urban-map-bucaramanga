import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { EventCard } from "./EventCard";
import { LoadingState } from "./LoadingState";
import { ResultSummary } from "./ResultSummary";
export function EventListPanel({ events, pagination, appliedFilters, status, errorMessage, onRetry }) {
    if (status === "loading") {
        return _jsx(LoadingState, {});
    }
    if (status === "error") {
        return (_jsx("div", { className: "event-list-panel", children: _jsx(ErrorState, { message: errorMessage ?? "Hubo un problema de conexión con el servidor.", onRetry: onRetry }) }));
    }
    if (status === "empty") {
        return (_jsxs("div", { className: "event-list-panel", children: [_jsx(ResultSummary, { totalItems: pagination?.totalItems ?? 0 }), _jsx(EmptyState, {})] }));
    }
    return (_jsxs("section", { className: "event-list-panel", "aria-label": "Resultados de eventos", children: [_jsx(ResultSummary, { totalItems: pagination?.totalItems ?? events.length }), appliedFilters ? (_jsxs("div", { className: "event-list-panel__context", "aria-hidden": "true", children: [_jsx("span", { className: "event-list-panel__context-label", children: appliedFilters.scope }), _jsx("span", { className: "event-list-panel__context-pill", children: appliedFilters.visibilityState })] })) : null, _jsx("div", { className: "event-list-panel__items", children: events.map((event) => (_jsx(EventCard, { event: event }, event.id))) })] }));
}
//# sourceMappingURL=EventListPanel.js.map