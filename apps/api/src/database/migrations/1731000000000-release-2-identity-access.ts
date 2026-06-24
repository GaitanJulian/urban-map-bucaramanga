import { MigrationInterface, QueryRunner } from "typeorm";

export class Release21731000000000 implements MigrationInterface {
  name = "Release21731000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" text PRIMARY KEY,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "emailVerified" boolean NOT NULL DEFAULT false,
        "image" text,
        "role" text NOT NULL DEFAULT 'organizer',
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "user_email_idx" ON "user" ("email")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "id" text PRIMARY KEY,
        "userId" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
        "token" text NOT NULL,
        "expiresAt" timestamptz NOT NULL,
        "ipAddress" text,
        "userAgent" text,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "session_token_idx" ON "session" ("token")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "session" ("userId")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "account" (
        "id" text PRIMARY KEY,
        "userId" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
        "accountId" text NOT NULL,
        "providerId" text NOT NULL,
        "accessToken" text,
        "refreshToken" text,
        "accessTokenExpiresAt" timestamptz,
        "refreshTokenExpiresAt" timestamptz,
        "scope" text,
        "idToken" text,
        "password" text,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account" ("userId")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "verification" (
        "id" text PRIMARY KEY,
        "identifier" text NOT NULL,
        "value" text NOT NULL,
        "expiresAt" timestamptz NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" ("identifier")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "verification"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "account"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "session"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }
}
