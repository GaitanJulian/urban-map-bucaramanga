import React from "react";
import type { DiscoveryView } from "../types/discovery";

interface ViewToggleProps {
  value: DiscoveryView;
  onChange: (value: DiscoveryView) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle" role="group" aria-label="Cambiar vista">
      <button
        type="button"
        className={value === "map" ? "view-toggle__button is-active" : "view-toggle__button"}
        onClick={() => onChange("map")}
        aria-pressed={value === "map"}
      >
        Mapa
      </button>
      <button
        type="button"
        className={value === "list" ? "view-toggle__button is-active" : "view-toggle__button"}
        onClick={() => onChange("list")}
        aria-pressed={value === "list"}
      >
        Lista
      </button>
    </div>
  );
}
