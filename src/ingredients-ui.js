import { observer } from './observer';
import { ingredientsClass } from './storage/ingredients';

// ========================
// DOM REFERENCES (static)
// ========================

const addIngBtn = document.querySelector('.add-ing-btn');
const ingName = document.querySelector('.ing-name');
const ingPrice = document.querySelector('.ing-price');
const ingQuantity = document.querySelector('.ing-quantity');
const ingUnit = document.querySelector('.ing-unit');

addIngBtn.addEventListener('click', () => {
  const newIngredient = {
    id: crypto.randomUUID(),
    name: ingName.value,
    stockPrice: Number(ingPrice.value),
    quantity: Number(ingQuantity.value),
    unit: ingUnit.value,
  };

  ingredientsClass.addIngredient(newIngredient);
  observer.notify(ingredientsClass.getIngredientsData());
  console.log(ingredientsClass.getIngredient(newIngredient.id));
});
