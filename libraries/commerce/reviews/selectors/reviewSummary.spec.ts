import productsById from '../../product/reducers/productsById';
import receiveProducts from '../../product/action-creators/receiveProducts';
import { getProductReviewCount } from './index';
import { getReviewSummary } from './reviewSummary';

type ProductEntry = {
  productData: {
    id: string;
    rating?: Record<string, unknown>;
  };
};

/**
 * Builds an application state with the given product entries.
 * @param products The product entries keyed by product id.
 * @returns The application state.
 */
const buildState = (products: Record<string, ProductEntry>) => ({
  product: {
    productsById: products,
  },
});

/**
 * Builds a product entry with the given rating.
 * @param id The product id.
 * @param rating The rating of the product.
 * @returns The product entry.
 */
const buildProduct = (id: string, rating?: Record<string, unknown>): ProductEntry => ({
  productData: {
    id,
    ...(rating && { rating }),
  },
});

describe('Reviews selectors: reviewSummary', () => {
  it('should return the average and the count of the product rating', () => {
    const state = buildState({
      foo: buildProduct('foo', {
        average: 80,
        count: 12,
      }),
    });

    expect(getReviewSummary(state, { productId: 'foo' })).toEqual({
      average: 80,
      count: 12,
    });
  });

  it('should keep a rating of zero', () => {
    const state = buildState({
      foo: buildProduct('foo', {
        average: 0,
        count: 0,
      }),
    });

    expect(getReviewSummary(state, { productId: 'foo' })).toEqual({
      average: 0,
      count: 0,
    });
  });

  it('should return null when the product is not available', () => {
    expect(getReviewSummary(buildState({}), { productId: 'foo' })).toBeNull();
  });

  it('should return null when the product has no rating', () => {
    const state = buildState({ foo: buildProduct('foo') });

    expect(getReviewSummary(state, { productId: 'foo' })).toBeNull();
  });

  it('should return null for single values that are missing or not finite', () => {
    const state = buildState({
      foo: buildProduct('foo', {
        average: 60,
        count: null,
      }),
      bar: buildProduct('bar', {
        average: NaN,
        count: '3',
      }),
    });

    expect(getReviewSummary(state, { productId: 'foo' })).toEqual({
      average: 60,
      count: null,
    });
    expect(getReviewSummary(state, { productId: 'bar' })).toEqual({
      average: null,
      count: null,
    });
  });

  it('should prefer the variant over the product id', () => {
    const state = buildState({
      base: buildProduct('base', {
        average: 40,
        count: 2,
      }),
      variant: buildProduct('variant', {
        average: 100,
        count: 1,
      }),
    });

    expect(getReviewSummary(state, {
      productId: 'base',
      variantId: 'variant',
    })).toEqual({
      average: 100,
      count: 1,
    });
  });

  it('should return the same summary while the rating is unchanged', () => {
    const state = buildState({
      foo: buildProduct('foo', {
        average: 80,
        count: 12,
      }),
    });

    expect(getReviewSummary(state, { productId: 'foo' }))
      .toBe(getReviewSummary(state, { productId: 'foo' }));
  });

  it('should reflect a rating that an extension patched into the product data', () => {
    const productsBefore = {
      foo: buildProduct('foo', {
        average: 80,
        count: 12,
      }),
    };
    /**
     * Applies a rating patch the way the Klaviyo extension dispatches it.
     * @param rating The patched rating.
     * @returns The resulting product entries.
     */
    const patch = (rating: Record<string, unknown>) => {
      const payload = {
        products: [{
          ...productsBefore.foo.productData,
          rating,
        }],
        fetchInventory: false,
      } as unknown as Parameters<typeof receiveProducts>[0];

      return productsById(productsBefore, receiveProducts(payload)) as Record<string, ProductEntry>;
    };

    const patched = buildState(patch({
      average: 60,
      count: 30,
    }));
    const patchedToZero = buildState(patch({
      average: 0,
      count: 0,
    }));

    expect(getReviewSummary(patched, { productId: 'foo' })).toEqual({
      average: 60,
      count: 30,
    });
    expect(getReviewSummary(patchedToZero, { productId: 'foo' })).toEqual({
      average: 0,
      count: 0,
    });
  });

  it('should keep the summary count apart from the review list count', () => {
    const state = {
      ...buildState({
        foo: buildProduct('foo', {
          average: 80,
          count: 5,
        }),
      }),
      reviews: {
        reviewsById: {},
        reviewsByHash: {},
        reviewsByProductId: {
          foo: {
            reviews: [],
            totalReviewCount: 3,
          },
        },
        userReviewsByProductId: {},
      },
    };

    expect(getReviewSummary(state, { productId: 'foo' })?.count).toBe(5);
    expect(getProductReviewCount(state, { productId: 'foo' })).toBe(3);
  });

  describe('provider summary', () => {
    const providerSummary = {
      average: 69,
      count: 35,
      distribution: {
        5: 10,
        4: 10,
        3: 5,
        2: 5,
        1: 5,
      },
    };

    /**
     * @param reviews The reviews slice.
     * @returns A state with a product that has a native rating, plus the given reviews slice.
     */
    const buildProviderState = (reviews: Record<string, unknown>) => ({
      ...buildState({
        foo: buildProduct('foo', {
          average: 80,
          count: 5,
        }),
      }),
      reviews,
    });

    it('should prefer the summary the review provider delivered for the product', () => {
      const state = buildProviderState({ reviewSummariesByProductId: { foo: providerSummary } });

      expect(getReviewSummary(state, { productId: 'foo' })).toBe(providerSummary);
    });

    it('should use the product data when the provider delivered no summary for the product', () => {
      const state = buildProviderState({ reviewSummariesByProductId: { bar: providerSummary } });

      expect(getReviewSummary(state, { productId: 'foo' })).toEqual({
        average: 80,
        count: 5,
      });
    });

    it('should not use the product data when the provider reports that it delivers summaries', () => {
      const state = buildProviderState({
        reviewSettings: { features: ['ratingSummary'] },
        reviewSummariesByProductId: {},
      });

      expect(getReviewSummary(state, { productId: 'foo' })).toBeNull();
    });

    it('should return null without a product id', () => {
      const state = buildProviderState({ reviewSummariesByProductId: { foo: providerSummary } });

      expect(getReviewSummary(state)).toBeNull();
    });

    it('should use a delivered summary also when the provider reports the capability', () => {
      const state = buildProviderState({
        reviewSettings: { features: ['ratingSummary'] },
        reviewSummariesByProductId: { foo: providerSummary },
      });

      expect(getReviewSummary(state, { productId: 'foo' })).toBe(providerSummary);
    });
  });
});
