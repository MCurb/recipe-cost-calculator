import { ingObservers } from './observer';
import { ingredientsManager, spanishUnits } from './storage/ingredients';

const ingCardTemplate = document.querySelector('.ingredient-card-template');

export function createIngCardUI(ingredientObj) {
  const { id, name, stockPrice, quantity, unit } = ingredientObj;

  const ingCard = ingCardTemplate.content.cloneNode(true);
  ingCard.firstElementChild.dataset.ingId = id;

  ingCard.querySelector('.card-ing-name').textContent = name;
  ingCard.querySelector('.card-ing-unit').textContent =
    `${quantity} ${quantity > 1 ? spanishUnits[unit] : spanishUnits[unit].slice(0, -1)}`;
  ingCard.querySelector('.card-ing-price').textContent =
    `Costo: ${stockPrice} MXN`;
  ingCard.querySelectorAll('button').forEach((button) => {
    button.dataset.ingId = id;
  });

  return ingCard;
}

const ingMinCardTemplate = document.querySelector('.ing-min-card-template');
// Helper function
export function createIngMinCard(ingObj) {
  const { id, quantityUsed, unitUsed, ingPriceUsed } = ingObj;
  const { name } = ingredientsManager.getIngredient(id);

  const unitAbb = {
    grams: 'g',
    kilograms: 'kg',
    liters: 'lt',
    milliliters: 'ml',
    milligrams: 'mg',
    ounces: 'oz',
    pounds: 'lb',
    pieces: 'pc',
    tablespoons: 'tbsp',
    teaspoons: 'tsp',
    cups: 'cup',
  };

  const ingMinCard = ingMinCardTemplate.content.cloneNode(true);

  ingMinCard.querySelector('.min-card-name').textContent = name;
  ingMinCard.querySelector('.min-card-unit').textContent =
    `${quantityUsed}${unitAbb[unitUsed]}`;
  ingMinCard.querySelector('.min-card-price').textContent =
    `${ingPriceUsed} MXN`;

  ingMinCard.querySelector('.min-card-edit-btn').dataset.ingId = id;
  ingMinCard.querySelector('.min-card-del-btn').dataset.ingId = id;

  return ingMinCard;
}

const ingCardsCont = document.querySelector('.ing-cards-container');
function updateIngCardsContainer(ingredients) {
  ingCardsCont.innerHTML = '';
  ingredients.forEach((ingredient) => {
    ingCardsCont.appendChild(createIngCardUI(ingredient));
  });
}
ingObservers.subscribe(updateIngCardsContainer);
