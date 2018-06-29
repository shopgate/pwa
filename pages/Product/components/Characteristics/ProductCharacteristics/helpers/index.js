/**
 * Resets any characteristics inside a selection that come after the given index.
 * @param {Array} characteristics The characteristics of a product.
 * @param {Object} selection The current selected characteristics.
 * @param {number} index The index to reset the selection to.
 * @return {Object}
 */
export const reduceSelection = (characteristics, selection, index) => {
  const currentSelection = selection;

  /**
   * When the given index is the same as the complete set
   * of characteristics then there is nothing to reset.
   */
  if (index === (characteristics.length - 1)) {
    return currentSelection;
  }

  // Find the selections after the given index.
  const after = characteristics.slice(index + 1);

  // Delete the found selections.
  after.forEach((item) => {
    delete currentSelection[item.id];
  });

  return currentSelection;
};

/**
 * Returns the index of a particular characteristic from a set of characteristics.
 * @param {Array} characteristics The characteristics of a product.
 * @param {number} characteristicId The id of the characteristic to find.
 * @return {number}
 */
export const findSelectionIndex = (characteristics, characteristicId) => {
  const target = characteristics.findIndex(char => char.id === characteristicId);

  if (!target) {
    return -1;
  }

  return target;
};

/**
 * Returns true if the characteristic at the given index is the next characteristic to be selected.
 * @param {Array} characteristics The characteristics of a product.
 * @param {number} index The index of the characteristic to check.
 * @return {boolean}
 */
export const isCharacteristicEnabled = (characteristics, index) => {
  if (index === 0) {
    return true;
  }

  return !!Object.values(characteristics)[index - 1];
};
