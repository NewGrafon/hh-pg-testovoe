import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1734291181428 implements MigrationInterface {
  name = 'Initial1734291181428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "email" character varying(320) NOT NULL,
                "password" character(72) NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "articles" (
                "id" SERIAL NOT NULL,
                "title" character varying(128) NOT NULL,
                "content" character varying(65536) NOT NULL,
                "isPublic" boolean NOT NULL DEFAULT false,
                "tags" jsonb NOT NULL DEFAULT '[]',
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "articles"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }

}
