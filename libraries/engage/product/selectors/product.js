import { createSelector } from 'reselect';
import {
  getProductPropertiesState,
  getProductId,
  getProduct,
  getProductDataById,
  getBaseProduct,
  getProductPropertiesUnfiltered,
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

/**
 * Creates the selector to get a product's effectivity dates.
 * @returns {Function}
 */
export function makeGetProductEffectivityDates() {
  return createSelector(
    getProduct,
    (product) => {
      if (!product) {
        return null;
      }
      const { startDate, endDate } = product;
      return startDate || endDate
        ? {
          startDate,
          endDate,
        }
        : null;
    }
  );
}

/**
 * Creates a selector to return product characteristics.
 * @returns {Function}
 */
export function makeGetProductCharacteristics() {
  return createSelector(
    getProductDataById,
    product => ((!product || !product.characteristics) ? null : product.characteristics)
  );
}

/**
 * Creates a selector to return product featured media.
 * @returns {Function}
 */
export function makeGetProductFeaturedMedia() {
  return createSelector(
    getProduct,
    (product) => {
      if (!product) {
        return null;
      }

      return !product.featuredMedia ? null : product.featuredMedia;
    }
  );
}

/**
 * Creates a selector to indicate if a product is active.
 * @returns {Function}
 */
export const makeIsProductActive = () => createSelector(
  getProduct,
  (product) => {
    if (!product) {
      return false;
    }

    return product.active || false;
  }
);

/**
 * Creates a selector to indicate if the base product is active.
 * @returns {Function}
 */
export const makeIsBaseProductActive = () => createSelector(
  getBaseProduct,
  (baseProduct) => {
    if (!baseProduct) {
      return false;
    }

    return baseProduct.active || false;
  }
);

/**
 * Creates a selector to get the property of a product based on a given label
 * @returns {Function}
 */
export const getCurrentProductPropertyByLabel = createSelector(
  getProductPropertiesUnfiltered,
  (state, props) => props.widgetSettings,
  (currentProductProperties, widgetSettings) => {
    if (!widgetSettings || !widgetSettings.propertyLabel) {
      return null;
    }

    return currentProductProperties
      .find(({ label: l }) => l === widgetSettings.propertyLabel);
  }
);
