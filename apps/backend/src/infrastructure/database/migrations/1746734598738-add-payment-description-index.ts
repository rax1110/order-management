import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentDescriptionIndex1746734598738 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_payment_description_trgm 
            ON "orders" USING GIN (payment_description gin_trgm_ops)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_payment_description_trgm`);
        await queryRunner.query(`DROP EXTENSION IF EXISTS pg_trgm`);
    }
}
