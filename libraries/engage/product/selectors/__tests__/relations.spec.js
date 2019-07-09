import { generateProductRelationsHash } from '@shopgate/pwa-common-commerce/product';
import { wrapMemoizedSelector } from '../helpers';
import {
  makeGetMaximumRelatedProducts,
  makeGetRelatedProducts,
} from '../relations';

jest.mock('@shopgate/pwa-common-commerce/product', () => {
  const {
    getProductState,
    getProducts,
  } = jest.requireActual('@shopgate/pwa-common-commerce/product');

  return {
    getProductState,
    generateProductRelationsHash: jest.fn(),
    getProducts,
  };
});

const mockState = {
  product: {
    productRelationsByHash: {
      somehashhere: [],
      somehashthere: {
        productIds: [
          '123',
          '456',
        ],
      },
    },
    productsById: {
      123: { productData: { name: 'foo' } },
      456: { productData: { name: 'bar' } },
    },
  },
};

describe('engage > product > selectors > relations', () => {
  describe('makeGetRelatedProducts()', () => {
    let getRelatedProducts;

    beforeEach(() => {
      getRelatedProducts = wrapMemoizedSelector(makeGetRelatedProducts());
    });

    it('should return empty array', () => {
      generateProductRelationsHash.mockReturnValueOnce('somehashhere');
      expect(getRelatedProducts(mockState, {
        productId: '789',
        type: 'upselling',
        limit: 100,
      })).toEqual([]);
    });

    it('should return two products', () => {
      generateProductRelationsHash.mockReturnValueOnce('somehashthere');
      expect(getRelatedProducts(mockState, {
        productId: '789',
        type: 'upselling',
        limit: 100,
      })).toEqual([
        { name: 'foo' },
        { name: 'bar' },
      ]);
    });
  });

  describe('makeGetMaximumRelatedProducts()', () => {
    let getMaximumRelatedProducts;

    beforeEach(() => {
      getMaximumRelatedProducts = wrapMemoizedSelector(makeGetMaximumRelatedProducts());
    });

    it('should return an empty array', () => {
      generateProductRelationsHash.mockReturnValueOnce('somehashhere');
      expect(getMaximumRelatedProducts(mockState, {
        productId: '789',
        type: 'upselling',
        limit: 100,
        max: 1,
      })).toEqual({
        products: [],
        productsCount: 0,
      });
    });

    it('should return an array with one product', () => {
      generateProductRelationsHash.mockReturnValueOnce('somehashthere');
      expect(getMaximumRelatedProducts(mockState, {
        productId: '789',
        type: 'upselling',
        limit: 100,
        max: 1,
      })).toEqual({
        products: [{ name: 'foo' }],
        productsCount: 2,
      });
    });

    it('should return an array with two products', () => {
      generateProductRelationsHash.mockReturnValueOnce('somehashthere');
      expect(getMaximumRelatedProducts(mockState, {
        productId: '789',
        type: 'upselling',
        limit: 100,
        max: 2,
      })).toEqual({
        products: [
          { name: 'foo' },
          { name: 'bar' },
        ],
        productsCount: 2,
      });
    });
  });
});
