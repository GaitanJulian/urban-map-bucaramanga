import React from "react";
import type { PublicEvent } from "../types/discovery";

interface EventDetailPanelProps {
  event: PublicEvent;
  onClose: () => void;
}

function formatSchedule(startsAt: string, endsAt: string): string {
  const startDate = new Date(startsAt);
  const endDate = new Date(endsAt);
  const sameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate();

  const dayFormatter = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
  const timeFormatter = new Intl.DateTimeFormat("es-CO", {
    hour: "numeric",
    minute: "2-digit"
  });

  if (sameDay) {
    return `${dayFormatter.format(startDate)} • ${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`;
  }

  return `${dayFormatter.format(startDate)} • ${timeFormatter.format(startDate)}`;
}

function getStatusLabel(status: PublicEvent["status"]): string {
  if (status === "live") {
    return "Vigente";
  }

  if (status === "cancelled") {
    return "Cancelado";
  }

  if (status === "ended") {
    return "Finalizado";
  }

  return "Proximo";
}

export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  const approximate = event.isApproximateLocation || event.location.isApproximateLocation;

  return (
    <aside className="event-detail-panel" aria-label={`Detalle de ${event.title}`}>
      <button
        type="button"
        className="event-detail-panel__backdrop"
        onClick={onClose}
        aria-label="Cerrar detalle"
      />

      <section className="event-detail-panel__sheet" role="dialog" aria-modal="false" aria-labelledby="event-detail-title">
        <div className="event-detail-panel__header">
          <div>
            <span className="event-detail-panel__eyebrow">{event.category.name}</span>
            <h2 className="event-detail-panel__title" id="event-detail-title">
              {event.title}
            </h2>
          </div>

          <button type="button" className="event-detail-panel__close" onClick={onClose} aria-label="Cerrar detalle">
            ×
          </button>
        </div>

        <div className="event-detail-panel__hero">
          <div className="event-detail-panel__badge-stack">
            <span className="badge badge--upcoming">{getStatusLabel(event.status)}</span>
            <span className={event.isFree ? "badge badge--free" : "badge badge--cost"}>
              {event.isFree ? "Gratis" : event.costLabel}
            </span>
          </div>
        </div>

        <div className="event-detail-panel__meta">
          <span className="chip chip--zone">{event.zone.name}</span>
          {approximate ? <span className="chip chip--approximate">Ubicacion aproximada</span> : null}
        </div>

        <p className="event-detail-panel__summary">{event.summary}</p>

        <dl className="event-detail-panel__grid">
          <div className="event-detail-panel__field">
            <dt>Fecha</dt>
            <dd>{formatSchedule(event.startsAt, event.endsAt)}</dd>
          </div>
          <div className="event-detail-panel__field">
            <dt>Lugar</dt>
            <dd>{event.location.label}</dd>
          </div>
          <div className="event-detail-panel__field">
            <dt>Direccion visible</dt>
            <dd>{event.location.addressText}</dd>
          </div>
        </dl>

        <p className="event-detail-panel__footer-note">
          Este detalle usa solo el mismo payload de descubrimiento. No requiere otra llamada al backend.
        </p>
      </section>
    </aside>
  );
}
