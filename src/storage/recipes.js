import { recipeObservers } from '../observer';

class Recipes {
  constructor() {
    this.recipes = [
      {
        id: crypto.randomUUID(),
        name: 'Pastel de Zanahoria',
        ingredientsUsed: [
          {
            ingInfo: {
              id: 'ing id',
              name: 'Harina',
              stockPrice: 24,
              quantity: 500,
              unit: 'grams',
            },
            recipeUse: {
              quantityUsed: 1,
              unitUsed: 'kilograms',
              pricePerUnit: 48,
              ingPriceUsed: 48,
            },
          },
        ],
        recipeCost: 48,
      },
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
}

export const recipesClass = new Recipes();
