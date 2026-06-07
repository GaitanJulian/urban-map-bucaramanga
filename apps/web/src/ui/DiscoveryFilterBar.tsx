import React from "react";
import type { DiscoveryFiltersState, DiscoverySelectOption } from "../types/discovery";

interface DiscoveryFilterBarProps {
  filters: DiscoveryFiltersState;
  categoryOptions: DiscoverySelectOption[];
  zoneOptions: DiscoverySelectOption[];
  onPatch: (patch: Partial<DiscoveryFiltersState>) => void;
}

export function DiscoveryFilterBar({
  filters,
  categoryOptions,
  zoneOptions,
  onPatch
}: DiscoveryFilterBarProps) {
  return (
    <section className="filter-bar" aria-label="Filtros de descubrimiento">
      <div className="filter-bar__row">
        <label className="filter-field">
          <span>Fecha desde</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => onPatch({ dateFrom: event.target.value })}
          />
        </label>

        <label className="filter-field">
          <span>Fecha hasta</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) => onPatch({ dateTo: event.target.value })}
          />
        </label>

        <label className="filter-field">
          <span>Costo</span>
          <input
            type="text"
            value={filters.cost}
            onChange={(event) => onPatch({ cost: event.target.value })}
            placeholder="Gratis, pago o texto"
          />
        </label>

        <label className="filter-field">
          <span>Gratis / pago</span>
          <select
            value={filters.isFree}
            onChange={(event) => onPatch({ isFree: event.target.value as DiscoveryFiltersState["isFree"] })}
          >
            <option value="all">Todos</option>
            <option value="free">Gratis</option>
            <option value="paid">De pago</option>
          </select>
        </label>
      </div>

      <div className="filter-bar__row">
        <label className="filter-field">
          <span>Categoría</span>
          <select value={filters.categoryId} onChange={(event) => onPatch({ categoryId: event.target.value })}>
            <option value="">Todas</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <span>Zona</span>
          <select value={filters.zoneId} onChange={(event) => onPatch({ zoneId: event.target.value })}>
            <option value="">Todas</option>
            {zoneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field filter-field--wide">
          <span>Cercanía</span>
          <div className="proximity-toggle">
            <label className="proximity-toggle__switch">
              <input
                type="checkbox"
                checked={filters.useProximity}
                onChange={(event) => onPatch({ useProximity: event.target.checked })}
              />
              <span>Usar ubicación cercana</span>
            </label>
            <p className="filter-hint">Activa latitud, longitud y radio para filtrar por proximidad.</p>
          </div>
        </label>
      </div>

      {filters.useProximity ? (
        <div className="filter-bar__row filter-bar__row--proximity">
          <label className="filter-field">
            <span>Latitud</span>
            <input
              type="number"
              step="0.000001"
              value={filters.nearLat}
              onChange={(event) => onPatch({ nearLat: event.target.value })}
              placeholder="7.1193"
            />
          </label>

          <label className="filter-field">
            <span>Longitud</span>
            <input
              type="number"
              step="0.000001"
              value={filters.nearLng}
              onChange={(event) => onPatch({ nearLng: event.target.value })}
              placeholder="-73.1227"
            />
          </label>

          <label className="filter-field">
            <span>Radio (km)</span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={filters.radiusKm}
              onChange={(event) => onPatch({ radiusKm: event.target.value })}
              placeholder="5"
            />
          </label>
        </div>
      ) : null}
    </section>
  );
}
