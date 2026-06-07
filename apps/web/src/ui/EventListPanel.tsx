import React from "react";

import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { EventCard } from "./EventCard";
import { LoadingState } from "./LoadingState";
import { ResultSummary } from "./ResultSummary";
import type {
  AppliedFilters,
  DiscoveryStatus,
  PublicEvent,
  PublicEventPagination
} from "../types/discovery";

interface EventListPanelProps {
  events: PublicEvent[];
  pagination: PublicEventPagination | null;
  appliedFilters: AppliedFilters | null;
  status: DiscoveryStatus;
  errorMessage: string | null;
  onRetry: () => void;
  selectedEventId: string | null;
  onSelectEvent: (eventId: string | null) => void;
}

export function EventListPanel({
  events,
  pagination,
  appliedFilters,
  status,
  errorMessage,
  onRetry,
  selectedEventId,
  onSelectEvent
}: EventListPanelProps) {
  if (status === "loading") {
    return <LoadingState />;
  }

  if (status === "error") {
    return (
      <div className="event-list-panel">
        <ErrorState message={errorMessage ?? "Hubo un problema de conexion con el servidor."} onRetry={onRetry} />
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="event-list-panel">
        <ResultSummary totalItems={pagination?.totalItems ?? 0} />
        <EmptyState />
      </div>
    );
  }

  return (
    <section className="event-list-panel" aria-label="Resultados de eventos">
      <ResultSummary totalItems={pagination?.totalItems ?? events.length} />

      {appliedFilters ? (
        <div className="event-list-panel__context" aria-hidden="true">
          <span className="event-list-panel__context-label">{appliedFilters.scope}</span>
          <span className="event-list-panel__context-pill">{appliedFilters.visibilityState}</span>
        </div>
      ) : null}

      <div className="event-list-panel__items">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isSelected={event.id === selectedEventId}
            onSelect={() => onSelectEvent(event.id)}
          />
        ))}
      </div>
    </section>
  );
}
