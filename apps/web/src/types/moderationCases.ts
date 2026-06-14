import type { ModerationOutcome } from "@umb/shared";

export interface ModerationDraftSnapshot {
  draftId: string;
  title: string;
  summary?: string | null;
  description?: string | null;
  categoryId?: string | null;
  zoneId?: string | null;
  venueName?: string | null;
  address?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  isFree: boolean;
  costLabel?: string | null;
}

export interface ModerationCase {
  caseId: string;
  publicationCaseId: string;
  draftId?: string | null;
  publicationCaseStatus?: string | null;
  submittedAt?: string | null;
  createdAt?: string | null;
  draft?: ModerationDraftSnapshot | null;
  submittedSnapshot?: Record<string, unknown> | null;
  status: string;
  priority: string;
  decisionOutcome?: ModerationOutcome | null;
  decisionReason?: string | null;
}

export interface ModerationDecisionResponse {
  caseId: string;
  publicationCaseId: string;
  outcome: ModerationOutcome;
  reason?: string | null;
  status: string;
  publicationCaseStatus?: string | null;
}

export type ModerationAction = "approve" | "reject" | "request-correction" | "hide" | "escalate";
