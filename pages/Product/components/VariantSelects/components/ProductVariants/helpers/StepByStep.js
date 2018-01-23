/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ProductVariants from './ProductVariants';

/**
 * The StepByStep product variants helper class. It implements a product characteristic selection
 * mode, in which the user has to choose the variants from "top to bottom". The selection of a
 * value within a characteristic unlocks the following one, till one of the child products can
 * be determined for the update of the product page.
 */
class StepByStep extends ProductVariants {
  /**
   * Initializes the state of the StepByStep class
   * @return {StepByStep}
   */
  init() {
    // Initialize the characteristic selection state
    super.init();

    // Unlock the first characteristic selection
    const { id } = this.selection[0] || '';
    this.unlockCharacteristicSelection(id);

    return this;
  }

  /**
   * Sets a characteristic value within a characteristic selection
   * @param {string} characteristicId A characteristic id
   * @param {string} characteristicValueId A characteristic value id
   * @return {boolean} Tells if the characteristic selection was updated
   */
  setCharacteristicValue(characteristicId, characteristicValueId) {
    // Try to update the characteristic value
    const updated = super.setCharacteristicValue(characteristicId, characteristicValueId);

    // Only proceed with the "step by step" process, if something was updated
    if (updated) {
      // Get the id of the next characteristic selection
      const nextCharacteristicId = this.getNextCharacteristicSelectionId(characteristicId);

      if (nextCharacteristicId === null) {
        // No further selections found. This means, a new product can be selected to display
        const products = this.filterProducts(
          this.getCharacteristicsForProductFilter(characteristicId)
        );

        // Update the product to the new id
        this.setProductId(products[0].id);
      } else {
        // As long as not characteristic selection is completed, no product will be picked
        this.setProductId();

        // Unlock the next characteristic selection for the user
        this.unlockCharacteristicSelection(nextCharacteristicId);
      }
    }

    return updated;
  }

  /**
   * Unlocks a characteristic selection, that is referenced by a characteristic id. It takes care,
   * that all selections after this selection are resetted to the locked state again, to keep the
   * "step by step" process. Additionally it takes care, that at characteristics with only one
   * selectable value, the value is selected automatically.
   * @private
   * @param {string} characteristicId A characteristic id
   * @return {ProductVariants}
   */
  unlockCharacteristicSelection(characteristicId) {
    // The index of the unlocked characteristic within the selection
    let unlockedSelectionIndex = null;

    this.selection = this.selection.map((characteristic, selectionIndex) => {
      let updated = { ...characteristic };

      if (unlockedSelectionIndex !== null || characteristic.id === characteristicId) {
        // Instantiate a new default characteristic selection state
        updated = this.createDefaultCharacteristicSelection(characteristic.id);

        if (characteristic.id === characteristicId) {
          // Unlock the selection
          updated.disabled = false;
          // Save the index of the unlocked characteristic
          unlockedSelectionIndex = selectionIndex;
        }
      }

      return updated;
    });

    // Update the values of the unlocked characteristic
    this.updateCharacteristicValues(characteristicId);

    if (unlockedSelectionIndex !== null) {
      /**
       * Check how many values are available to select. If there is only a single one, it
       * will be auto selected to simplify the process for the user.
       * @type {Array}
       */
      const { values } = this.selection[unlockedSelectionIndex];
      const selectableValues = values.filter(value => value.disabled === false);

      if (selectableValues.length === 1) {
        this.setCharacteristicValue(characteristicId, selectableValues[0].id);
      }
    }

    return this;
  }
}

export default StepByStep;
