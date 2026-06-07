import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "event_categories" })
export class EventCategoryEntity {
  @PrimaryColumn({ type: "varchar", length: 64 })
  id!: string;

  @Column({ type: "varchar", length: 120 })
  name!: string;

  @Column({ type: "varchar", length: 120, unique: true })
  slug!: string;

  @Column({ type: "boolean", name: "is_active", default: true })
  isActive!: boolean;

  @Column({ type: "int", name: "sort_order", default: 0 })
  sortOrder!: number;
}
