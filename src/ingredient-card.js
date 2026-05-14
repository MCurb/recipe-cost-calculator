const ingCardTemplate = document.querySelector('.ingredient-card-template');

export function createIngCardUI(ingredientObj) {
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
