import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity({ name: "publication_cases" })
@Index(["eventDraftId", "createdAt"])
@Index(["status", "createdAt"])
export class PublicationCaseEntity {
  @PrimaryColumn({ type: "varchar", length: 64 })
  id!: string;

  @Column({ type: "varchar", length: 64, name: "event_draft_id" })
  eventDraftId!: string;

  @Column({ type: "varchar", length: 64, name: "submitted_by_actor_account_id", nullable: true })
  submittedByActorAccountId!: string | null;

  @Column({ type: "varchar", length: 32 })
  status!: string;

  @Column({ type: "timestamptz", name: "submitted_at", default: () => "CURRENT_TIMESTAMP" })
  submittedAt!: Date;

  @Column({ type: "timestamptz", name: "reviewed_at", nullable: true })
  reviewedAt!: Date | null;

  @Column({ type: "varchar", length: 64, name: "review_decision_id", nullable: true })
  reviewDecisionId!: string | null;

  @Column({ type: "boolean", name: "critical_change_flag", default: false })
  criticalChangeFlag!: boolean;

  @Column({ type: "timestamptz", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamptz", name: "updated_at", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
