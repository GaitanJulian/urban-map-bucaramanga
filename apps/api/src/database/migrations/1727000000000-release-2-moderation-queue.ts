import { MigrationInterface, QueryRunner } from "typeorm";

export class Release21727000000000 implements MigrationInterface {
  name = "Release21727000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS moderation_cases (
        id varchar(64) PRIMARY KEY,
        publication_case_id varchar(64) NOT NULL UNIQUE REFERENCES publication_cases(id) ON DELETE CASCADE,
        target_event_id varchar(64),
        status varchar(32) NOT NULL DEFAULT 'pending',
        priority varchar(32) NOT NULL DEFAULT 'normal',
        decision_outcome varchar(32),
        decision_reason text,
        reviewed_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_moderation_cases_status_created_at
      ON moderation_cases (status, created_at ASC)
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS moderation_decisions (
        id varchar(64) PRIMARY KEY,
        moderation_case_id varchar(64) NOT NULL REFERENCES moderation_cases(id) ON DELETE CASCADE,
        moderator_actor_account_id varchar(64),
        outcome varchar(32) NOT NULL,
        reason text,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_moderation_decisions_case_created_at
      ON moderation_decisions (moderation_case_id, created_at ASC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS moderation_decisions`);
    await queryRunner.query(`DROP TABLE IF EXISTS moderation_cases`);
  }
}
