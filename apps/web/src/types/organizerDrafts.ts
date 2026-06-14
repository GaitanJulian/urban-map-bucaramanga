import type { PublicationStatus } from "@umb/shared";

export interface OrganizerDraft {
  draftId: string;
  title: string;
  summary: string | null;
  description: string | null;
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
}
