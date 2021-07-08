import { setABFeatureFlag, isFeatureEnabled } from '@shopgate/engage/core';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { getProductListShowInventory } from '../../core/selectors';

const STORE_KEY = 'showInventoryInLists.v1';
let enabled = null;

/**
 * @param {Object} state state
 * @returns {boolean}
 */
export function showInventoryInLists(state) {
  const config = getProductListShowInventory(state);

  if (!config) {
    return false;
  }

  if (enabled === null) {
    // activate feature for x percent of user
    const percentage = appConfig?.featureFlagPercentages?.showInventoryInLists || 5;
    enabled = isFeatureEnabled(STORE_KEY, percentage);
  }

  return enabled;
}

/**
 * @param {Object} state state
 */
export function setShowInventoryInLists(state) {
  const config = getProductListShowInventory(state);

  if (!config) {
    return;
  }

  setABFeatureFlag(STORE_KEY);
}

