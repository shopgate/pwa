import { createSelector } from 'reselect';
import find from 'lodash/find';
import { getProductVariants } from '@shopgate/pwa-common-commerce/product';

/**
 * Creates a selector that retrieves a product by a characteristic.
 * @returns {Function}
 */
export function makeGetProductByCharacteristic() {
  return createSelector(
    (_, props) => props.characteristic,
    getProductVariants,
    (characteristic, variants) => {
      if (!characteristic || !variants || !variants.products || variants.products.length === 0) {
        return null;
      }

      const product = find(variants.products, { characteristics: characteristic });

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
export function makeGetCharacteristicFeaturedImage() {
  const getProductByCharacteristic = makeGetProductByCharacteristic();

  return createSelector(
    getProductByCharacteristic,
    (product) => {
      if (!product || !product.featuredImageUrl) {
        return null;
      }

      return product.featuredImageUrl;
    }
  );
}
