import { getRelatedProducts } from './relations';

describe('Relations selectors', () => {
  describe('getRelatedProducts', () => {
    it('should memoize selector properly', () => {
      const hash = '{"limit":20,"pipeline":"shopgate.catalog.getProductRelations","productId":"a","type":"upselling"}';
      let state = {
        product: {
          productsById: {
            a: {
              productData: {
                id: 'a',
              },
            },
            b: {
              productData: {
                id: 'b',
              },
            },
          },
          productRelationsByHash: {
            [hash]: {
              productIds: [
                'b',
              ],
            },
          },
        },
      };

      const expectedResult = [{ id: 'b' }];

      // First selector run.
      const selector = getRelatedProducts({
        productId: 'a',
        type: 'upselling',
        limit: 20,
      });

      const result1 = selector(state);
      expect(result1).toEqual(expectedResult);
      expect(selector.recomputations()).toBe(1);

      // Second selector run. It should not recompute, state did not change.
      const result2 = selector(state);
      expect(result2).toEqual(expectedResult);
      expect(selector.recomputations()).toBe(1);

      state = {
        product: {
          ...state.product,
          productRelationsByHash: {
            ...state.product.productRelationsByHash,
            [hash]: {
              productIds: [
                'b',
                'c',
              ],
            },
          },
        },
      };

      // State did change. It should recompute.
      const result3 = selector(state);
      expect(result3).toEqual(expectedResult);
      expect(selector.recomputations()).toBe(2);
    });
  });
});
