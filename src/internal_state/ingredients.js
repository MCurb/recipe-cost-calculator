import { ingObservers } from '../utils/observer';

class Ingredients {
  constructor() {
    this.ingredients = [
      {
        id: 'Harina',
        name: 'Harina',
        stockPrice: 24,
        quantity: 1,
        unit: 'kilograms',
        unitType: 'mass',
      },
      {
        id: 'Azúcar',
        name: 'Azúcar',
        stockPrice: 42,
        quantity: 2,
        unit: 'kilograms',
        unitType: 'mass',
      },
      {
        id: 'Huevos',
        name: 'Huevos',
        stockPrice: 28,
        quantity: 12,
        unit: 'pieces',
        unitType: 'unit',
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
    ingObservers.notify(this.getIngredientsData());
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

export const unitAbb = {
  grams: 'g',
  kilograms: 'kg',
  liters: 'lt',
  milliliters: 'ml',
  milligrams: 'mg',
  ounces: 'oz',
  pounds: 'lb',
  pieces: 'pz',
  tablespoons: 'tbsp',
  teaspoons: 'tsp',
  cups: 'cup',
};

export const spanishUnits = {
  grams: 'gramos',
  kilograms: 'kilogramos',
  liters: 'litros',
  milliliters: 'mililitros',
  milligrams: 'miligramos',
  ounces: 'onzas',
  pounds: 'libras',
  pieces: 'unidades',
  tablespoons: 'cucharadas',
  teaspoons: 'cucharaditas',
  cups: 'tazas',
};

export const spanishUnitType = {
  unit: 'unidad/pieza',
  mass: 'kg, g, mg, lb, oz',
  volume: 'l, ml, tbsp, tsp, cup',
};
