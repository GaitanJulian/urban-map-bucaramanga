import { MigrationInterface, QueryRunner } from "typeorm";

export class Release21726000000000 implements MigrationInterface {
  name = "Release21726000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE publication_cases
      ADD COLUMN IF NOT EXISTS submitted_snapshot jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE publication_cases
      DROP COLUMN IF EXISTS submitted_snapshot
    `);
  }
}
