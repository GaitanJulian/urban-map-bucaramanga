import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity({ name: "report_signals" })
@Index(["reportCaseId", "createdAt"])
export class ReportSignalEntity {
  @PrimaryColumn({ type: "varchar", length: 64 })
  id!: string;

  @Column({ type: "varchar", length: 64, name: "report_case_id" })
  reportCaseId!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 280, name: "evidence_ref", nullable: true })
  evidenceRef!: string | null;

  @Column({ type: "timestamptz", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
