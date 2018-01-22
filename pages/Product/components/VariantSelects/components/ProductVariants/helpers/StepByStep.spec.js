/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import StepByStepHelper from './StepByStep';
import mockData from './StepByStep.mock';

/**
 * Creates the next expected state after a selection change. It merges the current state data with
 * data that is located within the state updates. So the update data only has to contain the
 * changed values which reduces the size if the test data.
 * @param {Array} currentState The current state
 * @param {Array} stateUpdates The required updates for the next state
 * @return {Array} The updated state
 */
const createNextExpectedState = (currentState, stateUpdates) => {
  /**
   * Creates characteristic values and applies updates if available.
   * @param {Array} currentValues The current values
   * @param {Array} [valueUpdates=[]] The related updates
   * @return {Array} The updated values
   */
  const createCharacteristicValues = (currentValues, valueUpdates = []) =>
    currentValues.map((value) => {
      let result;

      // Search for updates for the current characteristic value
      const update = valueUpdates.find(updatedValue => updatedValue.id === value.id);

      if (!update) {
        // No update available - nothing to do
        result = { ...value };
      } else {
        // Apply the update to the current characteristic value
        result = {
          ...value,
          ...update,
        };
      }

      return result;
    });

  // Loop through the characteristics within the current state and apply the updates
  return currentState.map((characteristic) => {
    let result;

    // Search for updates for the current characteristic
    const update = stateUpdates.find(stateUpdate => stateUpdate.id === characteristic.id);

    if (!update) {
      // No update available - nothing to do
      result = { ...characteristic };
    } else {
      // Apply the update to the current characteristic
      result = {
        ...characteristic,
        ...update,
        values: createCharacteristicValues(characteristic.values, update.values),
      };
    }

    return result;
  });
};

describe('ProductVariants StepByStep helper', () => {
  describe('basic tests', () => {
    it('should create an empty selection when no variants are null', () => {
      // Create a new instance of the helper
      const instance = new StepByStepHelper()
        .init();

      expect(instance.getSelection()).toEqual(null);
      expect(instance.getProductId()).toEqual(null);
    });

    it('should create an empty selection when the variants response was created for a product without variants', () => {
      const response = {
        products: [],
        characteristics: [],
      };

      // Create a new instance of the helper
      const instance = new StepByStepHelper(response)
        .init();

      expect(instance.getSelection()).toEqual(null);
      expect(instance.getProductId()).toEqual(null);
    });
  });

  // Run the product tests
  mockData.forEach((selectionTest) => {
    // Create a new instance of the helper
    const instance = new StepByStepHelper(selectionTest.response).init();

    // Initialize the expected state with the initial state
    let expectedState = selectionTest.initialState;

    describe(`${selectionTest.name} (id: ${selectionTest.productId})`, () => {
      it('initializes properly', () => {
        // Compare the selection state and check if the productId fits the expectations
        expect(instance.getSelection()).toEqual(expectedState);
        expect(instance.getProductId()).toEqual(selectionTest.initialProductId);
      });

      // Start checking selection changes
      selectionTest.updates.forEach((update) => {
        describe(update.name, () => {
          it('update successful', () => {
            // Update the selection value
            instance.setCharacteristicValue(update.id, update.valueId);

            // Create the new expected state
            expectedState = createNextExpectedState(expectedState, update.changes);

            // Compare the selection state and check if the productId fits the expectations
            expect(instance.getSelection()).toEqual(expectedState);
            expect(instance.getProductId()).toEqual(update.productId);
          });
        });
      });
    });
  });
});
