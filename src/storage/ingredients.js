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
      },
    ];
  }

  getIngredientsData() {
    return [...this.ingredients];
  }

  getIngredient(id) {
    return this.ingredients.find((ingredient) => ingredient.id === id);
  }

  addIngredient({ name, stockPrice, quantity, unit }) {
    const newIng = {
      id: crypto.randomUUID(),
      name: name,
      stockPrice: stockPrice,
      quantity: quantity,
      unit: unit,
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

  updateIngredient(id, newIng) {
    const currentIng = this.getIngredient(id);
    const updatedIng = { ...newIng, id: currentIng.id };
    this.ingredients.push(updatedIng);
    ingObservers.notify(this.getIngredientsData());
  }
}

export const ingredientsManager = new Ingredients();
