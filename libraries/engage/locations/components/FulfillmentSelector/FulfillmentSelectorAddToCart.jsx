import { useEffect } from 'react';
import { isProductAvailable } from '../../helpers';
import {
  MULTI_LINE_RESERVE,
  QUICK_RESERVE,
  DIRECT_SHIP,
  ROPIS,
  BOPIS,
  STAGE_RESERVE_FORM,
} from '../../constants';
import { FulfillmentSheet } from '../FulfillmentSheet';
import { FulfillmentPathSelector } from '../FulfillmentPathSelector';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';

/** @typedef {import('../../locations.types').FulfillmentPath} FulfillmentPath */

/**
 * Opens the fulfillment path selector and returns a promise that resolves after selection.
 * @returns {Promise<FulfillmentPath>} A promise resolving to the selected fulfillment path.
 */
const promisifiedFulfillmentPathSelector = () => new Promise((resolve) => {
  FulfillmentPathSelector.open((selectedPath) => {
    resolve(selectedPath);
  });
});

/**
 * Interject add to cart flow.
 * @returns {JSX.Element|null} The rendered component or null.
 */
export const FulfillmentSelectorAddToCart = () => {
  const {
    preferredLocation,
    inventory,
    selectedLocation,
    conditioner,
    fulfillmentPaths,
    selection,
    isDirectShipEnabled,
    isROPISEnabled,
    isBOPISEnabled,
  } = useFulfillmentSelectorState();

  const usedLocation = selectedLocation || preferredLocation;

  useEffect(() => {
    conditioner.addConditioner('fulfillment-inventory', async () => {
      if (isDirectShipEnabled && selection === DIRECT_SHIP) {
        return true;
      }

      const mapping = {
        [DIRECT_SHIP]: isDirectShipEnabled,
        [ROPIS]: isROPISEnabled,
        [BOPIS]: isBOPISEnabled,
      };

      if (!selection || !mapping[selection] || !usedLocation) {
        return false;
      }

      if (!isProductAvailable(usedLocation, inventory)) {
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
        FulfillmentSheet.open({
          stage: STAGE_RESERVE_FORM,
        });
        return false;
      }

      return isProductAvailable(usedLocation, inventory);
    }, 100);

    return () => conditioner.removeConditioner('fulfillment-inventory');
  }, [
    conditioner,
    fulfillmentPaths,
    selection,
    usedLocation,
    isDirectShipEnabled,
    isROPISEnabled,
    isBOPISEnabled,
    inventory,
  ]);

  return null;
};

