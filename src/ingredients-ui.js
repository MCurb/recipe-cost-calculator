import { observer } from './observer';
import { ingredientsClass } from './storage/ingredients';

// ========================
// DOM REFERENCES (static)
// ========================

const ingCardsCont = document.querySelector('.ing-cards-container');

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

  ingCardsCont.appendChild(createIngCardUI(newIngredient));
});

const ingCardTemplate = document.querySelector('.ingredient-card-template');

function createIngCardUI(ingredientObj) {
  const { id, name, stockPrice, quantity, unit } = ingredientObj;

  const ingCard = ingCardTemplate.content.cloneNode(true);
  ingCard.firstElementChild.dataset.ingId = id;

  ingCard.querySelector('.card-ing-name').textContent = name;
  ingCard.querySelector('.card-ing-unit').textContent =
    `Unit: ${quantity} ${quantity > 1 ? unit : unit.slice(0, -1)}`;
  ingCard.querySelector('.card-ing-price').textContent =
    `Cost: ${stockPrice} MXN`;
  ingCard.querySelectorAll('button').forEach((button) => {
    button.dataset.ingId = id;
  });

  return ingCard;
}

// ingCardBtnContainer.addEventListener('click', (e) => {
//   if (e.target.classList.contains('edit-ing-btn')) {
//     const ingredientObj = ingredientsClass.getIngredient(
//       e.target.dataset.ingId,
//     );

//   }
// });
