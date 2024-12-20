import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { CardCustom } from "../Components/CardCustom";
import { Loader } from "../Components/Loader";
import { useMutationRecipeCreate } from "../Hooks/Mutation/RecipeMutation";
import { useQueryIngredientList } from "../Hooks/Query/IngredientQuery";
import { ErrorPage } from "../Pages/ErrorPage";
import { Ingredient, IngredientTag } from "../Types/Ingredient";
import { Recipe } from "../Types/Recipe";
import { OptionsMultiSelectType } from "../Types/OptionsMultiSelect";

export function CreateRecipesForm({ recipes }: { recipes: Recipe[] }): JSX.Element {
  const [name, setName] = useState("");
  const [timeToCook, setTimeToCook] = useState<number>(0);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(0);
  const [selectedIngredients, setSelectedIngredients] = useState<
    OptionsMultiSelectType[]
  >([]);
  const { mutateAsync: createRecipe } = useMutationRecipeCreate();
  const { data: ingredients, status, isLoading } = useQueryIngredientList();

  const resetFields = () => {
    setName("");
    setTimeToCook(0);
    setNumberOfPeople(0);
    setSelectedIngredients([]);
  };

  const handlerSubmitNewRecipe = async () => {
    if (!name || !timeToCook || !numberOfPeople || !selectedIngredients) {
      alert("Please fill all the fields");
      return;
    }

    if (!hasStarch) {
      alert("Please add a starch");
      return;
    }

    await createRecipe({
      name,
      timeToCook,
      numberOfPeople,
      ingredients: selectedIngredients.map((e) => e.id),
    });

    resetFields();
  };

  if (status === "error") {
    return <ErrorPage />;
  }
  if (isLoading) {
    return <Loader />;
  }

  function getIngredientsIdsFromListAndTag(ingredients: Ingredient[], tag: IngredientTag) {
   return ingredients.reduce((acc: number[], curr: Ingredient) => {
      if (curr.tag === tag) {
        acc.push(curr.id)
      }
      return acc
    }, [] as number[]) 
  }

  // recipes
  const alreadyUsedProteinIngredientsIds = recipes.reduce((acc: number[], curr: Recipe) => {
    const withProteinIngredientsIds = getIngredientsIdsFromListAndTag(curr.ingredients, "protein")
    if (withProteinIngredientsIds.length === 1) { // to only handle valid recipes
      acc.push(withProteinIngredientsIds[0])
    }
    return acc
  }, [] as number[])
  

  // ingredients
  const withProteinIngredientsIds = getIngredientsIdsFromListAndTag(ingredients, "protein")

  const withStarchIngredientsIds = getIngredientsIdsFromListAndTag(ingredients, "starch")

  const hasProtein = !!selectedIngredients.find(ingredient => withProteinIngredientsIds.includes(ingredient.id))

  const hasStarch = !!selectedIngredients.find(ingredient => withStarchIngredientsIds.includes(ingredient.id))

  return (
    <div id="create-recipes-form">
      <Box
        display="flex"
        justifyContent="space-between"
        className="MarginTop16Px"
      >
        <CardCustom isSmall>
          <h2>New recipe</h2>
          <FormControl fullWidth margin="normal">
            <TextField
              id="name-recipe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name of the recipe"
              variant="outlined"
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            {/* on peut mettre plusieurs fois le même ingrédient dans le formulaire mais après ça l'enregistre qu'une fois*/}
            <Autocomplete
              onChange={(_e, value: OptionsMultiSelectType[]) => {
                setSelectedIngredients(value);
              }}
              value={selectedIngredients}
              multiple
              id="combo-box-demo"
              options={ingredients.map((e: Ingredient) => {
                return { label: e.name, id: e.id };
              })}
              isOptionEqualToValue={(option, value) => option.id === value.id} // fix console warning
              getOptionDisabled={(option) => {
                if (alreadyUsedProteinIngredientsIds.includes(option.id)) {
                  return true
                }
                if (withProteinIngredientsIds.includes(option.id) && hasProtein) {
                  return true
                }
                if (withStarchIngredientsIds.includes(option.id) && hasStarch) {
                  return true
                }
                return false
              }}
              renderInput={(params: any) => (
                <TextField {...params} label="Ingredients" />
              )}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              value={timeToCook}
              onChange={(e) =>
                e.target.value
                  ? setTimeToCook(Number(e.target.value))
                  : setTimeToCook(0)
              }
              id="name-recipe"
              label="Time to cook"
              variant="outlined"
              type="number"
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              value={numberOfPeople}
              onChange={(e) =>
                e.target.value
                  ? setNumberOfPeople(Number(e.target.value))
                  : setNumberOfPeople(0)
              }
              id="name-recipe"
              label="Number of people"
              variant="outlined"
              type="number"
              fullWidth
            />
          </FormControl>
          <FormControl margin="normal">
            <Button onClick={handlerSubmitNewRecipe} variant="contained">
              Submit
            </Button>
          </FormControl>
        </CardCustom>
      </Box>
    </div>
  );
}
