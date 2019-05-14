import { createSelector } from 'reselect';
import {
  getProductPropertiesState,
  getProductId,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { filterProperties } from './helpers';

/**
 * Creates the selector to get a product's properties from the state.
 * @returns {Function}
 */
export function makeGetProductProperties() {
  return createSelector(
    getProductPropertiesState,
    getProductId,
    (properties, productId) => {
      const entry = properties[productId];

      if (!entry || !entry.properties) {
        return null;
      }

      return filterProperties(entry.properties);
    }
  );
}
