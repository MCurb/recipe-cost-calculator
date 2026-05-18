import convert from 'convert';
import { ingObservers } from './observer';
import { ingredientsManager } from './storage/ingredients';
import { recipesClass } from './storage/recipes';
import { createIngMinCard } from './ingredient-card';

// ========================
// DOM REFERENCES (static)
// ========================

const ulIngForm = document.querySelector('ul.ing-min-cards-container');

const addIngToRecipeBtn = document.querySelector('.add-ing-recipe-btn');
const addRecipeBtn = document.querySelector('.add-recipe-btn');
const recipeName = document.querySelector('.recipe-name');
const ingQuantityUsed = document.querySelector('.recipe-ing-quantity');
const ingUnitUsed = document.querySelector('.ing-unit-used');

const selectIng = document.querySelector('.select-ingredient');

let pendingIng = [];

addIngToRecipeBtn.addEventListener('click', () => {
  const ingUsedId = selectIng.selectedOptions[0].dataset.id;
  const ingredient = ingredientsManager.getIngredient(ingUsedId);
  const { id, stockPrice, quantity, unit } = ingredient;

  const ingUsed = {
    id: id,
    quantityUsed: Number(ingQuantityUsed.value),
    unitUsed: ingUnitUsed.value,
    pricePerUnit: null,
    ingPriceUsed: null,
  };

  const priceUnit = stockPrice / convert(quantity, unit).to(ingUsed.unitUsed);
  ingUsed.pricePerUnit = priceUnit;

  const priceUsed = ingUsed.quantityUsed * ingUsed.pricePerUnit;
  ingUsed.ingPriceUsed = Number(priceUsed.toFixed(2));

  pendingIng.push(ingUsed);
  updateIngFormList(pendingIng);
});

addRecipeBtn.addEventListener('click', () => {
  const newRecipe = {
    id: crypto.randomUUID(),
    name: recipeName.value,
    ingredientsUsed: [],
    recipeCost: 0,
  };

  // Add ingredients and calculate recipeCost
  pendingIng.forEach((ingredient) => {
    newRecipe.ingredientsUsed.push(ingredient);
    newRecipe.recipeCost += ingredient.ingPriceUsed;
  });

  recipesClass.addRecipe(newRecipe);
  console.log(recipesClass.getRecipe(newRecipe.id));
});

// Updater Function
function updateIngFormList(ingredients) {
  ulIngForm.innerHTML = '';
  !ulIngForm.classList.contains('visible') &&
    ulIngForm.classList.add('visible');

  ingredients.forEach((ingredient) => {
    ulIngForm.appendChild(createIngMinCard(ingredient));
  });
}

// Updater Function
function updateIngSelect(ingredientsObj) {
  selectIng.innerHTML = '';

  ingredientsObj.forEach((ingredient) => {
    selectIng.appendChild(createIngOption(ingredient));
  });
}
ingObservers.subscribe(updateIngSelect);

// Helper function
function createIngOption(ingredient) {
  const ingElem = document.createElement('option');
  ingElem.textContent = ingredient.name;
  ingElem.setAttribute('value', ingredient.name);
  ingElem.dataset.id = ingredient.id;

  return ingElem;
}
