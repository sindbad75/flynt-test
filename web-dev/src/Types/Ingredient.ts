export interface Ingredient {
  id: number;
  name: string;
  price: number;
  tag: IngredientTag;
}


export type IngredientTag = "vegetable" | "protein" | "starch"
