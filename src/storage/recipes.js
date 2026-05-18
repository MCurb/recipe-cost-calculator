import { ingObservers, recipeObservers } from '../observer';
import { ingredientsManager } from './ingredients';
import { calculateIngredient } from '../calculations';

class Recipes {
  constructor() {
    this.recipes = [
      // {
      //   id: crypto.randomUUID(),
      //   name: 'Pastel de Zanahoria',
      //   ingredientsUsed: [
      //     {
      //       id: 'ingredientId',
      //       quantityUsed: 1,
      //       unitUsed: 'kilograms',
      //       pricePerUnit: 48,
      //       ingPriceUsed: 48,
      //     },
      //   ],
      //   recipeCost: 48,
      // },
    ];
  }

  getRecipesData() {
    return this.recipes;
  }

  getRecipe(id) {
    return this.recipes.find((recipe) => recipe.id === id);
  }

  addRecipe(obj) {
    this.recipes.push(obj);
    recipeObservers.notify(this.getRecipesData());
  }

  removeRecipe(id) {
    this.recipes = this.recipes.filter((recipe) => {
      recipe.id !== id;
    });
    recipeObservers.notify(this.getRecipesData());
  }

  recipeUpdater(id, newRecipe) {
    const recipe = this.getRecipe(id);
    const updatedRecipe = { ...newRecipe, id: recipe.id };
    this.recipes.push(updatedRecipe);
    recipeObservers.notify(this.getRecipesData());
  }

  recipesIngUpdater(ingredients) {
    if (this.recipes.length < 1) return;

    const ingIds = new Set();
    ingredients.forEach((ingredient) => ingIds.add(ingredient.id));

    this.recipes.forEach((recipe) => {
      // Filter out deleted ingredients
      recipe.ingredientsUsed = recipe.ingredientsUsed.filter((ingredient) =>
        ingIds.has(ingredient.id),
      );

      // Update ingredients costs
      let totalCost = 0;
      recipe.ingredientsUsed.forEach((ingredient) => {
        this.updateIngRecipePrices(ingredient);
        totalCost += ingredient.ingPriceUsed;
      });

      // Update recipe cost
      recipe.recipeCost = Number(totalCost.toFixed(2));
    });

    recipeObservers.notify(this.getRecipesData());
  }

  updateIngRecipePrices(recipeIngredient) {
    const { stockPrice, quantity, unit } = ingredientsManager.getIngredient(
      recipeIngredient.id,
    );
    const { quantityUsed, unitUsed } = recipeIngredient;
    const { unitPrice, totalIngCost } = calculateIngredient({
      stockPrice,
      quantity,
      unit,
      quantityUsed,
      unitUsed,
    });

    recipeIngredient.pricePerUnit = unitPrice;
    recipeIngredient.ingPriceUsed = Number(totalIngCost.toFixed(2));
    recipeObservers.notify(this.getRecipesData());
  }
}

export const recipesClass = new Recipes();

ingObservers.subscribe(recipesClass.recipesIngUpdater.bind(recipesClass));
