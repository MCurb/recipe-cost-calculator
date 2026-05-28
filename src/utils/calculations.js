import convert from 'convert';

export function calculateIngPrices(recipeIngInfo) {
  const { stockPrice, quantity, unit, quantityUsed, unitUsed } = recipeIngInfo;

  const unitPrice = calculateUnitCost(stockPrice, quantity, unit, unitUsed);
  const totalIngCost = calculateIngCost(quantityUsed, unitPrice);

  return { unitPrice, totalIngCost };
}

function calculateUnitCost(price, quantity, unit, targetUnit) {
  let unitPrice;

  if (unit === 'pieces') {
    unitPrice = price / quantity;
    return unitPrice;
  }

  unitPrice = price / convert(quantity, unit).to(targetUnit);
  return unitPrice;
}

function calculateIngCost(quantity, unitPrice) {
  return quantity * unitPrice;
}
