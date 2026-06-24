import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function buildChips(filters, onPatch, categoryLabels, zoneLabels) {
    const chips = [];
    if (filters.q.trim().length > 0) {
        chips.push({
            key: "q",
            label: `Busca: ${filters.q.trim()}`,
            onRemove: () => onPatch({ q: "" })
        });
    }
    if (filters.dateFrom) {
        chips.push({
            key: "dateFrom",
            label: `Desde ${filters.dateFrom}`,
            onRemove: () => onPatch({ dateFrom: "" })
        });
    }
    if (filters.dateTo) {
        chips.push({
            key: "dateTo",
            label: `Hasta ${filters.dateTo}`,
            onRemove: () => onPatch({ dateTo: "" })
        });
    }
    if (filters.isFree !== "all") {
        chips.push({
            key: "isFree",
            label: filters.isFree === "free" ? "Gratis" : "De pago",
            onRemove: () => onPatch({ isFree: "all" })
        });
    }
    if (filters.cost.trim().length > 0) {
        chips.push({
            key: "cost",
            label: `Costo: ${filters.cost.trim()}`,
            onRemove: () => onPatch({ cost: "" })
        });
    }
    if (filters.categoryId.trim().length > 0) {
        chips.push({
            key: "categoryId",
            label: `Categoría: ${categoryLabels[filters.categoryId] ?? filters.categoryId}`,
            onRemove: () => onPatch({ categoryId: "" })
        });
    }
    if (filters.zoneId.trim().length > 0) {
        chips.push({
            key: "zoneId",
            label: `Zona: ${zoneLabels[filters.zoneId] ?? filters.zoneId}`,
            onRemove: () => onPatch({ zoneId: "" })
        });
    }
    if (filters.useProximity && filters.nearLat && filters.nearLng && filters.radiusKm) {
        chips.push({
            key: "proximity",
            label: `Cerca de ${filters.nearLat}, ${filters.nearLng} • ${filters.radiusKm} km`,
            onRemove: () => onPatch({ useProximity: false, nearLat: "", nearLng: "", radiusKm: "" })
        });
    }
    return chips;
}
export function ActiveFilterChips({ filters, categoryLabels, zoneLabels, onPatch, onClearAll }) {
    const chips = buildChips(filters, onPatch, categoryLabels, zoneLabels);
    if (chips.length === 0) {
        return null;
    }
    return (_jsxs("section", { className: "active-filters", "aria-label": "Filtros activos", children: [_jsx("span", { className: "active-filters__label", children: "Filtros activos:" }), _jsx("div", { className: "active-filters__chips", children: chips.map((chip) => (_jsxs("button", { type: "button", className: "active-filters__chip", onClick: chip.onRemove, children: [_jsx("span", { children: chip.label }), _jsx("span", { "aria-hidden": "true", children: "\u00D7" })] }, chip.key))) }), _jsx("button", { type: "button", className: "active-filters__clear", onClick: onClearAll, children: "Limpiar todo" })] }));
}
//# sourceMappingURL=ActiveFilterChips.js.map