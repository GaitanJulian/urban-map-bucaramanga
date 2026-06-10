import { Injectable } from "@nestjs/common";
import type { ModerationOutcome } from "@umb/shared";

@Injectable()
export class ModerationTrustService {
  listCases() {
    return [
      {
        caseId: "case_scaffold",
        status: "pending",
        priority: "normal"
      }
    ];
  }

  getCase(caseId: string) {
    return {
      caseId,
      status: "pending",
      priority: "normal",
      decisionOutcome: null
    };
  }

  decideCase(caseId: string, outcome: ModerationOutcome) {
    return {
      caseId,
      outcome
    };
  }

  listReports() {
    return [
      {
        reportId: "report_scaffold",
        status: "open",
        triagePriority: "normal"
      }
    ];
  }

  getReport(reportId: string) {
    return {
      reportId,
      status: "open",
      triagePriority: "normal"
    };
  }

  createReport(intakeSource: string) {
    return {
      reportId: "report_scaffold",
      intakeSource,
      status: "open",
      triagePriority: "normal"
    };
  }

  triageReport(reportId: string) {
    return {
      reportId,
      status: "triaged"
    };
  }

  resolveReport(reportId: string) {
    return {
      reportId,
      status: "resolved"
    };
  }

  dismissReport(reportId: string) {
    return {
      reportId,
      status: "dismissed"
    };
  }
}
