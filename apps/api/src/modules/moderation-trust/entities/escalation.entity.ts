import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity({ name: "escalations" })
@Index(["reportCaseId", "createdAt"])
@Index(["moderationCaseId", "createdAt"])
export class EscalationEntity {
  @PrimaryColumn({ type: "varchar", length: 64 })
  id!: string;

  @Column({ type: "varchar", length: 64, name: "moderation_case_id", nullable: true })
  moderationCaseId!: string | null;

  @Column({ type: "varchar", length: 64, name: "report_case_id", nullable: true })
  reportCaseId!: string | null;

  @Column({ type: "varchar", length: 64, name: "escalated_by_actor_account_id", nullable: true })
  escalatedByActorAccountId!: string | null;

  @Column({ type: "text" })
  reason!: string;

  @Column({ type: "varchar", length: 32 })
  status!: string;

  @Column({ type: "timestamptz", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamptz", name: "resolved_at", nullable: true })
  resolvedAt!: Date | null;
}
