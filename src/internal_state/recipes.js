import { ingObservers, recipeObservers } from '../utils/observer';
import { ingredientsManager } from '../internal_state/ingredients';
import { calculateIngPrices } from '../utils/calculations';

class Recipes {
  constructor() {
    this.recipes = [
      {
        id: 'Zanahoria',
        name: 'Pastel de Zanahoria',
        ingredientsUsed: [
          {
            id: 'Azúcar',
            quantityUsed: 150,
            unitUsed: 'grams',
            pricePerUnit: 0.021,
            ingPriceUsed: 3.15,
          },
          {
            id: 'Huevos',
            quantityUsed: 4,
            unitUsed: 'pieces',
            pricePerUnit: 2.33,
            ingPriceUsed: 9.33,
          },
        ],
        recipeCost: 12.48,
      },
    ];
  }

  getRecipesData() {
    return this.recipes;
  }

  getRecipe(id) {
    return this.recipes.find((recipe) => recipe.id === id);
  }

  addLocalStorageRecipe(savedRecipe) {
    this.recipes.push(savedRecipe);
    recipeObservers.notify(this.getRecipesData());
  }

  addRecipe(obj) {
    const recipe = { ...obj, id: crypto.randomUUID() };
    this.recipes.push(recipe);
    recipeObservers.notify(this.getRecipesData());
  }

  removeRecipe(id) {
    this.recipes = this.recipes.filter((recipe) => recipe.id !== id);
    recipeObservers.notify(this.getRecipesData());
  }

  recipeUpdater(id, updatedRecipe) {
    const currentRecipe = this.getRecipe(id);
    Object.assign(currentRecipe, updatedRecipe);

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
    const { unitPrice, totalIngCost } = calculateIngPrices({
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

  clearRecipesData() {
    this.recipes = [];
    recipeObservers.notify(this.getRecipesData());
  }
}

export const recipesManager = new Recipes();

ingObservers.subscribe(recipesManager.recipesIngUpdater.bind(recipesManager));
