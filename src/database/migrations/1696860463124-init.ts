import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1696860463124 implements MigrationInterface {
    name = 'Init1696860463124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blocks" ("blockNumber" text NOT NULL, CONSTRAINT "PK_690ea5ec2a54fa22f4c57e5f435" PRIMARY KEY ("blockNumber"))`);
        await queryRunner.query(`CREATE TABLE "txs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from" text, "to" text, "value" text, "blockNumber" text NOT NULL, CONSTRAINT "PK_1517f48b701f77e22073c380614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "txs" ADD CONSTRAINT "FK_b8a2271e57c081f2fbf5f124ea6" FOREIGN KEY ("blockNumber") REFERENCES "blocks"("blockNumber") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "txs" DROP CONSTRAINT "FK_b8a2271e57c081f2fbf5f124ea6"`);
        await queryRunner.query(`DROP TABLE "txs"`);
        await queryRunner.query(`DROP TABLE "blocks"`);
    }

}
