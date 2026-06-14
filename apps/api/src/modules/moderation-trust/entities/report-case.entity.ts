import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity({ name: "report_cases" })
@Index(["targetEventId", "createdAt"])
@Index(["status", "createdAt"])
export class ReportCaseEntity {
  @PrimaryColumn({ type: "varchar", length: 64 })
  id!: string;

  @Column({ type: "varchar", length: 64, name: "target_event_id" })
  targetEventId!: string;

  @Column({ type: "varchar", length: 64, name: "intake_actor_account_id", nullable: true })
  intakeActorAccountId!: string | null;

  @Column({ type: "varchar", length: 64, name: "reporter_actor_account_id", nullable: true })
  reporterActorAccountId!: string | null;

  @Column({ type: "varchar", length: 280 })
  reason!: string;

  @Column({ type: "text", name: "decision_reason", nullable: true })
  decisionReason!: string | null;

  @Column({ type: "varchar", length: 32 })
  status!: string;

  @Column({ type: "varchar", length: 32, name: "triage_priority" })
  triagePriority!: string;

  @Column({ type: "timestamptz", name: "resolved_at", nullable: true })
  resolvedAt!: Date | null;

  @Column({ type: "timestamptz", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamptz", name: "updated_at", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
