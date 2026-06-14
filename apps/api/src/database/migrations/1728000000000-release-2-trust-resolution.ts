import { MigrationInterface, QueryRunner } from "typeorm";

export class Release21728000000000 implements MigrationInterface {
  name = "Release21728000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS report_cases (
        id varchar(64) PRIMARY KEY,
        target_event_id varchar(64) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        intake_actor_account_id varchar(64),
        reporter_actor_account_id varchar(64),
        reason varchar(280) NOT NULL,
        decision_reason text,
        status varchar(32) NOT NULL DEFAULT 'open',
        triage_priority varchar(32) NOT NULL DEFAULT 'normal',
        resolved_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_report_cases_target_event_created_at
      ON report_cases (target_event_id, created_at DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_report_cases_status_created_at
      ON report_cases (status, created_at DESC)
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS report_signals (
        id varchar(64) PRIMARY KEY,
        report_case_id varchar(64) NOT NULL REFERENCES report_cases(id) ON DELETE CASCADE,
        description text NOT NULL,
        evidence_ref varchar(280),
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_report_signals_report_case_created_at
      ON report_signals (report_case_id, created_at ASC)
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS escalations (
        id varchar(64) PRIMARY KEY,
        moderation_case_id varchar(64) REFERENCES moderation_cases(id) ON DELETE CASCADE,
        report_case_id varchar(64) REFERENCES report_cases(id) ON DELETE CASCADE,
        escalated_by_actor_account_id varchar(64),
        reason text NOT NULL,
        status varchar(32) NOT NULL DEFAULT 'open',
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        resolved_at timestamptz
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_escalations_report_case_created_at
      ON escalations (report_case_id, created_at ASC)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_escalations_moderation_case_created_at
      ON escalations (moderation_case_id, created_at ASC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS escalations`);
    await queryRunner.query(`DROP TABLE IF EXISTS report_signals`);
    await queryRunner.query(`DROP TABLE IF EXISTS report_cases`);
  }
}
