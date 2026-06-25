import React from "react";

export function DiscoveryToolbar() {
  return (
    <header className="discovery-toolbar">
      <div className="discovery-toolbar__brand">
        <span className="brand-mark" aria-hidden="true">
          ⌖
        </span>
        <div className="brand-copy">
          <h1>Urban Map Bucaramanga</h1>
          <p>Descubre eventos, cultura y experiencias locales</p>
        </div>
      </div>

      <div className="discovery-toolbar__meta" aria-hidden="true">
        <span className="discovery-toolbar__badge">Bucaramanga</span>
      </div>
    </header>
  );
}
