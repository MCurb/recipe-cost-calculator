import { ingObservers, recipeObservers } from '../observer';
import { ingredientsManager } from './ingredients';
import { recipesManager } from './recipes';

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
