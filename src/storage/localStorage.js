import { ingObservers, recipeObservers } from '../utils/observer';
import { ingredientsManager } from '../internal_state/ingredients';
import { recipesManager } from '../internal_state/recipes';

function saveIngredients(ingredients) {
  localStorage.setItem('ingredients', JSON.stringify(ingredients));
}
ingObservers.subscribe(saveIngredients);

function saveRecipes(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}
recipeObservers.subscribe(saveRecipes);

export function loadData() {
  const savedIngredients = localStorage.getItem('ingredients');
  const savedRecipes = localStorage.getItem('recipes');
  const examplesLoaded = localStorage.getItem('examplesLoaded');

  if (!examplesLoaded) {
    localStorage.setItem('examplesLoaded', true);
    return loadExamples();
  }

  if (savedIngredients) {
    const ingredients = JSON.parse(savedIngredients);
    ingredientsManager.clearIngredientsData();
    ingredients.forEach((ingredient) =>
      ingredientsManager.addLocalStorageIng(ingredient),
    );
  }

  if (savedRecipes) {
    const recipes = JSON.parse(savedRecipes);
    recipesManager.clearRecipesData();
    recipes.forEach((recipe) => recipesManager.addLocalStorageRecipe(recipe));
  }
}

function loadExamples() {
  ingObservers.notify(ingredientsManager.getIngredientsData());
  recipeObservers.notify(recipesManager.getRecipesData());
}
