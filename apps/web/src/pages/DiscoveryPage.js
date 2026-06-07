import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchDiscoveryEvents } from "../api/client";
import { DiscoveryLayout } from "../ui/DiscoveryLayout";
export function DiscoveryPage() {
    const [events, setEvents] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [status, setStatus] = useState("loading");
    const [errorMessage, setErrorMessage] = useState(null);
    const [reloadToken, setReloadToken] = useState(0);
    useEffect(() => {
        const controller = new AbortController();
        const loadEvents = async () => {
            setStatus("loading");
            setErrorMessage(null);
            try {
                const response = await fetchDiscoveryEvents({}, controller.signal);
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
    }, [reloadToken]);
    return (_jsx(DiscoveryLayout, { events: events, pagination: pagination, appliedFilters: appliedFilters, status: status, errorMessage: errorMessage, onRetry: () => setReloadToken((value) => value + 1) }));
}
//# sourceMappingURL=DiscoveryPage.js.map