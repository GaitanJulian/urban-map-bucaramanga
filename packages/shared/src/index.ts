export type EventStatus = "upcoming" | "live" | "ended" | "cancelled";

export type VisibilityState = "visible" | "hidden";

export type LocationPrecision = "exact" | "street" | "neighborhood" | "zone" | "approximate";

export type ActorRole = "organizer" | "moderator" | "admin";

export type PublicationStatus =
  | "draft"
  | "incomplete"
  | "ready_for_review"
  | "pending"
  | "changes_requested"
  | "approved"
  | "published"
  | "cancelled";

export type ModerationOutcome = "approved" | "rejected" | "needs_correction" | "hidden" | "escalated" | "resolved";
