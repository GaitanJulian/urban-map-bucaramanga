import React from "react";

import { EventListPanel } from "./EventListPanel";
import { DiscoveryMapPanel } from "./DiscoveryMapPanel";
import { EventDetailPanel } from "./EventDetailPanel";
import type {
  AppliedFilters,
  DiscoveryStatus,
  DiscoveryView,
  PublicEvent,
  PublicEventPagination
} from "../types/discovery";

interface DiscoveryLayoutProps {
  events: PublicEvent[];
  pagination: PublicEventPagination | null;
  appliedFilters: AppliedFilters | null;
  status: DiscoveryStatus;
  errorMessage: string | null;
  onRetry: () => void;
  view: DiscoveryView;
  selectedEventId: string | null;
  selectedEvent: PublicEvent | null;
  onSelectEvent: (eventId: string | null) => void;
}

export function DiscoveryLayout({
  events,
  pagination,
  appliedFilters,
  status,
  errorMessage,
  onRetry,
  view,
  selectedEventId,
  selectedEvent,
  onSelectEvent
}: DiscoveryLayoutProps) {
  const totalVisibleEvents = pagination?.totalItems ?? events.length;
  const stateClass = `is-${status}`;
  const isMapVisible = status !== "success" || view === "map";

  return (
    <section
      className={
        view === "map"
          ? `discovery-shell__content is-map-active ${stateClass}`
          : `discovery-shell__content is-list-active ${stateClass}`
      }
      >
      <div className="discovery-shell__map">
        <DiscoveryMapPanel
          events={events}
          eventCount={totalVisibleEvents}
          status={status}
          isVisible={isMapVisible}
          selectedEventId={selectedEventId}
          onSelectEvent={onSelectEvent}
        />
      </div>

      <div className="discovery-shell__list">
        <EventListPanel
          events={events}
          pagination={pagination}
          appliedFilters={appliedFilters}
          status={status}
          errorMessage={errorMessage}
          onRetry={onRetry}
          selectedEventId={selectedEventId}
          onSelectEvent={onSelectEvent}
        />
      </div>

      {selectedEvent ? (
        <EventDetailPanel event={selectedEvent} onClose={() => onSelectEvent(null)} />
      ) : null}
    </section>
  );
}
