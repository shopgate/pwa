// @flow
import {
  availabilityTypes,
  AVAILABILITY_TYPE_NOT_AVAILABLE,
  AVAILABILITY_TYPE_AVAILABLE,
} from '../../product/constants';
import { type MerchantSettings } from '../../core/config/config.types';
import { type Location } from '../locations.types';

/**
 * Takes the location stock info settings and finds the matching settings for the given inventory.
 * @param {Object} settings The settings find a match in.
 * @param {Object|null} location The location object.
 * @returns {Object}
 */
export default (settings: MerchantSettings, location: Location = {}) => {
  const { productInventory } = location;
  if (!productInventory) {
    return {};
  }

  const { isAvailable = false, visible = 0 } = productInventory;
  if (isAvailable === false) {
    return settings[AVAILABILITY_TYPE_NOT_AVAILABLE];
  }

  if (visible === null) {
    return {
      ...settings[AVAILABILITY_TYPE_AVAILABLE],
      availabilityText: 'locations.stock_info.available',
    };
  }

  // Filter by inventory blind and visible inventory (must match both).
  const matchingTypes = availabilityTypes
    .filter(type => (
      // When inventory blind is set in the current availability setting, then this should also
      // account for the inventory blind from the given store. Ignore inventory blind otherwise.
      !settings[type].includeInventoryBlind ||
      (settings[type].includeInventoryBlind && !!visible)
    ))
    .filter(type => (
      // Don't filter, when inventoryBlind filter is already active
      settings[type].includeInventoryBlind || (
        // Also, inventory must be truthy or 0, or otherwise there is nothing to search for.
        visible >= settings[type].visibleInventoryFrom &&
        (settings[type].visibleInventoryTo === null ||
          visible <= settings[type].visibleInventoryTo)
      )
    ));

  if (matchingTypes.length > 0) {
    return settings[matchingTypes[0]];
  }

  return {};
};
