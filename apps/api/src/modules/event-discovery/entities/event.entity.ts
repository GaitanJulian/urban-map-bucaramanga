import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Index } from "typeorm";
import { EventCategoryEntity } from "./event-category.entity.js";
import { EventLocationEntity } from "../../geolocation-place/entities/event-location.entity.js";
import { ZoneEntity } from "../../geolocation-place/entities/zone.entity.js";

@Entity({ name: "events" })
@Index(["status", "visibilityState", "startsAt"])
export class EventEntity {
  @PrimaryColumn({ type: "varchar", length: 64 })
  id!: string;

  @Column({ type: "varchar", length: 180 })
  title!: string;

  @Column({ type: "varchar", length: 220, unique: true })
  slug!: string;

  @Column({ type: "varchar", length: 280 })
  summary!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 64, name: "category_id" })
  categoryId!: string;

  @Column({ type: "varchar", length: 64, name: "location_id" })
  locationId!: string;

  @Column({ type: "varchar", length: 64, name: "zone_id", nullable: true })
  zoneId!: string | null;

  @Column({ type: "varchar", length: 32 })
  status!: "upcoming" | "live" | "ended" | "cancelled";

  @Column({ type: "varchar", length: 32, name: "visibility_state" })
  visibilityState!: "visible" | "hidden";

  @Column({ type: "timestamptz", name: "starts_at" })
  startsAt!: Date;

  @Column({ type: "timestamptz", name: "ends_at" })
  endsAt!: Date;

  @Column({ type: "varchar", length: 80, name: "cost_label" })
  costLabel!: string;

  @Column({ type: "boolean", name: "is_free", default: false })
  isFree!: boolean;

  @Column({ type: "boolean", name: "is_approximate_location", default: false })
  isApproximateLocation!: boolean;

  @Column({ type: "boolean", name: "is_curated", default: true })
  isCurated!: boolean;

  @Column({ type: "timestamptz", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamptz", name: "updated_at", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @ManyToOne(() => EventCategoryEntity, { eager: false })
  @JoinColumn({ name: "category_id" })
  category?: EventCategoryEntity;

  @ManyToOne(() => EventLocationEntity, { eager: false })
  @JoinColumn({ name: "location_id" })
  location?: EventLocationEntity;

  @ManyToOne(() => ZoneEntity, { eager: false, nullable: true })
  @JoinColumn({ name: "zone_id" })
  zone?: ZoneEntity | null;
}
