import { createIngMinCard } from './recipes-ui';

const recipeCardTemp = document.querySelector('.recipe-card-template');

export function createRecipeCard(recipeObj) {
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
    createIngMinCard(ingredientObj, ingList);
  });

  return recipeCard;
}
