import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity({ name: "moderation_decisions" })
@Index(["moderationCaseId", "createdAt"])
export class ModerationDecisionEntity {
  @PrimaryColumn({ type: "varchar", length: 64 })
  id!: string;

  @Column({ type: "varchar", length: 64, name: "moderation_case_id" })
  moderationCaseId!: string;

  @Column({ type: "varchar", length: 64, name: "moderator_actor_account_id", nullable: true })
  moderatorActorAccountId!: string | null;

  @Column({ type: "varchar", length: 32 })
  outcome!: string;

  @Column({ type: "text", nullable: true })
  reason!: string | null;

  @Column({ type: "timestamptz", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
