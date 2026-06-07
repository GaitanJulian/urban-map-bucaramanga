import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo } from "react";
import { divIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
const BUCARAMANGA_CENTER = [7.1193, -73.1227];
const BUCARAMANGA_ZOOM = 13.2;
function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
function getMarkerAccent(categoryId) {
    const normalized = categoryId.toLowerCase();
    if (normalized.includes("music") || normalized.includes("mus")) {
        return "#ff5a1f";
    }
    if (normalized.includes("gastr") || normalized.includes("food")) {
        return "#b85e00";
    }
    if (normalized.includes("art") || normalized.includes("culture") || normalized.includes("theater")) {
        return "#1a73e8";
    }
    return "#7b5d50";
}
function formatMarkerLabel(event) {
    const title = event.category.name.trim();
    return escapeHtml(title.slice(0, 1).toUpperCase() || "•");
}
function buildMarkerIcon(event, isSelected) {
    const accent = getMarkerAccent(event.category.id);
    const isApproximate = event.isApproximateLocation || event.location.isApproximateLocation;
    const markerClass = [
        "discovery-map-marker",
        isApproximate ? "is-approximate" : "is-exact",
        isSelected ? "is-selected" : ""
    ]
        .filter(Boolean)
        .join(" ");
    return divIcon({
        className: "discovery-map-marker-wrapper",
        html: `
      <span class="${markerClass}" style="--marker-accent: ${accent}">
        <span class="discovery-map-marker__halo" aria-hidden="true"></span>
        <span class="discovery-map-marker__core" aria-hidden="true">${formatMarkerLabel(event)}</span>
      </span>
    `,
        iconSize: [44, 58],
        iconAnchor: [22, 54],
        popupAnchor: [0, -48]
    });
}
function MapSynchronizer({ events, selectedEventId, isVisible }) {
    const map = useMap();
    const selectedEvent = useMemo(() => events.find((event) => event.id === selectedEventId) ?? null, [events, selectedEventId]);
    useEffect(() => {
        if (!isVisible) {
            return;
        }
        const timeoutId = window.setTimeout(() => {
            map.invalidateSize();
        }, 0);
        return () => window.clearTimeout(timeoutId);
    }, [isVisible, map]);
    useEffect(() => {
        if (!isVisible || !selectedEvent) {
            return;
        }
        map.flyTo([selectedEvent.location.latitude, selectedEvent.location.longitude], Math.max(map.getZoom(), 15), {
            animate: true,
            duration: 0.45
        });
    }, [isVisible, map, selectedEvent]);
    return null;
}
export function DiscoveryMapPanel({ events, eventCount, status, isVisible, selectedEventId, onSelectEvent }) {
    const visibleEvents = events.filter((event) => Number.isFinite(event.location.latitude) && Number.isFinite(event.location.longitude));
    return (_jsxs("section", { className: "map-panel discovery-map-panel", "aria-label": "Mapa de eventos de Bucaramanga", children: [_jsx("div", { className: "map-panel__surface discovery-map-panel__surface", children: _jsxs(MapContainer, { center: BUCARAMANGA_CENTER, zoom: BUCARAMANGA_ZOOM, zoomControl: true, preferCanvas: true, scrollWheelZoom: false, className: "discovery-map-panel__map", children: [_jsx(MapSynchronizer, { events: events, selectedEventId: selectedEventId, isVisible: isVisible }), _jsx(TileLayer, { attribution: "\u00A9 OpenStreetMap contributors \u00A9 CARTO", url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", subdomains: ["a", "b", "c", "d"], maxZoom: 20 }), visibleEvents.map((event) => {
                            const isSelected = event.id === selectedEventId;
                            return (_jsx(Marker, { position: [event.location.latitude, event.location.longitude], icon: buildMarkerIcon(event, isSelected), eventHandlers: {
                                    click: () => onSelectEvent(event.id)
                                }, children: isSelected ? (_jsx(Popup, { closeButton: false, autoPan: false, className: "discovery-map-popup", children: _jsxs("div", { className: "discovery-map-popup__content", children: [_jsx("strong", { children: event.title }), _jsx("span", { children: event.location.label }), _jsx("span", { children: event.zone.name }), event.isApproximateLocation || event.location.isApproximateLocation ? (_jsx("span", { children: "Ubicacion aproximada" })) : null] }) })) : null }, event.id));
                        })] }) }), _jsxs("div", { className: "map-panel__footer", children: [_jsxs("div", { children: [_jsx("p", { className: "map-panel__title", children: "Mapa de Bucaramanga" }), _jsx("p", { className: "map-panel__subtitle", children: status === "loading" ? "Actualizando eventos visibles..." : `${eventCount} eventos visibles en este universo` })] }), _jsx("span", { className: "map-panel__subtitle", "aria-hidden": "true", children: "Bucaramanga" })] })] }));
}
//# sourceMappingURL=DiscoveryMapPanel.js.map