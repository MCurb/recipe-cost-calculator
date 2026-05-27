import { ingredientsManager, unitType } from './storage/ingredients';

// ========================
// DOM REFERENCES (static)
// ========================

// === Ingredient Form Ref ===
const ingForm = document.querySelector('.ingredient-form');
const ingFormActions = document.querySelector('.ing-form-actions');
const addIngBtn = document.querySelector('.add-ing-btn');
const ingName = document.querySelector('.ing-name');
const ingPrice = document.querySelector('.ing-price');
const ingQuantity = document.querySelector('.ing-quantity');
const ingUnit = document.querySelector('.ing-unit');

// === Ingredient Form Listeners ===

ingForm.addEventListener('submit', (e) => {
  e.preventDefault();
});

ingFormActions.addEventListener('click', (e) => {
  const { classList, dataset } = e.target;
  if (classList.contains('add-ing-btn')) {
    const newIngredient = getIngInputValues();

    cleanFormInputs([ingName, ingPrice, ingQuantity]);

    ingredientsManager.addIngredient(newIngredient);
  }
  if (classList.contains('update-ing-btn')) {
    const ingId = dataset.ingId;
    const updatedIng = getIngInputValues();
    const currentIng = ingredientsManager.getIngredient(ingId);
    if (updatedIng.unitType !== currentIng.unitType) {
      alert(
        `You cannot change the ingredient unit from ${currentIng.unitType} to ${updatedIng.unitType}. Please select a ${currentIng.unitType} unit.`,
      );
      return;
    }

    cleanFormInputs([ingName, ingPrice, ingQuantity]);

    ingredientsManager.updateIngredient(ingId, updatedIng);
    toggleFormActions(ingFormActions, e.target, addIngBtn);
  }
});

// === Ingredient Cards Listeners ===

const ingCardsContainer = document.querySelector('.ing-cards-container');

ingCardsContainer.addEventListener('click', (e) => {
  const { classList, dataset } = e.target;
  const ingId = dataset.ingId;

  if (classList.contains('del-ing-btn')) {
    ingredientsManager.removeIngredient(ingId);
  }
  if (classList.contains('edit-ing-btn')) {
    const ingObj = ingredientsManager.getIngredient(ingId);
    populateIngForm(ingObj);
  }
});

function populateIngForm(ingredientObj) {
  const { id, name, stockPrice, quantity, unit } = ingredientObj;

  ingName.value = name;
  ingPrice.value = stockPrice;
  ingQuantity.value = quantity;
  ingUnit.value = unit;

  // Toggle Form actions
  if (!ingFormActions.querySelector('.update-ing-btn')) {
    const updateIngBtn = document.createElement('button');
    updateIngBtn.classList.add('update-ing-btn');
    updateIngBtn.textContent = 'Update';
    updateIngBtn.type = 'submit';
    updateIngBtn.setAttribute('data-ing-id', id);
    toggleFormActions(ingFormActions, updateIngBtn, addIngBtn);
  }

  // Sync btn with the new ing id
  ingFormActions
    .querySelector('.update-ing-btn')
    .setAttribute('data-ing-id', id);
}

export function cleanFormInputs(formInputs) {
  formInputs.forEach((input) => (input.value = ''));
}

function toggleFormActions(parent, childOne, childTwo) {
  if (childOne.parentElement === parent) {
    return parent.replaceChild(childTwo, childOne);
  }
  parent.replaceChild(childOne, childTwo);
}

function getIngInputValues() {
  const ingObject = {
    name: ingName.value,
    stockPrice: Number(ingPrice.value),
    quantity: Number(ingQuantity.value),
    unit: ingUnit.value,
    unitType: unitType[ingUnit.value],
  };

  return ingObject;
}
