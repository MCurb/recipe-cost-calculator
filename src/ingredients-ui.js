import { observer } from './observer';
import { ingredientsManager } from './storage/ingredients';
import { createIngCardUI } from './ingredient-card';

// ========================
// DOM REFERENCES (static)
// ========================

const ingCardsCont = document.querySelector('.ing-cards-container');

// === Ingredient Form ===

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

  ingredientsManager.addIngredient(newIngredient);
  observer.notify(ingredientsManager.getIngredientsData());
  console.log(ingredientsManager.getIngredient(newIngredient.id));

  ingCardsCont.appendChild(createIngCardUI(newIngredient));
});

// === Ingredient Cards ===

const ingCardsContainer = document.querySelector('.ing-cards-container');

ingCardsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('del-ing-btn')) {
    const ingId = e.target.dataset.ingId;

    ingredientsManager.removeIngredient(ingId);

    updateIngCardsUI(ingId, 'delete');
    observer.notify(ingredientsManager.getIngredientsData());
  }
});

function updateIngCardsUI(ingId, action) {
  if (action === 'delete') {
    //find ing card node
    const ingCard = document.querySelector(
      `.ingredient-card[data-ing-id="${ingId}"]`,
    );
    //delete it
    ingCard.remove();
  }
}

// Instead of the event handler manually updating other parts of the website,
// it should only notify (to the relevant observers) the data has changed,
// and the observers themselves should deal with the new data doing their job.
// I should also create multiple observers, containing only the relevant subscribers
