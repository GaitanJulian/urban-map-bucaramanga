import { MigrationInterface, QueryRunner } from "typeorm";

export class Release21725000000000 implements MigrationInterface {
  name = "Release21725000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS event_drafts (
        id varchar(64) PRIMARY KEY,
        organizer_profile_id varchar(64),
        title varchar(180) NOT NULL,
        summary varchar(280),
        description text,
        category_id varchar(64),
        location_id varchar(64),
        zone_id varchar(64),
        starts_at timestamptz,
        ends_at timestamptz,
        cost_label varchar(80),
        is_free boolean NOT NULL DEFAULT false,
        publication_status varchar(32) NOT NULL DEFAULT 'draft',
        visibility_state varchar(32) NOT NULL DEFAULT 'private',
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_event_drafts_organizer_updated_at
      ON event_drafts (organizer_profile_id, updated_at DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_event_drafts_publication_status_updated_at
      ON event_drafts (publication_status, updated_at DESC)
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS publication_cases (
        id varchar(64) PRIMARY KEY,
        event_draft_id varchar(64) NOT NULL REFERENCES event_drafts(id) ON DELETE CASCADE,
        submitted_by_actor_account_id varchar(64),
        status varchar(32) NOT NULL,
        submitted_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        reviewed_at timestamptz,
        review_decision_id varchar(64),
        critical_change_flag boolean NOT NULL DEFAULT false,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_publication_cases_event_draft_created_at
      ON publication_cases (event_draft_id, created_at DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_publication_cases_status_created_at
      ON publication_cases (status, created_at DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS publication_cases`);
    await queryRunner.query(`DROP TABLE IF EXISTS event_drafts`);
  }
}
