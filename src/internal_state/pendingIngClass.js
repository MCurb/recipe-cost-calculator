import { calculateIngPrices } from '../utils/calculations';
import { ingObservers, pendingIngObservers } from '../utils/observer';
import { ingredientsManager } from '../internal_state/ingredients';

class PendingIng {
  constructor() {
    this.pendingIng = [];
  }

  getPendingIng(id) {
    return this.pendingIng.find((ingredient) => ingredient.id === id);
  }

  getPendingIngsData() {
    return [...this.pendingIng];
  }

  addIngredient(ingredient) {
    this.pendingIng.push(ingredient);
    pendingIngObservers.notify(this.getPendingIngsData());
  }

  clearPendingList() {
    this.pendingIng = [];
    pendingIngObservers.notify(this.getPendingIngsData());
  }

  removeIngredient(id) {
    this.pendingIng = this.pendingIng.filter(
      (ingredient) => ingredient.id !== id,
    );
    pendingIngObservers.notify(this.getPendingIngsData());
  }

  updateIngredient(id, updatedIng) {
    const currentIng = this.getPendingIng(id);
    Object.assign(currentIng, updatedIng);
    pendingIngObservers.notify(this.getPendingIngsData());
  }

  filterDeletedIng(ingredients) {
    const currentIds = new Set();
    ingredients.forEach((ingredient) => {
      currentIds.add(ingredient.id);
    });

    this.pendingIng = this.pendingIng.filter((pendingIng) =>
      currentIds.has(pendingIng.id),
    );

    this.pendingIng.forEach((ingredient) =>
      this.updatePendingIngPrices(ingredient),
    );

    pendingIngObservers.notify(this.getPendingIngsData());
  }

  updatePendingIngPrices(pendingIng) {
    const ingredient = ingredientsManager.getIngredient(pendingIng.id);
    const { unitPrice, totalIngCost } = calculateIngPrices({
      ...ingredient,
      ...pendingIng,
    });

    pendingIng.pricePerUnit = unitPrice;
    pendingIng.ingPriceUsed = Number(totalIngCost.toFixed(2));
  }
}

export const pendingIngManager = new PendingIng();
ingObservers.subscribe(
  pendingIngManager.filterDeletedIng.bind(pendingIngManager),
);
