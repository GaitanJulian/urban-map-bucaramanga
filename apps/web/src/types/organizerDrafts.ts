import type { PublicationStatus } from "@umb/shared";

export interface OrganizerDraft {
  draftId: string;
  title: string;
  summary: string | null;
  description: string | null;
  categoryId: string | null;
  zoneId: string | null;
  venueName: string | null;
  address: string | null;
  startsAt: string | null;
  endsAt: string | null;
  isFree: boolean;
  costLabel: string | null;
  organizerProfileId?: string | null;
  publicationCaseId?: string | null;
  publicationCaseStatus?: string | null;
  publicationStatus: PublicationStatus;
}

export interface DraftMutationResponse {
  draftId: string;
  saved?: boolean;
  publicationStatus?: PublicationStatus;
  publicationCaseId?: string | null;
  publicationCaseStatus?: string | null;
}

export interface DraftValidationResponse {
  draftId: string;
  isValid: boolean;
  issues: string[];
}

export interface DraftEditorState {
  title: string;
  summary: string;
  description: string;
  categoryId: string;
  zoneId: string;
  venueName: string;
  address: string;
  startsAt: string;
  endsAt: string;
  isFree: boolean;
  costLabel: string;
}
