import React, { type CSSProperties } from "react";
import type { PublicEvent } from "../types/discovery";

interface EventCardProps {
  event: PublicEvent;
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

function getAccent(categoryId: string): string {
  const normalized = categoryId.toLowerCase();

  if (normalized.includes("music") || normalized.includes("mus")) {
    return "linear-gradient(135deg, #ff5a1f 0%, #ff8a52 100%)";
  }

  if (normalized.includes("gastr") || normalized.includes("food")) {
    return "linear-gradient(135deg, #b85e00 0%, #ffb347 100%)";
  }

  if (normalized.includes("art") || normalized.includes("culture") || normalized.includes("theater")) {
    return "linear-gradient(135deg, #004493 0%, #5ea1ff 100%)";
  }

  return "linear-gradient(135deg, #5b4038 0%, #ae3200 100%)";
}

function getStatusLabel(status: PublicEvent["status"]): string {
  return status === "live" ? "Vigente" : "Proximo";
}

function getStatusClass(status: PublicEvent["status"]): string {
  return status === "live" ? "badge badge--live" : "badge badge--upcoming";
}

export function EventCard({ event }: EventCardProps) {
  const accent = getAccent(event.category.id);
  const approximate = event.isApproximateLocation || event.location.isApproximateLocation;

  return (
    <article className="event-card" aria-label={event.title}>
      <div className="event-card__media" style={{ "--card-accent": accent } as CSSProperties}>
        <div className="event-card__media-overlay" />
        <div className="event-card__media-icon" aria-hidden="true">
          {event.category.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="event-card__badge-stack">
          <span className={getStatusClass(event.status)}>{getStatusLabel(event.status)}</span>
          <span className={event.isFree ? "badge badge--free" : "badge badge--cost"}>
            {event.isFree ? "Gratis" : event.costLabel}
          </span>
        </div>
      </div>

      <div className="event-card__body">
        <div className="event-card__header">
          <h3 className="event-card__title">{event.title}</h3>
          <span className="event-card__category">{event.category.name}</span>
        </div>

        <p className="event-card__summary">{event.summary}</p>

        <div className="event-card__meta">
          <div className="event-card__meta-row">
            <span className="event-card__meta-label">Fecha</span>
            <span className="event-card__meta-value">{formatSchedule(event.startsAt, event.endsAt)}</span>
          </div>
          <div className="event-card__meta-row">
            <span className="event-card__meta-label">Lugar</span>
            <span className="event-card__meta-value">{event.location.label}</span>
          </div>
        </div>

        <div className="event-card__footer">
          <span className="chip chip--zone">{event.zone.name}</span>
          {approximate ? <span className="chip chip--approximate">Ubicacion aproximada</span> : null}
        </div>
      </div>
    </article>
  );
}

