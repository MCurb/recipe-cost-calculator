import convert from 'convert';
import { observer } from './observer';
import { ingredientsClass } from './storage/ingredients';
import { recipesClass } from './storage/recipes';

// ========================
// DOM REFERENCES (static)
// ========================

const addIngToRecipeBtn = document.querySelector('.add-ing-recipe-btn');
const addRecipeBtn = document.querySelector('.add-recipe-btn');
const recipeName = document.querySelector('.recipe-name');
const ingQuantityUsed = document.querySelector('.recipe-ing-quantity');
const ingUnitUsed = document.querySelector('.ing-unit-used');

const selectIng = document.querySelector('.select-ingredient');

const ingElements = new Map();

function updateIngSelect(ingredientsObj) {
  ingredientsObj.forEach((ingredient) => {
    if (ingElements.has(ingredient.id)) return;

    const ingElem = document.createElement('option');
    ingElem.textContent = ingredient.name;
    ingElem.setAttribute('value', ingredient.name);
    ingElem.dataset.id = ingredient.id;

    selectIng.appendChild(ingElem);
    ingElements.set(ingredient.id, ingElem);
  });
}

observer.subscribe(updateIngSelect);
observer.notify(ingredientsClass.getIngredientsData());

let pendingIng = [];

addIngToRecipeBtn.addEventListener('click', () => {
  const ingUsedId = selectIng.selectedOptions[0].dataset.id;
  const ingObj = ingredientsClass.getIngredient(ingUsedId);
  const { stockPrice, quantity, unit } = ingObj;

  const ingUsed = {
    ingInfo: ingObj,
    recipeUse: {
      quantityUsed: ingQuantityUsed.value,
      unitUsed: ingUnitUsed.value,
    },
  };

  const priceUnit =
    stockPrice / convert(quantity, unit).to(ingUsed.recipeUse.unitUsed);
  ingUsed.recipeUse.pricePerUnit = priceUnit;

  const priceUsed =
    ingUsed.recipeUse.quantityUsed * ingUsed.recipeUse.pricePerUnit;
  ingUsed.recipeUse.ingPriceUsed = priceUsed;

  pendingIng.push(ingUsed);
});

addRecipeBtn.addEventListener('click', () => {
  const newRecipe = {
    id: crypto.randomUUID(),
    name: recipeName.value,
    ingredientsUsed: [],
    recipeCost: 0,
  };

  pendingIng.forEach((ingredient) => {
    newRecipe.ingredientsUsed.push(ingredient);
  });

  newRecipe.ingredientsUsed.forEach((ingredient) => {
    newRecipe.recipeCost += ingredient.recipeUse.ingPriceUsed;
  });

  recipesClass.addRecipe(newRecipe);
  console.log(recipesClass.getRecipe(newRecipe.id));
});
