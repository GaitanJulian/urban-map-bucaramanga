import { Injectable } from "@nestjs/common";
import type { PublicationStatus } from "@umb/shared";

@Injectable()
export class EventPublicationService {
  createDraft() {
    return {
      draftId: "draft_scaffold",
      title: "Borrador de Release 2",
      publicationStatus: "draft" as PublicationStatus
    };
  }

  listDrafts() {
    return [
      {
        draftId: "draft_scaffold",
        title: "Borrador de Release 2",
        publicationStatus: "draft" as PublicationStatus
      }
    ];
  }

  getDraft(draftId: string) {
    return {
      draftId,
      title: "Borrador de Release 2",
      publicationStatus: "draft" as PublicationStatus,
      validationIssues: []
    };
  }

  updateDraft(draftId: string) {
    return {
      draftId,
      publicationStatus: "draft" as PublicationStatus
    };
  }

  saveDraft(draftId: string) {
    return {
      draftId,
      saved: true
    };
  }

  validateDraft(draftId: string) {
    return {
      draftId,
      isValid: false,
      issues: ["Scaffold placeholder: validation not implemented"]
    };
  }

  submitDraft(draftId: string) {
    return {
      draftId,
      publicationStatus: "pending" as PublicationStatus
    };
  }

  cancelDraft(draftId: string) {
    return {
      draftId,
      publicationStatus: "cancelled" as PublicationStatus
    };
  }
}
