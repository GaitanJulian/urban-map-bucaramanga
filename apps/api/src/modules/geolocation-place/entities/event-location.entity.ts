import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Index } from "typeorm";
import { ZoneEntity } from "./zone.entity.js";

@Entity({ name: "event_locations" })
@Index(["cityName", "zoneId"])
export class EventLocationEntity {
  @PrimaryColumn({ type: "varchar", length: 64 })
  id!: string;

  @Column({ type: "varchar", length: 180 })
  label!: string;

  @Column({ type: "varchar", length: 280, name: "address_text" })
  addressText!: string;

  @Column({ type: "varchar", length: 64, name: "zone_id" })
  zoneId!: string;

  @Column({ type: "geometry", name: "point_geometry", spatialFeatureType: "Point", srid: 4326 })
  pointGeometry!: string;

  @Column({ type: "double precision" })
  latitude!: number;

  @Column({ type: "double precision" })
  longitude!: number;

  @Column({ type: "varchar", length: 32, name: "precision_level" })
  precisionLevel!: "exact" | "street" | "neighborhood" | "zone" | "approximate";

  @Column({ type: "varchar", length: 280, name: "approximation_note", nullable: true })
  approximationNote!: string | null;

  @Column({ type: "varchar", length: 80, name: "city_name" })
  cityName!: string;

  @ManyToOne(() => ZoneEntity, { eager: false })
  @JoinColumn({ name: "zone_id" })
  zone?: ZoneEntity;
}
