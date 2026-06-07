import React from "react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry: () => void;
}

export function ErrorState({
  title = "No pudimos cargar los eventos",
  message,
  onRetry
}: ErrorStateProps) {
  return (
    <section className="state-card state-card--error" role="alert">
      <div className="error-illustration" aria-hidden="true">
        <span className="error-illustration__icon">⌁</span>
      </div>
      <div className="state-card__copy">
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
      <div className="state-card__actions">
        <button type="button" className="button button--primary" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    </section>
  );
}
