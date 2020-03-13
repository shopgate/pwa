// @flow
import { useEffect } from 'react';
import { isProductAvailable } from '../../helpers';
import {
  MULTI_LINE_RESERVE,
  QUICK_RESERVE,
  DIRECT_SHIP,
  STAGE_RESERVE_FORM,
} from '../../constants';
import { FulfillmentSheet } from '../FulfillmentSheet';
import { FulfillmentPathSelector } from '../FulfillmentPathSelector';
import { type FulfillmentPath } from '../../locations.types';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';

/**
 * Opens the fulfillment path selector and returns a promise that resolves after selection.
 * @returns {Promise}
 */
function promisifiedFulfillmentPathSelector(): Promise<FulfillmentPath> {
  return new Promise((resolve) => {
    FulfillmentPathSelector.open((selectedPath: FulfillmentPath) => {
      resolve(selectedPath);
    });
  });
}

/**
 * Interject add to cart flow.
 * @param {Object} props The component props.
 * @property {Object} props.location The selected location.
 * @property {Conditioner} props.conditioner conditioner.
 * @property {string[]} props.fulfillmentPaths fulfillmentPaths
 * @property {string} props.userFulfillmentMethod The currenly selected fulfillment
 * method of the user.
 * @returns {JSX}
 */
export function FulfillmentSelectorAddToCart() {
  const {
    location, selectedLocation, disabled, conditioner, fulfillmentPaths, userFulfillmentMethod,
  } = useFulfillmentSelectorState();

  const usedLocation = selectedLocation || location;

  // Add to cart effect to validate inventory
  useEffect(() => {
    // Add most late conditioner
    conditioner.addConditioner('fulfillment-inventory', async () => {
      if (disabled || !usedLocation) {
        return false;
      }

      // Allow direct ship item
      if (userFulfillmentMethod === DIRECT_SHIP) {
        return true;
      }

      if (!isProductAvailable(usedLocation)) {
        return false;
      }

      if (fulfillmentPaths.length > 1) {
        const selectedPath = await promisifiedFulfillmentPathSelector();

        if (selectedPath === '') {
          return false;
        }

        if (selectedPath === MULTI_LINE_RESERVE) {
          return true;
        }

        if (selectedPath === QUICK_RESERVE) {
          FulfillmentSheet.open({
            stage: STAGE_RESERVE_FORM,
            fulfillmentPath: selectedPath,
          });
          return false;
        }

        return false;
      }

      if (!fulfillmentPaths.includes(MULTI_LINE_RESERVE)) {
        // Open reservation form. Stop adding to a cart
        FulfillmentSheet.open({
          stage: STAGE_RESERVE_FORM,
        });
        return false;
      }

      return isProductAvailable(usedLocation);
    }, 100);

    return () => conditioner.removeConditioner('fulfillment-inventory');
  }, [conditioner, fulfillmentPaths, userFulfillmentMethod, disabled, usedLocation]);

  return null;
}
