import { mockedProductState } from './product.mock';
import {
  isProductPageLoading,
  isProductPageOrderable,
} from './page';

describe('Product page selectors', () => {
  let mockedState;

  const propsBase = {
    productId: 'product_1',
  };

  const propsFull = {
    productId: 'product_1',
    variantId: 'product_2',
  };

  beforeEach(() => {
    // Create a deep copy of the state to avoid unintended selector caching.
    mockedState = JSON.parse(JSON.stringify(mockedProductState));
    jest.clearAllMocks();
  });

  describe('isProductPageLoading()', () => {
    describe('Simple products without variants', () => {
      it('should return true if the product is fetching', () => {
        const productId = 'product_4';
        expect(isProductPageLoading(mockedState, { productId })).toBe(true);
      });

      it('should return false if the product is loaded', () => {
        const productId = 'product_5';
        expect(isProductPageLoading(mockedState, { productId })).toBe(false);
      });
    });

    describe('Products with variants', () => {
      it('should return true if the base product is fetching', () => {
        delete mockedState.product.productsById[propsBase.productId].productData;
        expect(isProductPageLoading(mockedState, propsBase)).toBe(true);
      });

      it('should return true if the variant data is fetching', () => {
        delete mockedState.product.variantsByProductId[propsBase.productId].variants;
        expect(isProductPageLoading(mockedState, propsBase)).toBe(true);
      });

      it('should return false if basic data is loaded, but no variant product is selected yet', () => {
        expect(isProductPageLoading(mockedState, propsBase)).toBe(false);
      });

      it('should return true if a variant is selected, but the product data is fetching', () => {
        delete mockedState.product.productsById[propsFull.variantId].productData;
        expect(isProductPageLoading(mockedState, propsFull)).toBe(true);
      });

      it('should return false if a variant product is selected an all data is present', () => {
        expect(isProductPageLoading(mockedState, propsFull)).toBe(false);
      });
    });
  });

  describe('isProductPageOrderable()', () => {
    describe('Simple products without variants', () => {
      it('should return false if the product is fetching', () => {
        const productId = 'product_4';
        expect(isProductPageOrderable(mockedState, { productId })).toBe(false);
      });

      it('should return true if the product is loaded', () => {
        const productId = 'product_5';
        expect(isProductPageOrderable(mockedState, { productId })).toBe(true);
      });
    });

    describe('Products with variants', () => {
      it('should return false if the base product is fetching', () => {
        delete mockedState.product.productsById[propsBase.productId].productData;
        expect(isProductPageOrderable(mockedState, propsBase)).toBe(false);
      });

      it('should return false if the variant data is fetching', () => {
        delete mockedState.product.variantsByProductId[propsBase.productId].variants;
        expect(isProductPageOrderable(mockedState, propsBase)).toBe(false);
      });

      it('should return false if basic data is loaded, but no variant product is selected yet', () => {
        expect(isProductPageOrderable(mockedState, propsBase)).toBe(false);
      });

      it('should return false if a variant is selected, but the product data is fetching', () => {
        delete mockedState.product.productsById[propsFull.variantId].productData;
        expect(isProductPageOrderable(mockedState, propsFull)).toBe(false);
      });

      it('should return true if a variant product is selected an all data is present', () => {
        expect(isProductPageOrderable(mockedState, propsFull)).toBe(true);
      });
    });
  });
});
