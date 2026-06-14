import { MigrationInterface, QueryRunner } from "typeorm";

export class Release21729000000000 implements MigrationInterface {
  name = "Release21729000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE events
      ADD COLUMN IF NOT EXISTS source_draft_id varchar(64)
    `);

    await queryRunner.query(`
      ALTER TABLE events
      ADD COLUMN IF NOT EXISTS source_publication_case_id varchar(64)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_events_source_draft_id
      ON events (source_draft_id)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_events_source_publication_case_id
      ON events (source_publication_case_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_events_source_publication_case_id`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_events_source_draft_id`);
    await queryRunner.query(`ALTER TABLE events DROP COLUMN IF EXISTS source_publication_case_id`);
    await queryRunner.query(`ALTER TABLE events DROP COLUMN IF EXISTS source_draft_id`);
  }
}
