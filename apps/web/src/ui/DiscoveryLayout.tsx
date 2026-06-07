import React from "react";

import { EventListPanel } from "./EventListPanel";
import { EventMapPlaceholder } from "./EventMapPlaceholder";
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
}

export function DiscoveryLayout({
  events,
  pagination,
  appliedFilters,
  status,
  errorMessage,
  onRetry,
  view
}: DiscoveryLayoutProps) {
  const totalVisibleEvents = pagination?.totalItems ?? events.length;
  const stateClass = `is-${status}`;

  return (
    <section
      className={
        view === "map"
          ? `discovery-shell__content is-map-active ${stateClass}`
          : `discovery-shell__content is-list-active ${stateClass}`
      }
    >
      <div className="discovery-shell__map">
        <EventMapPlaceholder eventCount={totalVisibleEvents} />
      </div>

      <div className="discovery-shell__list">
        <EventListPanel
          events={events}
          pagination={pagination}
          appliedFilters={appliedFilters}
          status={status}
          errorMessage={errorMessage}
          onRetry={onRetry}
        />
      </div>
    </section>
  );
}
