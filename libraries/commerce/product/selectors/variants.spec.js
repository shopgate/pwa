/* eslint-disable extra-rules/no-single-line-objects */
import {
  mockedState as mockedProductState,
  mockedVariantProductMetadata,
  mockedVariantMetadata,
} from './product.mock';

import {
  getSelectedVariantMetadata,
  getKnownRelatives,
} from './variants';

jest.mock('@shopgate/pwa-core/helpers', () => {
  const original = require.requireActual('@shopgate/pwa-core/helpers');

  return {
    ...original,
    logger: {
      error: jest.fn(),
    },
  };
});

describe('Variants selectors', () => {
  let mockedState;

  beforeEach(() => {
    // Create a deep copy of the state to avoid unintended selector caching.
    mockedState = JSON.parse(JSON.stringify({ ...mockedProductState }));
    jest.clearAllMocks();
  });

  describe('getSelectedVariantMetadata()', () => {
    it('should return undefined when no variant data is available at all but the variant product is there', () => {
      const productId = 'product_1';
      const variantId = 'product_3';
      delete mockedState.product.variantsByProductId;
      expect(getSelectedVariantMetadata(mockedState, { productId, variantId })).toBeUndefined();
    });

    it('should return null when no variant data is available at all an no variant product can be determined', () => {
      const productId = 'product_1';
      const variantId = 'product_10';
      delete mockedState.product.variantsByProductId;
      expect(getSelectedVariantMetadata(mockedState, { productId, variantId })).toBeNull();
    });

    it('should return null when no variant data is available for the parameters inside of the props', () => {
      const productId = 'product_1';
      const variantId = 'product_6';
      expect(getSelectedVariantMetadata(mockedState, { productId, variantId })).toBeNull();
    });

    it('should return null when no variant data is available for the referenced product ids', () => {
      const productId = 'product_8';
      const variantId = 'product_9';
      expect(getSelectedVariantMetadata(mockedState, { productId, variantId })).toBeNull();
    });

    it('should return undefined when neither the variant data, nor the variant product contains metadata', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      delete mockedState.product.productsById[variantId].productData.metadata;
      expect(getSelectedVariantMetadata(mockedState, { productId, variantId })).toBeUndefined();
    });

    it('should return null when neither the variant product is not available yet', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      delete mockedState.product.productsById[variantId];
      expect(getSelectedVariantMetadata(mockedState, { productId, variantId })).toBeNull();
    });

    it('should return metadata from the variant data', () => {
      const productId = 'product_1';
      const variantId = 'product_3';
      expect(getSelectedVariantMetadata(mockedState, { productId, variantId }))
        .toEqual(mockedVariantMetadata);
    });

    it('should return metadata from the variant product', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      expect(getSelectedVariantMetadata(mockedState, { productId, variantId }))
        .toEqual(mockedVariantProductMetadata);
    });

    it('should return metadata from the variant product when variant data is not available', () => {
      const productId = 'product_1';
      const variantId = 'product_2';

      mockedState.product.variantsByProductId[productId].variants.products.splice(0, 1);
      expect(getSelectedVariantMetadata(mockedState, { productId, variantId }))
        .toEqual(mockedVariantProductMetadata);
    });
  });

  describe('getKnownRelatives()', () => {
    it('should return parent and children for given parentId', () => {
      expect(getKnownRelatives(mockedState, { productId: 'parent' })).toEqual(['parent', 'child', 'child2']);
    });

    it('should return parent and children for given child id', () => {
      expect(getKnownRelatives(mockedState, { productId: 'child' })).toEqual(['parent', 'child', 'child2']);
    });

    it('should return notAChild and it\'s parent only', () => {
      expect(getKnownRelatives(mockedState, { productId: 'notAChild' })).toEqual(['notAChild', 'foo']);
    });

    it('should return empty array on empty product data', () => {
      expect(getKnownRelatives(mockedState, { productId: 'not_exist' })).toEqual([]);
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
