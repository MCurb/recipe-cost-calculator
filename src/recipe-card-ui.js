import { recipeObservers } from './observer';
import { createIngMinCard } from './ingredient-card';

const recipeCardsCont = document.querySelector('.recipe-cards-container');

const recipeCardTemp = document.querySelector('.recipe-card-template');

function createRecipeCard(recipeObj) {
  const { id, name, recipeCost, ingredientsUsed } = recipeObj;

  const recipeCard = recipeCardTemp.content.cloneNode(true);
  recipeCard.firstElementChild.dataset.recipeId = id;

  recipeCard.querySelector('.card-recipe-name').textContent = name;
  recipeCard.querySelector('.card-recipe-price').textContent =
    `${recipeCost} MXN`;
  recipeCard.querySelectorAll('button').forEach((button) => {
    button.dataset.recipeId = id;
  });
  const ingList = recipeCard.querySelector('.ing-card-list');
  ingredientsUsed.forEach((ingredientObj) => {
    ingList.appendChild(createIngMinCard(ingredientObj));
  });

  return recipeCard;
}

function updateRecipeCardsCont(recipes) {
  recipeCardsCont.innerHTML = '';
  recipes.forEach((recipe) => {
    recipeCardsCont.appendChild(createRecipeCard(recipe));
  });
}
recipeObservers.subscribe(updateRecipeCardsCont);
