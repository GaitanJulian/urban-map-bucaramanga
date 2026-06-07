import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { fetchDiscoveryEvents } from "../api/client";
import { ActiveFilterChips } from "../ui/ActiveFilterChips";
import { DiscoveryFilterBar } from "../ui/DiscoveryFilterBar";
import { DiscoveryLayout } from "../ui/DiscoveryLayout";
import { DiscoverySearchBar } from "../ui/DiscoverySearchBar";
import { DiscoveryToolbar } from "../ui/DiscoveryToolbar";
import { ViewToggle } from "../ui/ViewToggle";
const DEFAULT_FILTERS = {
    q: "",
    dateFrom: "",
    dateTo: "",
    isFree: "all",
    cost: "",
    categoryId: "",
    zoneId: "",
    useProximity: false,
    nearLat: "",
    nearLng: "",
    radiusKm: ""
};
const CATEGORY_OPTIONS = [
    { value: "cat_music", label: "Musica" },
    { value: "cat_culture", label: "Cultura" },
    { value: "cat_food", label: "Gastronomia" }
];
const ZONE_OPTIONS = [
    { value: "zone_cabecera", label: "Cabecera del Llano" },
    { value: "zone_centro", label: "Centro" }
];
function buildQuery(filters) {
    const query = {
        page: 1,
        pageSize: 20
    };
    if (filters.q.trim().length > 0) {
        query.q = filters.q.trim();
    }
    if (filters.dateFrom) {
        query.dateFrom = filters.dateFrom;
    }
    if (filters.dateTo) {
        query.dateTo = filters.dateTo;
    }
    if (filters.cost.trim().length > 0) {
        query.cost = filters.cost.trim();
    }
    if (filters.isFree === "free") {
        query.isFree = true;
    }
    else if (filters.isFree === "paid") {
        query.isFree = false;
    }
    if (filters.categoryId) {
        query.categoryId = filters.categoryId;
    }
    if (filters.zoneId) {
        query.zoneId = filters.zoneId;
    }
    if (filters.useProximity) {
        const nearLat = Number(filters.nearLat);
        const nearLng = Number(filters.nearLng);
        const radiusKm = Number(filters.radiusKm);
        if (Number.isFinite(nearLat) && Number.isFinite(nearLng) && Number.isFinite(radiusKm) && radiusKm > 0) {
            query.nearLat = nearLat;
            query.nearLng = nearLng;
            query.radiusKm = radiusKm;
        }
    }
    return query;
}
export function DiscoveryPage() {
    const [events, setEvents] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [status, setStatus] = useState("loading");
    const [errorMessage, setErrorMessage] = useState(null);
    const [view, setView] = useState("list");
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [draftSearch, setDraftSearch] = useState(DEFAULT_FILTERS.q);
    const [reloadToken, setReloadToken] = useState(0);
    const selectedEvent = useMemo(() => events.find((event) => event.id === selectedEventId) ?? null, [events, selectedEventId]);
    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setFilters((current) => (current.q === draftSearch.trim() ? current : { ...current, q: draftSearch.trim() }));
        }, 350);
        return () => window.clearTimeout(timeoutId);
    }, [draftSearch]);
    const requestQuery = useMemo(() => buildQuery(filters), [filters]);
    const requestQueryKey = useMemo(() => JSON.stringify(requestQuery), [requestQuery]);
    const categoryLabels = useMemo(() => CATEGORY_OPTIONS.reduce((accumulator, option) => {
        accumulator[option.value] = option.label;
        return accumulator;
    }, {}), []);
    const zoneLabels = useMemo(() => ZONE_OPTIONS.reduce((accumulator, option) => {
        accumulator[option.value] = option.label;
        return accumulator;
    }, {}), []);
    useEffect(() => {
        if (selectedEventId === null) {
            return;
        }
        const stillVisible = events.some((event) => event.id === selectedEventId);
        if (!stillVisible) {
            setSelectedEventId(null);
        }
    }, [events, selectedEventId]);
    const patchFilters = (patch) => {
        if (Object.prototype.hasOwnProperty.call(patch, "q")) {
            const nextQuery = typeof patch.q === "string" ? patch.q : "";
            setDraftSearch(nextQuery);
        }
        setFilters((current) => {
            const next = { ...current, ...patch };
            if (Object.prototype.hasOwnProperty.call(patch, "q")) {
                next.q = typeof patch.q === "string" ? patch.q : "";
            }
            if (Object.prototype.hasOwnProperty.call(patch, "useProximity") && patch.useProximity === false) {
                next.nearLat = "";
                next.nearLng = "";
                next.radiusKm = "";
            }
            return next;
        });
    };
    const clearAllFilters = () => {
        setFilters(DEFAULT_FILTERS);
        setDraftSearch(DEFAULT_FILTERS.q);
    };
    useEffect(() => {
        const controller = new AbortController();
        const loadEvents = async () => {
            setStatus("loading");
            setErrorMessage(null);
            try {
                const response = await fetchDiscoveryEvents(requestQuery, controller.signal);
                if (controller.signal.aborted) {
                    return;
                }
                setEvents(response.items);
                setPagination(response.pagination);
                setAppliedFilters(response.appliedFilters);
                setStatus(response.items.length === 0 ? "empty" : "success");
            }
            catch (error) {
                if (controller.signal.aborted) {
                    return;
                }
                setEvents([]);
                setPagination(null);
                setAppliedFilters(null);
                setStatus("error");
                setErrorMessage(error instanceof Error ? error.message : "No pudimos cargar los eventos.");
            }
        };
        void loadEvents();
        return () => controller.abort();
    }, [requestQueryKey, reloadToken]);
    return (_jsxs("main", { className: "discovery-shell", children: [_jsx(DiscoveryToolbar, {}), _jsxs("section", { className: "discovery-shell__controls", children: [_jsxs("div", { className: "discovery-shell__controls-row discovery-shell__controls-row--primary", children: [_jsx(DiscoverySearchBar, { value: draftSearch, onChange: setDraftSearch, onClear: () => {
                                    setDraftSearch("");
                                    patchFilters({ q: "" });
                                } }), _jsx(ViewToggle, { value: view, onChange: setView })] }), _jsx(ActiveFilterChips, { filters: filters, categoryLabels: categoryLabels, zoneLabels: zoneLabels, onPatch: patchFilters, onClearAll: clearAllFilters }), _jsx(DiscoveryFilterBar, { filters: filters, categoryOptions: CATEGORY_OPTIONS, zoneOptions: ZONE_OPTIONS, onPatch: patchFilters })] }), _jsx(DiscoveryLayout, { events: events, pagination: pagination, appliedFilters: appliedFilters, status: status, errorMessage: errorMessage, onRetry: () => setReloadToken((value) => value + 1), view: view, selectedEventId: selectedEventId, selectedEvent: selectedEvent, onSelectEvent: setSelectedEventId })] }));
}
//# sourceMappingURL=DiscoveryPage.js.map