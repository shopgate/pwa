import isMatch from 'lodash/isMatch';
import appConfig from '@shopgate/pwa-common/helpers/config';

const { variantSelectionMode, product: { variantPreselect } = {} } = appConfig;
const preselectVariant = variantPreselect || parseInt(variantSelectionMode, 10) === 1;

/**
 * Returns the index of a particular characteristic from a set of characteristics.
 * @param {Array} characteristics The characteristics of a product.
 * @param {number} characteristicId The id of the characteristic to find.
 * @return {number}
 */
export function findSelectionIndex(characteristics, characteristicId) {
  return characteristics.findIndex(char => char.id === characteristicId);
}

/**
 * Returns true if the characteristic at the given index is the next characteristic to be selected.
 * @param {Array} characteristics The characteristics of a product.
 * @param {number} index The index of the characteristic to check.
 * @return {boolean}
 */
export function isCharacteristicEnabled(characteristics, index) {
  if (index === 0) {
    return true;
  }

  return !!Object.values(characteristics)[index - 1];
}

/**
 * Returns the selected value by characteristic ID.
 * @param {string} charId The characteristic ID.
 * @param {Object} characteristics The already selected characteristics.
 * @return {string|null}
 */
export function getSelectedValue(charId, characteristics) {
  return characteristics[charId] ? characteristics[charId] : null;
}

/**
 * Prepares the new state after a selection has been made.
 * @param {string} id The selection ID
 * @param {string} value The selection value.
 * @param {Object} selections The selections stored in the state.
 * @param {Array} characteristics The characteristics of a product.
 * @param {Array} products All available products.
 * @return {Object}
 */
export function prepareState(id, value, selections, characteristics, products) {
  const updateValid = !!characteristics.find(({ id: cId, values }) => {
    if (cId !== id) {
      return false;
    }
    return !!values.find(({ id: vId }) => vId === value);
  });

  if (!updateValid) {
    // Input parameters are invalid.
    return selections;
  }

  // Merge the just changed value into the previous selection.
  const currentSelection = {
    ...selections,
    [id]: value,
  };

  /**
   * Determine if there are products for the current user selection.
   */
  const matches = products.filter(product => (
    isMatch(product.characteristics, currentSelection)
  ));

  if (matches.length === 1) {
    // Product found for the current selection.
    return { ...matches[0].characteristics };
  }

  if (!selections[id]) {
    // Changed value wasn't set before.
    return currentSelection;
  }

  // Find the current index.
  const index = findSelectionIndex(characteristics, id);

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
}

/**
 * Preselect characteristics for variant
 * or pre-select the first available product
 * @param {string} [variantId=null] The selected variant
 * @param {{products: Object[], characteristics: Object[]}} [variants=null] All possible variants.
 * @return {Object}
 */
export function selectCharacteristics({ variantId, variants = {} }) {
  if (!variants || !variants.products || !variants.products.length) {
    return {};
  }

  if (variantId) {
    const variant = variants.products.find(product => product.id === variantId) || {};
    return { ...variant.characteristics };
  }

  // If product has only 1 variant preselect no matter if "preselect" is chosen or not.
  if (variants.products.length === 1) {
    return { ...variants.products[0].characteristics };
  }

  // Pre-selection is off
  if (!preselectVariant) {
    return {};
  }

  // Find the first selectable product by characteristics
  return variants.characteristics.reduce((acc, char) => {
    // Find the first char value with selectable products
    const firstVal = char.values.find((val) => {
      // eslint-disable-next-line extra-rules/no-single-line-objects
      const source = { ...acc, [char.id]: val.id };
      return variants.products.filter(p => (
        isMatch(p.characteristics, source)
      )).length > 0;
    });

    if (!firstVal) {
      return acc;
    }
    // eslint-disable-next-line extra-rules/no-single-line-objects
    return { ...acc, [char.id]: firstVal.id };
  }, {});
}
