import React from "react";
import type { DiscoveryView } from "../types/discovery";

interface ViewToggleProps {
  value: DiscoveryView;
  onChange: (value: DiscoveryView) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle" role="tablist" aria-label="Cambiar vista">
      <button
        type="button"
        className={value === "map" ? "view-toggle__button is-active" : "view-toggle__button"}
        onClick={() => onChange("map")}
        role="tab"
        aria-selected={value === "map"}
      >
        Mapa
      </button>
      <button
        type="button"
        className={value === "list" ? "view-toggle__button is-active" : "view-toggle__button"}
        onClick={() => onChange("list")}
        role="tab"
        aria-selected={value === "list"}
      >
        Lista
      </button>
    </div>
  );
}

