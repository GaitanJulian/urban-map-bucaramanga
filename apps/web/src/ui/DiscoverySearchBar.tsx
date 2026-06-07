import React from "react";

interface DiscoverySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function DiscoverySearchBar({ value, onChange, onClear }: DiscoverySearchBarProps) {
  const hasValue = value.trim().length > 0;

  return (
    <label className="search-bar">
      <span className="search-bar__icon" aria-hidden="true">
        ⌕
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Busca por nombre, lugar o categoria"
        aria-label="Buscar eventos"
      />
      {hasValue ? (
        <button type="button" className="search-bar__clear" onClick={onClear} aria-label="Limpiar búsqueda">
          ×
        </button>
      ) : null}
    </label>
  );
}

