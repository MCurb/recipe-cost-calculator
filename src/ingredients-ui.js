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

// function createIngCardUI(ingredient) {
//   const { id, name, stockPrice, quantity, unit } = ingredient;

//   const ingNameActions = createNameActions(id, name);
//   const ingInfo = createIngInfo(stockPrice, quantity, unit);

//   const ingCard = createElement('div', 'ingredient-card');
//   ingCard.append(ingNameActions, ingInfo);

//   return ingCard;
// }

// function createNameActions(id, name) {
//   const recipeName = createElement('h3');
//   recipeName.textContent = name;

//   const editBtn = createElement('button', 'edit-ing-btn');
//   editBtn.textContent = 'Edit';
//   const deleteBtn = createElement('button', 'del-ing-btn');
//   deleteBtn.textContent = 'Delete';

//   [editBtn, deleteBtn].forEach((button) => (button.dataset.ingId = id));

//   const buttons = createElement('div', 'buttons');
//   buttons.append(editBtn, deleteBtn);

//   const nameActionsCont = createElement('div', 'ing-name-actions-container');
//   nameActionsCont.append(recipeName, buttons);
//   return nameActionsCont;
// }

// function createIngInfo(stockPrice, quantity, unit) {
//   const cost = createElement('p', 'ing-price-ui');
//   cost.textContent = `Cost: ${stockPrice} MXN`;

//   const quantityUnit = createElement('p', 'ing-quantity-unit');
//   quantityUnit.textContent = `Unit: ${quantity} ${quantity > 1 ? unit : unit.slice(0, -1)}`;

//   const ingInfoCont = createElement('div', 'ing-info-container');
//   ingInfoCont.append(quantityUnit, cost);

//   return ingInfoCont;
// }

// export function createElement(element, className) {
//   const elem = document.createElement(element);
//   if (className) elem.classList.add(className);
//   return elem;
// }

// const ingCardBtnContainer = document.querySelector('.ingredient-card .buttons');

// ingCardBtnContainer.addEventListener('click', (e) => {
//   if (e.target.classList.contains('edit-ing-btn')) {
//     const ingredientObj = ingredientsClass.getIngredient(
//       e.target.dataset.ingId,
//     );

//   }
// });
