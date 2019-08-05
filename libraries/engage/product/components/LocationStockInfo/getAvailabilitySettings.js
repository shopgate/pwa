import { availabilityTypes } from '../../constants';

/**
 * Takes the location stock info settings and finds the matching settings for the given inventory.
 * @param {Object} settings The settings find a match in.
 * @param {number|null} visibleInventory The visible inventory defines, which settings to use.
 * @param {number|null} inventoryBlind The blind inventory defines as well, which settings to use.
 * @returns {Object}
 */
export default (settings, visibleInventory, inventoryBlind) => {
  let matchingTypes;
  if (visibleInventory === null) {
    // Since no availability is given, check if any types are configured to be filtered by that.
    matchingTypes = availabilityTypes.filter(type => (
      !!type.includeNoRecordStores
    ));

    if (matchingTypes.length > 0) {
      return settings[matchingTypes[0]];
    }
  }

  // Filter by inventory blind and visible inventory (must match both).
  matchingTypes = availabilityTypes.filter(type => (
    // When inventory blind is set in the current availability setting, then this should also
    // account for the inventory blind from the given store. Ignore inventory blind otherwise.
    !settings[type].includeInventoryBlind ||
      (settings[type].includeInventoryBlind && !!inventoryBlind)
  )).filter(type => (
    // Don't filter, when inventoryBlind filter is already active
    settings[type].includeInventoryBlind || (
      // Also, inventory must be truthy or 0, or otherwise there is nothing to search for.
      visibleInventory >= settings[type].visibleInventoryFrom &&
      (settings[type].visibleInventoryTo === null ||
        visibleInventory <= settings[type].visibleInventoryTo)
    )
  ));

  if (matchingTypes.length > 0) {
    return settings[matchingTypes[0]];
  }

  return {};
};
