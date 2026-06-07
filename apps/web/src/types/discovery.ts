export type DiscoveryView = "map" | "list";
export type DiscoveryStatus = "loading" | "success" | "empty" | "error";
export type DiscoveryFreeFilter = "all" | "free" | "paid";

export type EventStatus = "upcoming" | "live" | "ended" | "cancelled";
export type VisibilityState = "visible" | "hidden";
export type LocationPrecision = "exact" | "street" | "neighborhood" | "zone" | "approximate";

export interface EventCategory {
  id: string;
  name: string;
}

export interface EventZone {
  id: string;
  name: string;
}

export interface EventLocation {
  label: string;
  addressText: string;
  latitude: number;
  longitude: number;
  precisionLevel: LocationPrecision;
  approximationNote?: string | null;
  isApproximateLocation: boolean;
}

export interface PublicEvent {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: EventCategory;
  location: EventLocation;
  zone: EventZone;
  status: EventStatus;
  visibilityState: VisibilityState;
  startsAt: string;
  endsAt: string;
  costLabel: string;
  isFree: boolean;
  isApproximateLocation: boolean;
}

export interface PublicEventPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface AppliedFilters {
  scope: string;
  visibilityState: string;
  lifecycle: string[];
  q?: string;
  categoryId?: string;
  zoneId?: string;
  dateFrom?: string;
  dateTo?: string;
  isFree?: boolean;
  cost?: string;
  nearLat?: number;
  nearLng?: number;
  radiusKm?: number;
  sort?: string;
}

export interface PublicEventListResponse {
  items: PublicEvent[];
  pagination: PublicEventPagination;
  appliedFilters: AppliedFilters;
}

export interface EventDiscoveryQuery {
  q?: string;
  categoryId?: string;
  zoneId?: string;
  dateFrom?: string;
  dateTo?: string;
  cost?: string;
  isFree?: boolean;
  nearLat?: number;
  nearLng?: number;
  radiusKm?: number;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface DiscoveryFiltersState {
  q: string;
  dateFrom: string;
  dateTo: string;
  isFree: DiscoveryFreeFilter;
  cost: string;
  categoryId: string;
  zoneId: string;
  useProximity: boolean;
  nearLat: string;
  nearLng: string;
  radiusKm: string;
}

export interface DiscoverySelectOption {
  value: string;
  label: string;
}
