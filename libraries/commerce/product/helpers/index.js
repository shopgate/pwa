import appConfig from '@shopgate/pwa-common/helpers/config';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { bin2hex, hex2bin } from '@shopgate/pwa-common/helpers/data';
import {
  ITEM_PATH,
  PROPERTIES_FILTER_BLACKLIST,
  PROPERTIES_FILTER_WHITELIST,
  PRODUCT_RELATIONS_DEFAULT_LIMIT,
} from '../constants';
import { SHOPGATE_CATALOG_GET_PRODUCT_RELATIONS } from '../constants/Pipelines';

/**
 * Reads the setting for product properties whitelisting/blacklisting
 * and filters the properties accordingly.
 * @param {Array} properties Array of properties with label and value attributes.
 * @return {Array} Filtered properties.
 */
export const filterProperties = (properties) => {
  // If there is no setting, we won't filter
  if (!appConfig || !appConfig.productPropertiesFilter) {
    return properties;
  }

  return properties.filter(({ label }) => {
    const inList = appConfig.productPropertiesFilter.properties.indexOf(label) !== -1;

    if (appConfig.productPropertiesFilter.type === PROPERTIES_FILTER_WHITELIST) {
      // Show item if allowed in whitelist
      return inList;
    }

    if (appConfig.productPropertiesFilter.type === PROPERTIES_FILTER_BLACKLIST) {
      // Hide item if not allowed in blacklist
      return !inList;
    }

    return true;
  });
};

/**
 * Generates getProductRelations hash based on productId, type and given limit.
 * It is used in both action and selectors.
 * @param {string} productId Product Id.
 * @param {string} type Type - see `../constants`.
 * @param {number} limit Limit.
 * @returns {string}
 */
export const generateProductRelationsHash = ({
  productId,
  type,
  limit = PRODUCT_RELATIONS_DEFAULT_LIMIT,
}) => generateResultHash({
  pipeline: SHOPGATE_CATALOG_GET_PRODUCT_RELATIONS,
  productId,
  type,
  limit,
}, false, false);

/**
 * Generate product route for navigation.
 * @param {string} id Product Id.
 * @returns {string}
 */
export const getProductRoute = id => `${ITEM_PATH}/${bin2hex(id)}`;

/**
 * Transform product route.
 * @param {Object} route item route to transform.
 * @returns {Object}
 */
export const transformRoute = (route) => {
  if (!route.params.productId || route.state.productId) {
    return route;
  }

  return {
    ...route,
    state: {
      ...route.state,
      productId: hex2bin(route.params.productId),
    },
  };
};
