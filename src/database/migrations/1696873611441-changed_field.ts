import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedField1696873611441 implements MigrationInterface {
    name = 'ChangedField1696873611441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "txs" DROP CONSTRAINT "FK_b8a2271e57c081f2fbf5f124ea6"`);
        await queryRunner.query(`ALTER TABLE "blocks" DROP CONSTRAINT "PK_690ea5ec2a54fa22f4c57e5f435"`);
        await queryRunner.query(`ALTER TABLE "blocks" DROP COLUMN "blockNumber"`);
        await queryRunner.query(`ALTER TABLE "blocks" ADD "blockNumber" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blocks" ADD CONSTRAINT "PK_690ea5ec2a54fa22f4c57e5f435" PRIMARY KEY ("blockNumber")`);
        await queryRunner.query(`ALTER TABLE "txs" DROP COLUMN "blockNumber"`);
        await queryRunner.query(`ALTER TABLE "txs" ADD "blockNumber" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "txs" ADD CONSTRAINT "FK_b8a2271e57c081f2fbf5f124ea6" FOREIGN KEY ("blockNumber") REFERENCES "blocks"("blockNumber") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "txs" DROP CONSTRAINT "FK_b8a2271e57c081f2fbf5f124ea6"`);
        await queryRunner.query(`ALTER TABLE "txs" DROP COLUMN "blockNumber"`);
        await queryRunner.query(`ALTER TABLE "txs" ADD "blockNumber" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blocks" DROP CONSTRAINT "PK_690ea5ec2a54fa22f4c57e5f435"`);
        await queryRunner.query(`ALTER TABLE "blocks" DROP COLUMN "blockNumber"`);
        await queryRunner.query(`ALTER TABLE "blocks" ADD "blockNumber" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blocks" ADD CONSTRAINT "PK_690ea5ec2a54fa22f4c57e5f435" PRIMARY KEY ("blockNumber")`);
        await queryRunner.query(`ALTER TABLE "txs" ADD CONSTRAINT "FK_b8a2271e57c081f2fbf5f124ea6" FOREIGN KEY ("blockNumber") REFERENCES "blocks"("blockNumber") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
