/* eslint-disable extra-rules/no-single-line-objects */
import {
  mockedState as mockedProductState,
  mockedProductMetadata,
  mockedVariantProductMetadata,
  mockedVariantMetadata,
} from '../../product/selectors/product.mock';

import {
  getFlags,
  getAddToCartMetadata,
  hasCouponSupport,
} from './index';

describe('Cart selectors', () => {
  describe('getFlags()', () => {
    it('should return an empty object if no flags are available', () => {
      const result = getFlags({ cart: {} });
      expect(result).toEqual({});
    });

    it('should return the flags if available', () => {
      const flags = {
        coupons: true,
        orderable: true,
      };

      const result = getFlags({ cart: { flags } });
      expect(result).toEqual(flags);
    });
  });

  describe('getAddToCartMetadata()', () => {
    let mockedState;

    beforeEach(() => {
      // Create a deep copy of the state to avoid unintended selector caching.
      mockedState = JSON.parse(JSON.stringify(mockedProductState));
    });

    it('should return the metadata of the variant product', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const result = getAddToCartMetadata(mockedState, { productId, variantId });
      expect(result).toEqual(mockedVariantProductMetadata);
    });

    it('should return the metadata of the base product', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      delete mockedState.product.productsById[variantId].productData.metadata;
      const result = getAddToCartMetadata(mockedState, { productId, variantId });
      expect(result).toEqual(mockedProductMetadata);
    });

    it('should return the metadata of the variant data assigned to the variant product', () => {
      const productId = 'product_1';
      const variantId = 'product_3';
      const result = getAddToCartMetadata(mockedState, { productId, variantId });
      expect(result).toEqual(mockedVariantMetadata);
    });

    it('should return null when no metadata can be determined', () => {
      const productId = 'product_10';
      const variantId = 'product_11';
      const result = getAddToCartMetadata(mockedState, { productId, variantId });
      expect(result).toBeNull();
    });
  });

  describe('hasCouponSupport()', () => {
    it('should return true if no flags are available', () => {
      const result = hasCouponSupport({ cart: {} });
      expect(result).toEqual(true);
    });

    it('should return true if the coupons flag is not available', () => {
      const result = hasCouponSupport({ cart: { flags: {} } });
      expect(result).toEqual(true);
    });

    it('should return true if the flag is true', () => {
      const result = hasCouponSupport({ cart: { flags: { coupons: true } } });
      expect(result).toEqual(true);
    });

    it('should return false if the flag is false', () => {
      const result = hasCouponSupport({ cart: { flags: { coupons: false } } });
      expect(result).toEqual(false);
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
