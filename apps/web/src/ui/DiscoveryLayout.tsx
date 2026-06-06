import { EventMapPlaceholder } from "./EventMapPlaceholder";
import { EventListPanel } from "./EventListPanel";
import { DiscoveryToolbar } from "./DiscoveryToolbar";

export function DiscoveryLayout() {
  return (
    <main>
      <DiscoveryToolbar />
      <section style={{ display: "grid", gap: 16, padding: 16 }}>
        <EventMapPlaceholder />
        <EventListPanel />
      </section>
    </main>
  );
}
