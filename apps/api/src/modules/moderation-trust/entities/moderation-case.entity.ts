import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity({ name: "moderation_cases" })
@Index(["publicationCaseId"], { unique: true })
@Index(["status", "createdAt"])
export class ModerationCaseEntity {
  @PrimaryColumn({ type: "varchar", length: 64 })
  id!: string;

  @Column({ type: "varchar", length: 64, name: "publication_case_id" })
  publicationCaseId!: string;

  @Column({ type: "varchar", length: 64, name: "target_event_id", nullable: true })
  targetEventId!: string | null;

  @Column({ type: "varchar", length: 32 })
  status!: string;

  @Column({ type: "varchar", length: 32 })
  priority!: string;

  @Column({ type: "varchar", length: 32, name: "decision_outcome", nullable: true })
  decisionOutcome!: string | null;

  @Column({ type: "text", name: "decision_reason", nullable: true })
  decisionReason!: string | null;

  @Column({ type: "timestamptz", name: "reviewed_at", nullable: true })
  reviewedAt!: Date | null;

  @Column({ type: "timestamptz", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamptz", name: "updated_at", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
