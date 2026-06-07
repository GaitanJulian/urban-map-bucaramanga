import React from "react";

export function LoadingState() {
  return (
    <div className="state-card state-card--loading" aria-busy="true" aria-live="polite">
      <div className="loading-shell loading-shell--header" />
      <div className="loading-shell loading-shell--chips">
        <span />
        <span />
        <span />
      </div>

      <div className="event-skeleton-list" aria-hidden="true">
        <article className="event-card event-card--skeleton">
          <div className="event-card__media event-card__media--skeleton" />
          <div className="event-card__body">
            <div className="loading-shell loading-shell--title" />
            <div className="loading-shell loading-shell--line" />
            <div className="loading-shell loading-shell--line loading-shell--line-short" />
          </div>
        </article>

        <article className="event-card event-card--skeleton">
          <div className="event-card__media event-card__media--skeleton" />
          <div className="event-card__body">
            <div className="loading-shell loading-shell--title" />
            <div className="loading-shell loading-shell--line" />
            <div className="loading-shell loading-shell--line loading-shell--line-short" />
          </div>
        </article>
      </div>
    </div>
  );
}
