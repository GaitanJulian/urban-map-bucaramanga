export interface ReportSignal {
  signalId: string;
  description: string;
  evidenceRef?: string | null;
  createdAt: string;
}

export interface ModerationReport {
  reportId: string;
  targetEventId: string;
  targetEventTitle?: string | null;
  status: string;
  triagePriority: string;
  reason: string;
  decisionReason?: string | null;
  resolvedAt?: string | null;
  signals: ReportSignal[];
}

export interface ReportActionResponse {
  reportId: string;
  status: string;
  triagePriority: string;
  decisionReason?: string | null;
}

export type ReportAction = "triage" | "resolve" | "dismiss" | "hide" | "escalate";
