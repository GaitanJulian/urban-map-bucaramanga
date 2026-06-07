import React from "react";

import { DiscoveryToolbar } from "./DiscoveryToolbar";
import { EventListPanel } from "./EventListPanel";
import { EventMapPlaceholder } from "./EventMapPlaceholder";
import type {
  AppliedFilters,
  DiscoveryStatus,
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
}

export function DiscoveryLayout({
  events,
  pagination,
  appliedFilters,
  status,
  errorMessage,
  onRetry
}: DiscoveryLayoutProps) {
  const totalVisibleEvents = pagination?.totalItems ?? events.length;

  return (
    <main className="discovery-shell">
      <DiscoveryToolbar />

      <section className="discovery-shell__content">
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
    </main>
  );
}
