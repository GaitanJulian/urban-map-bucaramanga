import React from "react";
import type { DiscoveryFiltersState } from "../types/discovery";

interface ActiveFilterChipsProps {
  filters: DiscoveryFiltersState;
  categoryLabels: Record<string, string>;
  zoneLabels: Record<string, string>;
  onPatch: (patch: Partial<DiscoveryFiltersState>) => void;
  onClearAll: () => void;
}

interface ChipItem {
  key: string;
  label: string;
  onRemove: () => void;
}

function buildChips(
  filters: DiscoveryFiltersState,
  onPatch: (patch: Partial<DiscoveryFiltersState>) => void,
  categoryLabels: Record<string, string>,
  zoneLabels: Record<string, string>
): ChipItem[] {
  const chips: ChipItem[] = [];

  if (filters.q.trim().length > 0) {
    chips.push({
      key: "q",
      label: `Busca: ${filters.q.trim()}`,
      onRemove: () => onPatch({ q: "" })
    });
  }

  if (filters.dateFrom) {
    chips.push({
      key: "dateFrom",
      label: `Desde ${filters.dateFrom}`,
      onRemove: () => onPatch({ dateFrom: "" })
    });
  }

  if (filters.dateTo) {
    chips.push({
      key: "dateTo",
      label: `Hasta ${filters.dateTo}`,
      onRemove: () => onPatch({ dateTo: "" })
    });
  }

  if (filters.isFree !== "all") {
    chips.push({
      key: "isFree",
      label: filters.isFree === "free" ? "Gratis" : "De pago",
      onRemove: () => onPatch({ isFree: "all" })
    });
  }

  if (filters.cost.trim().length > 0) {
    chips.push({
      key: "cost",
      label: `Costo: ${filters.cost.trim()}`,
      onRemove: () => onPatch({ cost: "" })
    });
  }

  if (filters.categoryId.trim().length > 0) {
    chips.push({
      key: "categoryId",
      label: `Categoría: ${categoryLabels[filters.categoryId] ?? filters.categoryId}`,
      onRemove: () => onPatch({ categoryId: "" })
    });
  }

  if (filters.zoneId.trim().length > 0) {
    chips.push({
      key: "zoneId",
      label: `Zona: ${zoneLabels[filters.zoneId] ?? filters.zoneId}`,
      onRemove: () => onPatch({ zoneId: "" })
    });
  }

  if (filters.useProximity && filters.nearLat && filters.nearLng && filters.radiusKm) {
    chips.push({
      key: "proximity",
      label: `Cerca de ${filters.nearLat}, ${filters.nearLng} • ${filters.radiusKm} km`,
      onRemove: () => onPatch({ useProximity: false, nearLat: "", nearLng: "", radiusKm: "" })
    });
  }

  return chips;
}

export function ActiveFilterChips({
  filters,
  categoryLabels,
  zoneLabels,
  onPatch,
  onClearAll
}: ActiveFilterChipsProps) {
  const chips = buildChips(filters, onPatch, categoryLabels, zoneLabels);

  if (chips.length === 0) {
    return null;
  }

  return (
    <section className="active-filters" aria-label="Filtros activos">
      <span className="active-filters__label">Filtros activos:</span>
      <div className="active-filters__chips">
        {chips.map((chip) => (
          <button key={chip.key} type="button" className="active-filters__chip" onClick={chip.onRemove}>
            <span>{chip.label}</span>
            <span aria-hidden="true">×</span>
          </button>
        ))}
      </div>
      <button type="button" className="active-filters__clear" onClick={onClearAll}>
        Limpiar todo
      </button>
    </section>
  );
}
