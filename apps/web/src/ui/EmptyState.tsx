import React from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "No encontramos eventos para mostrar",
  message = "Prueba limpiando filtros o cambiando la búsqueda para descubrir qué está pasando hoy en Bucaramanga."
}: EmptyStateProps) {
  return (
    <section className="state-card state-card--empty" role="status" aria-live="polite">
      <div className="empty-state-illustration" aria-hidden="true">
        <span className="empty-state-illustration__icon">⌖</span>
      </div>
      <div className="state-card__copy">
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
    </section>
  );
}
