import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderTable1746734569373 implements MigrationInterface {
    name = 'CreateOrderTable1746734569373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableExists = await queryRunner.hasTable("orders");

        if (tableExists) {
            return;
        }
        
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_number" character varying NOT NULL, "unique_id" character varying NOT NULL, "payment_description" text NOT NULL, "street_address" character varying NOT NULL, "town" character varying NOT NULL, "country_code" character varying(2) NOT NULL, "amount" numeric(10,2) NOT NULL, "currency_code" character varying(3) NOT NULL, "payment_due_date" TIMESTAMP NOT NULL, CONSTRAINT "UQ_75eba1c6b1a66b09f2a97e6927b" UNIQUE ("order_number"), CONSTRAINT "UQ_a6d972d293193ebc0a1a10d6401" UNIQUE ("unique_id"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "orders"`);
    }

}
