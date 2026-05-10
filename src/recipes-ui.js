import { observer } from './observer';
import { ingredientsClass } from './storage/ingredients';
import { recipesClass } from './storage/recipes';

// ========================
// DOM REFERENCES (static)
// ========================

const addIngToRecipeBtn = document.querySelector('.add-ing-recipe-btn');
const addRecipeBtn = document.querySelector('.add-recipe-btn');
const recipeName = document.querySelector('.recipe-name');

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
