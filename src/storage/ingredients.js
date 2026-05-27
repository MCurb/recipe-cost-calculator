import { ingObservers } from '../observer';

class Ingredients {
  constructor() {
    this.ingredients = [
      {
        id: crypto.randomUUID(),
        name: 'Harina',
        stockPrice: 24,
        quantity: 1000,
        unit: 'g',
        unitType: 'mass',
      },
    ];
  }

  getIngredientsData() {
    return [...this.ingredients];
  }

  getIngredient(id) {
    return this.ingredients.find((ingredient) => ingredient.id === id);
  }

  addLocalStorageIng(savedIng) {
    this.ingredients.push(savedIng);
    ingObservers.notify(this.getIngredientsData());
  }

  addIngredient({ name, stockPrice, quantity, unit, unitType }) {
    const newIng = {
      id: crypto.randomUUID(),
      name: name,
      stockPrice: stockPrice,
      quantity: quantity,
      unit: unit,
      unitType: unitType,
    };

    this.ingredients.push(newIng);
    ingObservers.notify(this.getIngredientsData());
  }

  removeIngredient(id) {
    this.ingredients = this.ingredients.filter(
      (ingredient) => ingredient.id !== id,
    );
    ingObservers.notify(this.getIngredientsData());
  }

  updateIngredient(id, updatedIng) {
    const currentIng = this.getIngredient(id);
    Object.assign(currentIng, updatedIng);

    ingObservers.notify(this.getIngredientsData());
  }

  clearIngredientsData() {
    this.ingredients = [];
  }
}

export const ingredientsManager = new Ingredients();

export const unitType = {
  pieces: 'unit',
  grams: 'mass',
  kilograms: 'mass',
  ounces: 'mass',
  pounds: 'mass',
  liters: 'volume',
  milliliters: 'volume',
  tablespoons: 'volume',
  teaspoons: 'volume',
  cups: 'volume',
};
