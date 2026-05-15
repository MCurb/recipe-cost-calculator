import { ingredientsManager } from './storage/ingredients';

// ========================
// DOM REFERENCES (static)
// ========================

// === Ingredient Form ===

const addIngBtn = document.querySelector('.add-ing-btn');
const ingName = document.querySelector('.ing-name');
const ingPrice = document.querySelector('.ing-price');
const ingQuantity = document.querySelector('.ing-quantity');
const ingUnit = document.querySelector('.ing-unit');

addIngBtn.addEventListener('click', () => {
  const newIngredient = {
    name: ingName.value,
    stockPrice: Number(ingPrice.value),
    quantity: Number(ingQuantity.value),
    unit: ingUnit.value,
  };

  ingredientsManager.addIngredient(newIngredient);
});

// === Ingredient Cards ===

const ingCardsContainer = document.querySelector('.ing-cards-container');

ingCardsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('del-ing-btn')) {
    const ingId = e.target.dataset.ingId;

    ingredientsManager.removeIngredient(ingId);
  }
});
