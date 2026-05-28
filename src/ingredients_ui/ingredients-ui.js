import {
  ingredientsManager,
  spanishUnitType,
  unitType,
} from '../internal_state/ingredients';
import { isFormUpdating } from '../utils/observer';

// === Ingredient Section References ===

// --- Containers ---
const ingCardsContainer = document.querySelector('.ing-cards-container');
const ingForm = document.querySelector('.ingredient-form');

// --- Inputs ---
const ingName = document.querySelector('.ing-name');
const ingPrice = document.querySelector('.ing-price');
const ingQuantity = document.querySelector('.ing-quantity');
const ingUnit = document.querySelector('.ing-unit');

// --- Buttons ---
const ingFormActions = document.querySelector('.ing-form-actions');
const addIngBtn = document.querySelector('.add-ing-btn');

// === Ingredient Event Listeners ===

ingForm.addEventListener('submit', (e) => e.preventDefault());
ingFormActions.addEventListener('click', handleIngFormActions);
ingCardsContainer.addEventListener('click', handleIngCardActions);

// === Ingredient Event Handlers ===
function handleIngFormActions(e) {
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
        `No es posible cambiar la unidad del ingrediente de ${spanishUnitType[currentIng.unitType]} a ${spanishUnitType[updatedIng.unitType]}. Por favor, seleccione una unidad de ${spanishUnitType[currentIng.unitType]}.`,
      );
      return;
    }

    cleanFormInputs([ingName, ingPrice, ingQuantity]);

    ingredientsManager.updateIngredient(ingId, updatedIng);
    toggleFormActions(ingFormActions, e.target, addIngBtn);
  }
}

function handleIngCardActions(e) {
  const { classList, dataset } = e.target;
  const id = dataset.ingId;

  if (classList.contains('del-ing-btn')) {
    ingredientsManager.removeIngredient(id);
  }

  if (classList.contains('edit-ing-btn')) {
    const ingredientData = ingredientsManager.getIngredient(id);
    populateIngForm(ingredientData);
  }
}

// === Module Helpers ===
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

function populateIngForm(ingredientObj) {
  const { id, name, stockPrice, quantity, unit } = ingredientObj;

  ingName.value = name;
  ingPrice.value = stockPrice;
  ingQuantity.value = quantity;
  ingUnit.value = unit;

  let updateIngBtn = ingFormActions.querySelector('.update-ing-btn');

  // Add Update Ingredient Btn
  if (!updateIngBtn) {
    updateIngBtn = createFormBtn({
      className: 'update-ing-btn',
      text: 'Editar Ingrediente',
      datasetName: 'ing-id',
      id: id,
    });
    toggleFormActions(ingFormActions, updateIngBtn, addIngBtn);
  }

  // Sync action btn with the new ing id
  updateIngBtn.setAttribute('data-ing-id', id);
}

// === Universal Helpers === (I can send them to a utils module)
export function createFormBtn({ className, text, datasetName, id }) {
  const formBtn = document.createElement('button');
  formBtn.classList.add(className);
  formBtn.textContent = text;
  formBtn.type = 'submit';
  formBtn.setAttribute(`data-${datasetName}`, id);
  return formBtn;
}

export function cleanFormInputs(formInputs) {
  formInputs.forEach((input) => (input.value = ''));
}

export function toggleFormActions(parent, childOne, childTwo) {
  if (childOne.parentElement === parent) {
    return parent.replaceChild(childTwo, childOne);
  }
  parent.replaceChild(childOne, childTwo);
}
