import {
  mockedState as mockedProductState,
  mockedVariantStateAllFetching,
  mockedVariantStateVariantDataFetching,
  mockedVariantStateVariantsFetching,
  mockedVariantStateComplete,
} from './product.mock';
import {
  isProductPageLoading,
} from './page';

/**
 * Creates a deep copy of a passed to avoid unintended selector caching.
 * @param {Object} mockedState A mocked state.
 * @return {Object}
 */
const createState = mockedState => JSON.parse(JSON.stringify(mockedState));

describe('Product page selectors', () => {
  const propsBase = {
    productId: 'product_1',
  };

  const propsFull = {
    productId: 'product_1',
    variantId: 'product_2',
  };

  let mockedDefaultState;

  beforeEach(() => {
    mockedDefaultState = JSON.parse(JSON.stringify(mockedProductState));
    jest.clearAllMocks();
  });

  describe('isProductPageLoading()', () => {
    describe('Simple products without variants', () => {
      it('should return true if the product is fetching', () => {
        const productId = 'product_4';
        expect(isProductPageLoading(mockedDefaultState, { productId })).toBe(true);
      });

      it('should return false if the product is loaded', () => {
        const productId = 'product_5';
        expect(isProductPageLoading(mockedDefaultState, { productId })).toBe(false);
      });
    });

    describe('Products with variants', () => {
      it('should return true if the base product is fetching', () => {
        const state = createState(mockedVariantStateAllFetching);
        expect(isProductPageLoading(state, propsBase)).toBe(true);
      });

      it('should return true if the variant data is fetching', () => {
        const state = createState(mockedVariantStateVariantDataFetching);
        expect(isProductPageLoading(state, propsBase)).toBe(true);
      });

      it('should return false if basic data is loaded, but no variant product is selected yet', () => {
        expect(isProductPageLoading(mockedDefaultState, propsBase)).toBe(false);
      });

      it('should return true if a variant is selected, but the product data is fetching', () => {
        const state = createState(mockedVariantStateVariantsFetching);
        expect(isProductPageLoading(state, propsFull)).toBe(true);
      });

      it('should return false if a variant product is selected an all data is present', () => {
        const state = createState(mockedVariantStateComplete);
        expect(isProductPageLoading(state, propsFull)).toBe(false);
      });
    });
  });
});
