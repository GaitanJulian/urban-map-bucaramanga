import { MigrationInterface, QueryRunner } from "typeorm";

export class Release21730000000000 implements MigrationInterface {
  name = "Release21730000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE event_drafts
      ADD COLUMN IF NOT EXISTS venue_name varchar(180)
    `);

    await queryRunner.query(`
      ALTER TABLE event_drafts
      ADD COLUMN IF NOT EXISTS address_text varchar(280)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE event_drafts
      DROP COLUMN IF EXISTS address_text
    `);

    await queryRunner.query(`
      ALTER TABLE event_drafts
      DROP COLUMN IF EXISTS venue_name
    `);
  }
}
