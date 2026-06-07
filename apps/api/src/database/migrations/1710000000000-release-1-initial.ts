import { MigrationInterface, QueryRunner } from "typeorm";

export class Release11710000000000 implements MigrationInterface {
  name = "Release11710000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS event_categories (
        id varchar(64) PRIMARY KEY,
        name varchar(120) NOT NULL,
        slug varchar(120) NOT NULL UNIQUE,
        is_active boolean NOT NULL DEFAULT true,
        sort_order integer NOT NULL DEFAULT 0
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS zones (
        id varchar(64) PRIMARY KEY,
        name varchar(120) NOT NULL,
        slug varchar(120) NOT NULL UNIQUE,
        boundary_type varchar(32) NOT NULL DEFAULT 'polygon',
        boundary_geometry geometry(MultiPolygon, 4326) NOT NULL,
        is_active boolean NOT NULL DEFAULT true,
        sort_order integer NOT NULL DEFAULT 0
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS event_locations (
        id varchar(64) PRIMARY KEY,
        label varchar(180) NOT NULL,
        address_text varchar(280) NOT NULL,
        zone_id varchar(64) NOT NULL REFERENCES zones(id),
        point_geometry geometry(Point, 4326) NOT NULL,
        latitude double precision NOT NULL,
        longitude double precision NOT NULL,
        precision_level varchar(32) NOT NULL,
        approximation_note varchar(280),
        city_name varchar(80) NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS events (
        id varchar(64) PRIMARY KEY,
        title varchar(180) NOT NULL,
        slug varchar(220) NOT NULL UNIQUE,
        summary varchar(280) NOT NULL,
        description text NOT NULL,
        category_id varchar(64) NOT NULL REFERENCES event_categories(id),
        location_id varchar(64) NOT NULL REFERENCES event_locations(id),
        zone_id varchar(64) REFERENCES zones(id),
        status varchar(32) NOT NULL,
        visibility_state varchar(32) NOT NULL,
        starts_at timestamptz NOT NULL,
        ends_at timestamptz NOT NULL,
        cost_label varchar(80) NOT NULL,
        is_free boolean NOT NULL DEFAULT false,
        is_approximate_location boolean NOT NULL DEFAULT false,
        is_curated boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_events_visibility_status_starts_at
      ON events (visibility_state, status, starts_at)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_event_locations_city_zone
      ON event_locations (city_name, zone_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS events`);
    await queryRunner.query(`DROP TABLE IF EXISTS event_locations`);
    await queryRunner.query(`DROP TABLE IF EXISTS zones`);
    await queryRunner.query(`DROP TABLE IF EXISTS event_categories`);
  }
}
