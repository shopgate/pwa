import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  PROPERTIES_FILTER_BLACKLIST,
  PROPERTIES_FILTER_WHITELIST,
} from '@shopgate/pwa-common-commerce/product/constants';

/**
 * Reads the setting for product properties whitelisting/blacklisting
 * and filters the properties accordingly.
 * @param {Array} properties Array of properties with label and value attributes.
 * @return {Array} Filtered properties.
 */
export function filterProperties(properties) {
  // If there is no setting, we won't filter
  if (!appConfig || !appConfig.productPropertiesFilter) {
    return properties;
  }

  return properties.filter(({ label, type }) => {
    const inList = appConfig.productPropertiesFilter.properties.indexOf(label) !== -1;

    if (appConfig.productPropertiesFilter.type === PROPERTIES_FILTER_WHITELIST) {
      // Show item if allowed in whitelist
      return inList;
    }

    if (appConfig.productPropertiesFilter.type === PROPERTIES_FILTER_BLACKLIST) {
      // Hide item if not allowed in blacklist
      return !inList;
    }

    if (type && type !== 'simple') {
      return false;
    }

    return true;
  });
}
