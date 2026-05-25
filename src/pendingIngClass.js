import { pendingIngObservers } from './observer';

class PendingIng {
  constructor() {
    this.pendingIng = [];
  }

  getIngredient(id) {
    return this.pendingIng.find((ingredient) => ingredient.id === id);
  }

  getPendingIngsData() {
    return [...this.pendingIng];
  }

  addIngredient(ingredient) {
    this.pendingIng.push(ingredient);
    pendingIngObservers.notify(this.getPendingIngsData());
  }

  clearPendingIng() {
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
    const currentIng = this.getIngredient(id);
    Object.assign(currentIng, updatedIng);
    pendingIngObservers.notify(this.getPendingIngsData());
  }
}

export const pendingIngManager = new PendingIng();
