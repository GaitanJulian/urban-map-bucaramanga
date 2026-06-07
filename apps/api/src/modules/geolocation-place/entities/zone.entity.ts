import { Column, Entity, PrimaryColumn, Index } from "typeorm";

@Entity({ name: "zones" })
@Index(["slug"], { unique: true })
export class ZoneEntity {
  @PrimaryColumn({ type: "varchar", length: 64 })
  id!: string;

  @Column({ type: "varchar", length: 120 })
  name!: string;

  @Column({ type: "varchar", length: 120, unique: true })
  slug!: string;

  @Column({ type: "varchar", length: 32, name: "boundary_type", default: "polygon" })
  boundaryType!: "polygon" | "multipolygon";

  @Column({ type: "geometry", name: "boundary_geometry", spatialFeatureType: "MultiPolygon", srid: 4326 })
  boundaryGeometry!: string;

  @Column({ type: "boolean", name: "is_active", default: true })
  isActive!: boolean;

  @Column({ type: "int", name: "sort_order", default: 0 })
  sortOrder!: number;
}
