/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  PROPERTIES_FILTER_BLACKLIST,
  PROPERTIES_FILTER_WHITELIST,
} from '../constants/';

/**
 * Calculates the percentage discount for two unit prices.
 * @param {number} price The current price.
 * @param {number} priceOld The old price.
 * @return {number} The discount.
 */
export const calcDiscount = (price, priceOld) => {
  const savedAmount = priceOld - price;
  const discount = Math.round((savedAmount / priceOld) * 100);
  return (discount > 0) ? discount : 0;
};

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
