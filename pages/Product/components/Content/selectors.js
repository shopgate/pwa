import { createSelector } from 'reselect';
import { getProductVariants } from '@shopgate/pwa-common-commerce/product/selectors/product';

export const getCharacteristics = createSelector(
  getProductVariants,
  (variants) => {
    if (!variants) {
      return null;
    }

    return variants.characteristics.reduce((acc, current) => {
      const accumulator = acc;

      accumulator[current.id] = current.value;

      return accumulator;
    }, {});
  }
);
