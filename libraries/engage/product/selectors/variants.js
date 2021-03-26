import { createSelector } from 'reselect';
import find from 'lodash/find';
import { getProductVariants } from '@shopgate/pwa-common-commerce/product';

/**
 * Creates a selector that retrieves a product by a characteristic.
 * @returns {Function}
 */
export function makeGetProductByCharacteristics() {
  return createSelector(
    (_, props) => props.characteristics,
    getProductVariants,
    (characteristics, variants) => {
      if (!characteristics || !variants || !variants.products || variants.products.length === 0) {
        return null;
      }

      const product = find(variants.products, { characteristics });

      if (!product) {
        return null;
      }

      return product;
    }
  );
}

/**
 * Creates a selector that retrieves the featured image URL for a selected characteristic.
 * @returns {Function}
 */
export function makeGetCharacteristicsFeaturedImage() {
  const getProductByCharacteristics = makeGetProductByCharacteristics();

  return createSelector(
    getProductByCharacteristics,
    (product) => {
      if (!product || !product.featuredImageBaseUrl) {
        return null;
      }

      return product.featuredImageBaseUrl;
    }
  );
}

/**
 * Creates a selector that retrieves the featured media for a selected characteristic.
 * @returns {Function}
 */
export function makeGetCharacteristicsFeaturedMedia() {
  const getProductByCharacteristics = makeGetProductByCharacteristics();

  return createSelector(
    getProductByCharacteristics,
    (state, props) => props.type,
    (product, type) => {
      if (!product || !product.featuredMedia || (type && product.featuredMedia.type !== type)) {
        return null;
      }

      return product.featuredMedia;
    }
  );
}

/**
 * Creates a selector that retrieves the currently selected characteristics.
 * @returns {Function}
 */
export function makeGetSelectedCharacteristic() {
  return createSelector(
    getProductVariants,
    (state, props) => props.characteristics,
    (variants, characteristics) => {
      const selected = [];

      if (!variants || !characteristics) {
        return selected;
      }

      Object.keys(characteristics).forEach((key) => {
        const item = characteristics[key];
        const variant = find(variants.characteristics, { id: key });
        const value = find(variant.values, { id: item });

        selected.push({
          label: variant.label,
          value: value.label,
        });
      });

      return selected;
    }
  );
}
