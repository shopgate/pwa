/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  AVAILABILITY_STATE_OK,
  AVAILABILITY_STATE_WARNING,
  AVAILABILITY_STATE_ALERT,
} from 'Components/Availability/constants';

/**
 * Used to filter products by characteristics.
 * @typedef {Object} ProductFilter
 * @property {string} id A characteristic id
 * @property {string} valueId A characteristic value id
 */

/**
 * Used to filter products by characteristics.
 * @typedef {ProductFilter[]} ProductFilterList
 */

/**
  * The availability levels of product variants, used to set the correct availability info message
  * if multiple products are associated with a given characteristic value.
  */
const availabilityLevels = {
  [AVAILABILITY_STATE_OK]: 0,
  [AVAILABILITY_STATE_WARNING]: 1,
  [AVAILABILITY_STATE_ALERT]: 2,
};

/**
 * Basic class for ProductVariants helpers
 */
class ProductVariants {
  /**
   * The constructor of the ProductVariants class
   * @param {Object} variants A getProductVariants pipeline response
   * @param {Array} variants.products The product list from the pipeline response
   * @param {Array} variants.characteristics The characteristics list from the pipeline response
   */
  constructor(variants = {}) {
    this.products = variants.products || [];
    this.characteristics = variants.characteristics || [];

    this.productId = null;
    this.selection = [];
  }

  /**
   * Initializes the selection state of the ProductVariants class.
   * Should be called by inheriting classes after calling super().
   * @return {ProductVariants}
   */
  init() {
    this.selection = this.characteristics.map(characteristic =>
      this.createDefaultCharacteristicSelection(characteristic.id)
    );

    return this;
  }

  /**
   * Gets the currently selected product id
   * @return {string|null} The product id
   */
  getProductId() {
    return this.productId;
  }

  /**
   * Sets a product id
   * @protected
   * @param {string|null} [productId=null] The new product id.
   * @return {ProductVariants}
   */
  setProductId(productId = null) {
    this.productId = productId;
    return this;
  }

  /**
   * Gets the current characteristics selection
   * @return {Array|null} The selection or null, if the selection is empty
   */
  getSelection() {
    return this.selection.length ? this.selection : null;
  }

  /**
   * Sets a characteristic value within a characteristic selection
   * @param {string} characteristicId A characteristic id
   * @param {string} characteristicValueId A characteristic value id
   * @return {boolean} Tells if the characteristic selection was updated
   */
  setCharacteristicValue(characteristicId, characteristicValueId) {
    let selectionWasUpdated = false;

    this.selection = this.selection.map((characteristic) => {
      const updated = { ...characteristic };
      const { id, disabled, selected, values } = characteristic;

      if (id === characteristicId && disabled === false) {
        // If the requested characteristic is enabled for change, we start searching for the value
        const characteristicValue = values.find(
          value => value.id === characteristicValueId && value.disabled === false
        );

        if (characteristicValue) {
          // Only update the characteristic, if it's really necessary
          if (selected === false || characteristicValue.selected === false) {
            /**
             * If the requested value is enabled for change, update the selected state of the
             * characteristic and update it's value with the label of the characteristic value.
             * @type {Boolean}
             */
            updated.selected = true;
            updated.value = characteristicValueId;

            // Update the selected property of the characteristic values
            updated.values = characteristic.values.map(value => ({
              ...value,
              selected: value.id === characteristicValueId,
            }));

            selectionWasUpdated = true;
          }
        }
      }

      return updated;
    });

    return selectionWasUpdated;
  }

  /**
   * Returns the id of the characteristic within the characteristic selection state, that comes
   * after the one, which is referenced by the function parameter
   * @protected
   * @param {string} characteristicId The id of a characteristic
   * @return {string|null} A characteristic id on success, NULL on failure
   */
  getNextCharacteristicSelectionId(characteristicId) {
    // Get the index of the characteristic within the selection state
    const index = this.selection.findIndex(
      characteristic => characteristic.id === characteristicId
    );

    // Get the next characteristic
    const nextCharacteristic = this.selection[index + 1];
    return nextCharacteristic ? nextCharacteristic.id : null;
  }

