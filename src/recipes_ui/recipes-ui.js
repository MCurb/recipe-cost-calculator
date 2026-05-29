import { ingObservers, pendingIngObservers } from '../utils/observer';
import {
  ingredientsManager,
  spanishUnits,
  spanishUnitType,
  unitType,
} from '../internal_state/ingredients';
import { recipesManager } from '../internal_state/recipes';
import { createIngMinCard } from '../ingredients_ui/ingredient-cards';
import { calculateIngPrices } from '../utils/calculations';
import { pendingIngManager } from '../internal_state/pendingIngClass';
import { cleanFormInputs } from '../ingredients_ui/ingredients-ui';

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

addIngToRecipeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const ingUsedId = selectIng.selectedOptions[0].dataset.id;
  const ingredient = ingredientsManager.getIngredient(ingUsedId);

  const ingUsed = {
    id: ingredient.id,
    quantityUsed: Number(ingQuantityUsed.value),
    unitUsed: ingUnitUsed.value,
    pricePerUnit: null,
    ingPriceUsed: null,
  };

  if (unitType[ingredient.unit] !== unitType[ingUsed.unitUsed]) {
    alert(
      `No es posible convertir de ${spanishUnits[ingredient.unit]} a ${spanishUnits[ingUsed.unitUsed]}. Por favor, seleccione una unidad compatible, ej: ${spanishUnitType[unitType[ingredient.unit]]}`,
    );
    return;
  }

  const { unitPrice, totalIngCost } = calculateIngPrices({
    ...ingredient,
    ...ingUsed,
  });

  ingUsed.pricePerUnit = unitPrice;
  ingUsed.ingPriceUsed = Number(totalIngCost.toFixed(2));

  cleanFormInputs([selectIng, ingQuantityUsed]);

  //Update or add new
  const pendingIngExists = pendingIngManager.getPendingIng(ingUsed.id);
  if (pendingIngExists) {
    pendingIngManager.updateIngredient(ingUsed.id, ingUsed);
    return;
  }
  pendingIngManager.addIngredient(ingUsed);
});

addRecipeBtn.addEventListener('click', (e) => {
  const { dataset } = e.target;

  const recipe = {
    name: recipeName.value,
    ingredientsUsed: [],
    recipeCost: 0,
  };

  // Add ingredients and calculate recipeCost
  const pendingIngredients = pendingIngManager.getPendingIngsData();

  pendingIngredients.forEach((ingredient) => {
    recipe.ingredientsUsed.push(ingredient);
    recipe.recipeCost += ingredient.ingPriceUsed;
  });
  pendingIngManager.clearPendingList();

  cleanFormInputs([recipeName]);

  //Update or add new
  const recipeExists = recipesManager.getRecipe(dataset.recipeId);
  if (recipeExists) {
    recipesManager.recipeUpdater(dataset.recipeId, recipe);
    dataset.recipeId = '';
    return;
  }

  recipesManager.addRecipe(recipe);
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
  // update pending ing form list
  pendingIngManager.clearPendingList();
  ingredientsUsed.forEach((ingredient) =>
    pendingIngManager.addIngredient(ingredient),
  );
}

// === Pending Ing Min Cards Listeners ===

ulIngForm.addEventListener('click', (e) => {
  const { dataset, classList } = e.target;

  if (classList.contains('min-card-del-btn')) {
    pendingIngManager.removeIngredient(dataset.ingId);
  }

  if (classList.contains('min-card-edit-btn')) {
    // get the pending ingredient data
    const pendingIng = pendingIngManager.getPendingIng(dataset.ingId);
    // populate the ing form
    populateRecipeIngForm(pendingIng);
  }
});

function populateRecipeIngForm(ingUsed) {
  const { id, quantityUsed, unitUsed } = ingUsed;
  const { name } = ingredientsManager.getIngredient(id);

  selectIng.value = name;
  ingQuantityUsed.value = quantityUsed;
  ingUnitUsed.value = unitUsed;
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
