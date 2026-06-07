import React, { useEffect, useMemo } from "react";
import { divIcon, type DivIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { DiscoveryStatus, PublicEvent } from "../types/discovery";

interface DiscoveryMapPanelProps {
  events: PublicEvent[];
  eventCount: number;
  status: DiscoveryStatus;
  isVisible: boolean;
  selectedEventId: string | null;
  onSelectEvent: (eventId: string | null) => void;
}

const BUCARAMANGA_CENTER: [number, number] = [7.1193, -73.1227];
const BUCARAMANGA_ZOOM = 13.2;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getMarkerAccent(categoryId: string): string {
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

function formatMarkerLabel(event: PublicEvent): string {
  const title = event.category.name.trim();
  return escapeHtml(title.slice(0, 1).toUpperCase() || "•");
}

function buildMarkerIcon(event: PublicEvent, isSelected: boolean): DivIcon {
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

function MapSynchronizer({
  events,
  selectedEventId,
  isVisible
}: Pick<DiscoveryMapPanelProps, "events" | "selectedEventId" | "isVisible">) {
  const map = useMap();

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId]
  );

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

export function DiscoveryMapPanel({
  events,
  eventCount,
  status,
  isVisible,
  selectedEventId,
  onSelectEvent
}: DiscoveryMapPanelProps) {
  const visibleEvents = events.filter(
    (event) => Number.isFinite(event.location.latitude) && Number.isFinite(event.location.longitude)
  );

  return (
    <section className="map-panel discovery-map-panel" aria-label="Mapa de eventos de Bucaramanga">
      <div className="map-panel__surface discovery-map-panel__surface">
        <MapContainer
          center={BUCARAMANGA_CENTER}
          zoom={BUCARAMANGA_ZOOM}
          zoomControl
          preferCanvas
          scrollWheelZoom={false}
          className="discovery-map-panel__map"
        >
          <MapSynchronizer events={events} selectedEventId={selectedEventId} isVisible={isVisible} />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains={["a", "b", "c", "d"]}
            maxZoom={20}
          />

          {visibleEvents.map((event) => {
            const isSelected = event.id === selectedEventId;

            return (
              <Marker
                key={event.id}
                position={[event.location.latitude, event.location.longitude]}
                icon={buildMarkerIcon(event, isSelected)}
                eventHandlers={{
                  click: () => onSelectEvent(event.id)
                }}
              >
                {isSelected ? (
                  <Popup closeButton={false} autoPan={false} className="discovery-map-popup">
                    <div className="discovery-map-popup__content">
                      <strong>{event.title}</strong>
                      <span>{event.location.label}</span>
                      <span>{event.zone.name}</span>
                      {event.isApproximateLocation || event.location.isApproximateLocation ? (
                        <span>Ubicacion aproximada</span>
                      ) : null}
                    </div>
                  </Popup>
                ) : null}
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="map-panel__footer">
        <div>
          <p className="map-panel__title">Mapa de Bucaramanga</p>
          <p className="map-panel__subtitle">
            {status === "loading" ? "Actualizando eventos visibles..." : `${eventCount} eventos visibles en este universo`}
          </p>
        </div>
        <span className="map-panel__subtitle" aria-hidden="true">
          Bucaramanga
        </span>
      </div>
    </section>
  );
}
