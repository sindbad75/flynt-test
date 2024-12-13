import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type IngredientTag = "vegetable" | "protein" | "starch"


@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({
    type: "enum",
    enum: ["vegetable" , "protein" , "starch"],
    default: "vegetable"
  })
  tag: IngredientTag;
}
