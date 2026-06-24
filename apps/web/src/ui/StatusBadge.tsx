import React from "react";

type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE_BY_STATUS: Record<string, StatusTone> = {
  approved: "success",
  resolved: "success",
  published: "success",
  live: "success",
  draft: "neutral",
  incomplete: "neutral",
  open: "info",
  ready_for_review: "info",
  pending: "info",
  submitted: "info",
  in_review: "info",
  triaged: "warning",
  changes_requested: "warning",
  needs_correction: "warning",
  waiting_correction: "warning",
  escalated: "warning",
  rejected: "danger",
  hidden: "danger",
  dismissed: "danger",
  cancelled: "danger",
  high: "warning",
  normal: "neutral",
  low: "neutral"
};

function resolveTone(value: string | null | undefined): StatusTone {
  if (!value) {
    return "neutral";
  }

  return TONE_BY_STATUS[value] ?? "neutral";
}

function formatLabel(value: string | null | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  return value.replace(/_/g, " ");
}

interface StatusBadgeProps {
  value: string | null | undefined;
  fallback?: string;
  tone?: StatusTone;
}

export function StatusBadge({ value, fallback = "Sin estado", tone }: StatusBadgeProps) {
  const resolvedTone = tone ?? resolveTone(value);

  return <span className={`status-badge status-badge--${resolvedTone}`}>{formatLabel(value, fallback)}</span>;
}
