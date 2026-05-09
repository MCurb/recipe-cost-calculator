class Ingredients {
  constructor() {
    this.ingredients = [
      {
        id: crypto.randomUUID(),
        name: 'Harina',
        stockPrice: 24,
        quantity: 1000,
        unit: 'g',
        pricePerUnit: 0.024,
      },
    ];
  }

  getIngredientsData() {
    return this.ingredients;
  }

  getIngredient(id) {
    return this.ingredients.filter((ingredient) => ingredient.id === id)[0];
  }

  addIngredient(obj) {
    this.ingredients.push(obj);
  }

  removeIngredient(id) {
    this.ingredients = this.ingredients.filter((ingredient) => {
      ingredient.id !== id;
    });
  }
}

export const ingredientsClass = new Ingredients();
