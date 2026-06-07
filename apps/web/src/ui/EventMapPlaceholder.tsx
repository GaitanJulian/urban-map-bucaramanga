import React from "react";

interface EventMapPlaceholderProps {
  eventCount: number;
}

export function EventMapPlaceholder({ eventCount }: EventMapPlaceholderProps) {
  return (
    <section className="map-panel" aria-label="Mapa de eventos de Bucaramanga">
      <div className="map-panel__surface" aria-hidden="true">
        <div className="map-panel__road map-panel__road--one" />
        <div className="map-panel__road map-panel__road--two" />
        <div className="map-panel__road map-panel__road--three" />
        <div className="map-panel__marker map-panel__marker--active">
          <span>♪</span>
        </div>
        <div className="map-panel__marker map-panel__marker--secondary">
          <span>⌂</span>
        </div>
        <div className="map-panel__marker map-panel__marker--approximate">
          <span>☰</span>
        </div>
      </div>

      <div className="map-panel__footer">
        <p className="map-panel__title">Mapa de Bucaramanga</p>
        <p className="map-panel__subtitle">{eventCount} eventos visibles en este universo</p>
      </div>
    </section>
  );
}

