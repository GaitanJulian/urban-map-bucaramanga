import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import type { PublicationStatus } from "@umb/shared";

@Entity({ name: "event_drafts" })
@Index(["organizerProfileId", "updatedAt"])
@Index(["publicationStatus", "updatedAt"])
export class EventDraftEntity {
  @PrimaryColumn({ type: "varchar", length: 64 })
  id!: string;

  @Column({ type: "varchar", length: 64, name: "organizer_profile_id", nullable: true })
  organizerProfileId!: string | null;

  @Column({ type: "varchar", length: 180 })
  title!: string;

  @Column({ type: "varchar", length: 280, nullable: true })
  summary!: string | null;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "varchar", length: 64, name: "category_id", nullable: true })
  categoryId!: string | null;

  @Column({ type: "varchar", length: 64, name: "location_id", nullable: true })
  locationId!: string | null;

  @Column({ type: "varchar", length: 64, name: "zone_id", nullable: true })
  zoneId!: string | null;

  @Column({ type: "timestamptz", name: "starts_at", nullable: true })
  startsAt!: Date | null;

  @Column({ type: "timestamptz", name: "ends_at", nullable: true })
  endsAt!: Date | null;

  @Column({ type: "varchar", length: 80, name: "cost_label", nullable: true })
  costLabel!: string | null;

  @Column({ type: "boolean", name: "is_free", default: false })
  isFree!: boolean;

  @Column({ type: "varchar", length: 32, name: "publication_status", default: "draft" })
  publicationStatus!: PublicationStatus;

  @Column({ type: "varchar", length: 32, name: "visibility_state", default: "private" })
  visibilityState!: string;

  @Column({ type: "timestamptz", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamptz", name: "updated_at", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
