import convert from 'convert';
import { ingObservers, pendingIngObservers } from './observer';
import { ingredientsManager } from './storage/ingredients';
import { recipesManager } from './storage/recipes';
import { createIngMinCard } from './ingredient-card';
import { calculateIngredient } from './calculations';
import { pendingIngManager } from './pendingIngClass';

// ========================
// DOM REFERENCES (static)
// ========================

// === Recipe Form Ref ===

const ulIngForm = document.querySelector('ul.ing-min-cards-container');

const addIngToRecipeBtn = document.querySelector('.add-ing-recipe-btn');
const addRecipeBtn = document.querySelector('.add-recipe-btn');
const recipeName = document.querySelector('.recipe-name');
const ingQuantityUsed = document.querySelector('.recipe-ing-quantity');
const ingUnitUsed = document.querySelector('.ing-unit-used');

const selectIng = document.querySelector('.select-ingredient');

// === Recipe Form Listeners ===

addIngToRecipeBtn.addEventListener('click', () => {
  const ingUsedId = selectIng.selectedOptions[0].dataset.id;
  const ingredient = ingredientsManager.getIngredient(ingUsedId);

  const ingUsed = {
    id: ingredient.id,
    quantityUsed: Number(ingQuantityUsed.value),
    unitUsed: ingUnitUsed.value,
    pricePerUnit: null,
    ingPriceUsed: null,
  };

  const { unitPrice, totalIngCost } = calculateIngredient({
    ...ingredient,
    ...ingUsed,
  });

  ingUsed.pricePerUnit = unitPrice;
  ingUsed.ingPriceUsed = Number(totalIngCost.toFixed(2));

  pendingIngManager.addIngredient(ingUsed);
});

addRecipeBtn.addEventListener('click', (e) => {
  const { dataset } = e.target;
  // const recipeExists = recipesManager.getRecipe(dataset.recipeId);
  // if (recipeExists) {
  //   const updatedRecipe = {
  //     name: recipeName.value,
  //     ingredientsUsed: [],
  //     recipeCost: 0,
  //   };
  // }

  const newRecipe = {
    name: recipeName.value,
    ingredientsUsed: [],
    recipeCost: 0,
  };

  // Add ingredients and calculate recipeCost
  const pendingIngredients = pendingIngManager.getPendingIngsData();

  pendingIngredients.forEach((ingredient) => {
    newRecipe.ingredientsUsed.push(ingredient);
    newRecipe.recipeCost += ingredient.ingPriceUsed;
  });

  recipesManager.addRecipe(newRecipe);
});

// === Recipe Cards Listeners ===

const recipeCardsCont = document.querySelector('.recipe-cards-container');

// Working on adding edit and delete functionallitiy for recipes
recipeCardsCont.addEventListener('click', (e) => {
  const { classList, dataset } = e.target;
  const recipeId = dataset.recipeId;

  if (classList.contains('del-recipe-btn')) {
    recipesManager.removeRecipe(recipeId);
  }
  if (classList.contains('edit-recipe-btn')) {
    const recipeObj = recipesManager.getRecipe(recipeId);
    populateRecipeForm(recipeObj);
  }
});

function populateRecipeForm(recipeObj) {
  // Destructure recipe obj info
  const { id, name, ingredientsUsed } = recipeObj;
  // name input =  recipe name
  recipeName.value = name;
  addRecipeBtn.dataset.recipeId = id;
  // call update ing form list
  updateIngFormList(ingredientsUsed);
  // I need to figure out a way to edit each ingredient used in the recipe
}

// Updater Function
function updateIngFormList(ingredients) {
  ulIngForm.innerHTML = '';
  !ulIngForm.classList.contains('visible') &&
    ulIngForm.classList.add('visible');

  ingredients.forEach((ingredient) => {
    ulIngForm.appendChild(createIngMinCard(ingredient));
  });
}
pendingIngObservers.subscribe(updateIngFormList);

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