  /**
   * Creates a default characteristic selection state. This state reflects a deactivated
   * selection, and contains all available characteristic values in a deactivated state.
   * @protected
   * @param {string} characteristicId The id of the characteristic
   * @return {Object} The characteristic selection state
   */
  createDefaultCharacteristicSelection(characteristicId) {
    // Get the desired characteristic settings from the variants pipeline response data
    const source = this.characteristics.find(
      characteristic => characteristic.id === characteristicId
    );

    return {
      ...source,
      value: null,
      disabled: true,
      selected: false,
      values: source.values.map(value => ({
        ...value,
        disabled: true,
        selected: false,
        availability: null,
      })),
    };
  }

  /**
   * Updates the values for a characteristic within the selection. It adjusts the disabled state
   * based on the availability of products that have matching characteristics.
   * @protected
   * @param {string} characteristicId A characteristic id
   * @return {ProductVariants}
   */
  updateCharacteristicValues(characteristicId) {
    const numberOfCharacteristics = this.selection.length;

    this.selection = this.selection.map((characteristic, index) => {
      const lastOne = numberOfCharacteristics === index + 1;
      const updated = { ...characteristic };

      if (characteristic.id === characteristicId) {
        /**
         * The characteristic selection that shall be unlocked was found. First get all products
         * which characteristics match the completed selections.
         * @type {Array}
         */
        const products = this.filterProducts(
          this.getCharacteristicsForProductFilter(characteristicId)
        );

        // Create the characteristic selection values
        updated.values = updated.values.map((value) => {
          /**
           * Dynamically create a ProductFilterList definition
           * for the current selection and it's value.
           * @type {Array}
           */
          const productFilter = [
            {
              id: updated.id,
              valueId: value.id,
            },
          ];

          /**
           * Filter the products from the upper scope furthermore
           * to find all products that match the value for the current loop.
           * @type {Array}
           */
          const productsForValue = this.filterProducts(productFilter, products);

          /**
           * Get the availability state for this characteristic.
           */
          let availability =
            productsForValue.reduce((currentAvailability, product) => {
              const result = product.availability;
              if (
                currentAvailability === null ||
                availabilityLevels[result.state] <= availabilityLevels[currentAvailability.state]
              ) {
                return result;
              }
              return currentAvailability;
            }, null);

          /**
           * Only keep availability if it's an alert, or on the last select also warnings.
           * Never keep oks.
           */
          if (availability) {
            const isOk = availability.state === AVAILABILITY_STATE_OK;
            const isAlert = availability.state === AVAILABILITY_STATE_ALERT;

            if (isOk || !(isAlert || lastOne)) {
              availability = null;
            }
          }

          return {
            ...value,
            disabled: !productsForValue.length,
            availability,
          };
        });
      }

      return updated;
    });

    return this;
  }

  /**
   * Creates a list of characteristics for product filtering. It will contain a combination of
   * characteristic id and the selected value id for each characteristic till the
   * one with a designated id.
   * @protected
   * @param {string} characteristicId The id of the last characteristic
   * @return {ProductFilterList} The characteristics list
   */
  getCharacteristicsForProductFilter(characteristicId) {
    let aborted = false;
    const characteristics = [];

    this.selection.forEach((characteristic) => {
      if (aborted === false) {
        const { id, selected, values } = characteristic;
        const selectedValue = values.find(value => value.selected === true);

        if (selected === true && selectedValue) {
          // The characteristic is selected and a selected value was found - create an entry.
          characteristics.push({
            id,
            valueId: selectedValue.id,
          });

          // Abort the loop when the designated characteristic id was reached
          aborted = id === characteristicId;
        } else {
          // The current characteristic is not selected, so there wouldn't further selected ones
          aborted = true;
        }
      }
    });

    return characteristics;
  }

  /**
   * Filters a list of products by a list of characteristics. If no characteristics are passed,
   * all available products will be returned.
   * @protected
   * @param {ProductFilterList} filter The characteristics for filtering
   * @param {Array} [products] A custom list of products for filtering. If empty, the products
   *   from the variants are used for filtering.
   * @return {Array} The filtered product list
   */
  filterProducts(filter, products) {
    // Initialize the product list
    let filteredProducts = [...(products || this.products)];

    if (Array.isArray(filter)) {
      // Loop through the passed characteristics
      filter.forEach((productFilter) => {
        const { id, valueId } = productFilter;

        // Filter all products that have a match for the current characteristic
        filteredProducts = filteredProducts.filter((product) => {
          const { characteristics } = product;
          return characteristics.hasOwnProperty(id) && characteristics[id] === valueId;
        });
      });
    }

    return filteredProducts;
  }
}

export default ProductVariants;
