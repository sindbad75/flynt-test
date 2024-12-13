import {MigrationInterface, QueryRunner} from "typeorm";

export class addTagToIngredients1734086017248 implements MigrationInterface {
    name = 'addTagToIngredients1734086017248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ingredient_tag_enum" AS ENUM('vegetable', 'protein', 'starch')`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "tag" "public"."ingredient_tag_enum" NOT NULL DEFAULT 'vegetable'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "tag"`);
        await queryRunner.query(`DROP TYPE "public"."ingredient_tag_enum"`);
    }

}
