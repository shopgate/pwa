/* eslint-disable extra-rules/no-single-line-objects */
import { logger } from '@shopgate/pwa-core/helpers';

import {
  mockedProductState,
  mockedProductsById,
  mockedVariantProductMetadata,
  mockedVariantMetadata,
} from './product.mock';

import {
  getVariantId,
  isVariantSelected,
  getSelectedVariant,
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

  describe('getVariantId()', () => {
    it('should return null and log a message when no props are passed', () => {
      expect(getVariantId(mockedState)).toBeNull();
      expect(logger.error).toHaveBeenCalledTimes(1);
    });

    it('should return null when the props dont contain a variantId', () => {
      expect(getVariantId(mockedState, { productId: 'product_1' })).toBeNull();
    });

    it('should return the expected variant id', () => {
      const variantId = 'product_2';
      expect(getVariantId(mockedState, { variantId })).toBe(variantId);
    });
  });

  describe('isVariantSelected()', () => {
    it('should return false when no variantId was passed', () => {
      expect(isVariantSelected({}, { productId: 'product_1' })).toBe(false);
    });

    it('should return true when a variantId was passed', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      expect(isVariantSelected(mockedState, { productId, variantId })).toBe(true);
    });
  });

  describe('getSelectedVariant()', () => {
    it('should return null when no variant is selected', () => {
      const productId = 'product_1';
      expect(getSelectedVariant(mockedState, { productId })).toBeNull();
    });

    it('should return null when no variant is selected', () => {
      const productId = 'product_1';
      const variantId = 'unknown';
      expect(getSelectedVariant(mockedState, { productId, variantId })).toBeNull();
    });

    it('should return null for a fetching product', () => {
      const productId = 'product_1';
      const variantId = 'product_4';
      expect(getSelectedVariant(mockedState, { productId, variantId })).toBeNull();
    });

    it('should return a product', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const { productData } = mockedProductsById[variantId];
      expect(getSelectedVariant(mockedState, { productId, variantId })).toEqual(productData);
    });
  });

  describe('getSelectedVariantMetadata()', () => {
    it('should return null when no variant data is available at all', () => {
      const productId = 'product_1';
      const variantId = 'product_3';
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

    it('should return null when neither the variant data, nor the variant product contains metadata', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      delete mockedState.product.productsById[variantId].productData.metadata;
      expect(getSelectedVariantMetadata(mockedState, { productId, variantId })).toBeNull();
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
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
