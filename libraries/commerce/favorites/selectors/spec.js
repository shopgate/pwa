import { mockedList } from '../mock';
import {
  getFavorites,
  getFavoritesCount,
  getProductRelativesOnFavorites,
  isRelativeProductOnList,
  hasFavorites,
  isInitialLoading,
  isCurrentProductOnFavoriteList,
  isFetching,
} from './index';

describe('Favorites - selectors', () => {
  describe('getFavorites', () => {
    it('should return empty array when product is not yet available', () => {
      const result = getFavorites({
        product: {
          productsById: {},
        },
        favorites: {
          products: {
            ids: [1],
          },
        },
      });
      expect(result instanceof Array).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should return empty array when product data is available but empty', () => {
      const result = getFavorites({
        product: {
          productsById: {
            foo: {
              isFetching: true,
            },
          },
        },
        favorites: {
          products: {
            ids: ['fpp'],
          },
        },
      });
      expect(result instanceof Array).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should return products', () => {
      const state = {
        product: {
          productsById: {},
        },
        favorites: {
          products: {
            ids: [mockedList.products[0].id],
          },
        },
      };
      const [product] = mockedList.products;
      state.product.productsById[mockedList.products[0].id] = {
        productData: product,
      };

      const result = getFavorites(state);
      expect(result instanceof Array).toBe(true);
      /**
       * Checking basically if selector is merging product data to stored ids.
       * It's enough to check if id and name is there. All the rest should be as well.
       * Checking more fields makes no sense since in case of schema change this selector
       * won't be updated.
       */
      expect(result[0].id).toBe(mockedList.products[0].id);
      expect(result[0].name).toBe(mockedList.products[0].name);
    });
  });

  describe('getFavoritesCount', () => {
    it('should return positive number', () => {
      const result = getFavoritesCount({
        favorites: {
          products: {
            ids: [mockedList.products[0].id],
          },
        },
      });
      expect(result).toBe(1);
    });
  });

  it('should return 0', () => {
    const result = getFavoritesCount({
      favorites: {
        products: {
          ids: [],
        },
      },
    });
    expect(result).toBe(0);
  });

  describe('hasFavorites', () => {
    it('should return false', () => {
      const result = hasFavorites({
        favorites: {
          products: {
            ids: [],
          },
        },
      });
      expect(result).toBe(false);
    });

    it('should return true', () => {
      const result = hasFavorites({
        favorites: {
          products: {
            ids: [mockedList.products[0].id],
          },
        },
      });
      expect(result).toBe(true);
    });

    /**
     * `.hasFavorites` uses all state related selectors. This checks all possible type errors
     * when selector tries to reach property from unready state.
     */
    it('should not fail when state is not ready', () => {
      const result = hasFavorites({});
      expect(result).toBe(false);
    });
  });

  describe('isInitialLoading', () => {
    const notInitedState = {
      favorites: {},
    };
    const initedState = {
      favorites: {
        products: {
          ready: true,
        },
      },
    };

    it('should return true when state is not yet prepared', () => {
      expect(isInitialLoading(notInitedState)).toBe(true);
    });

    it('should return false when state is fetched for the first  time', () => {
      expect(isInitialLoading(initedState)).toBe(false);
    });
  });

  describe('isCurrentProductOnFavoriteList', () => {
    const initialState = {
      favorites: {},
    };

    const state = {
      favorites: {
        products: {
          ids: ['product_1'],
        },
      },
    };

    const props = { productId: 'product_1' };

    it('should return false when product is not listed', () => {
      expect(isCurrentProductOnFavoriteList(initialState, props)).toBe(false);
    });

    it('should return true when product is listed', () => {
      expect(isCurrentProductOnFavoriteList(state, props)).toBe(true);
    });
  });

  describe('isFetching', () => {
    const state = {
      favorites: {
        products: {
          isFetching: true,
        },
      },
    };

    let mockedState;

    beforeEach(() => {
      // Take care that the selector always works with a fresh state.
      mockedState = JSON.parse(JSON.stringify(state));
    });

    it('should return true', () => {
      expect(isFetching(mockedState)).toBe(true);
    });

    it('should return false', () => {
      mockedState.favorites.products.isFetching = false;
      expect(isFetching(mockedState)).toBe(false);
    });
  });

  describe('getProductRelativesOnFavorites & isRelativeProductOnList', () => {
    const products = {
      product: {
        productsById: {
          parent: {
            productData: {
              id: 'parent',
              baseProductId: null,
              flags: {
                hasVariants: true,
              },
            },
          },
          child: {
            productData: {
              id: 'child',
              baseProductId: 'parent',
              flags: {
                hasVariants: false,
              },
            },
          },
          child2: {
            productData: {
              id: 'child2',
              baseProductId: 'parent',
              flags: {
                hasVariants: false,
              },
            },
          },
          notAChild: {
            productData: {
              id: 'notAChild',
              baseProductId: 'foo',
              flags: {
                hasVariants: false,
              },
            },
          },
        },
      },
    };

    it('should return parent', () => {
      const state = {
        ...products,
        favorites: {
          products: {
            ids: ['parent'],
          },
        },
      };

      expect(getProductRelativesOnFavorites(state, { productId: 'parent' })).toEqual(['parent']);
      expect(isRelativeProductOnList(state, { productId: 'parent' })).toBe(true);
      expect(isRelativeProductOnList(state, { productId: 'notAChild' })).toEqual(false);
    });

    it('should return parent and child', () => {
      const state = {
        ...products,
        favorites: {
          products: {
            ids: ['parent', 'child'],
          },
        },
      };

      expect(getProductRelativesOnFavorites(state, { productId: 'child' })).toEqual(['parent', 'child']);
      expect(isRelativeProductOnList(state, { productId: 'child' })).toEqual(true);
      expect(isRelativeProductOnList(state, { productId: 'parent' })).toEqual(true);
      expect(isRelativeProductOnList(state, { productId: 'notAChild' })).toEqual(false);
    });

    it('should return all relatives', () => {
      const state = {
        ...products,
        favorites: {
          products: {
            ids: ['parent', 'child', 'child2'],
          },
        },
      };

      expect(getProductRelativesOnFavorites(state, { productId: 'child' })).toEqual(['parent', 'child', 'child2']);
      expect(isRelativeProductOnList(state, { productId: 'child' })).toEqual(true);
      expect(isRelativeProductOnList(state, { productId: 'parent' })).toEqual(true);
      expect(isRelativeProductOnList(state, { productId: 'child2' })).toEqual(true);
      expect(isRelativeProductOnList(state, { productId: 'notAChild' })).toEqual(false);
    });

    it('should return child', () => {
      const state = {
        ...products,
        favorites: {
          products: {
            ids: ['child', 'notAChild'],
          },
        },
      };

      expect(getProductRelativesOnFavorites(state, { productId: 'child' })).toEqual(['child']);
      expect(isRelativeProductOnList(state, { productId: 'child' })).toEqual(true);
    });

    it('should return nothing for parent which is not on the list', () => {
      const state = {
        ...products,
        favorites: {
          products: {
            ids: [],
          },
        },
      };

      expect(getProductRelativesOnFavorites(state, { productId: 'parent' })).toEqual([]);
    });

    it('should return parent product when parent is a simple product', () => {
      const state = {
        product: {
          productsById: {
            parent: {
              productData: {
                id: 'parent',
                baseProductId: null,
                flags: {
                  hasVariants: false,
                },
              },
            },
          },
        },
        favorites: {
          products: {
            ids: ['parent'],
          },
        },
      };

      expect(getProductRelativesOnFavorites(state, { productId: 'parent' })).toEqual(['parent']);
      expect(isRelativeProductOnList(state, { productId: 'parent' })).toEqual(true);
    });

    it('should return nothing when parent is a simple product but not on fav list', () => {
      const state = {
        product: {
          productsById: {
            parent: {
              productData: {
                id: 'parent',
                baseProductId: null,
                flags: {
                  hasVariants: false,
                },
              },
            },
          },
        },
        favorites: {
          products: {
            ids: [],
          },
        },
      };

      expect(getProductRelativesOnFavorites(state, { productId: 'parent' })).toEqual([]);
      expect(isRelativeProductOnList(state, { productId: 'parent' })).toEqual(false);
    });
  });
});
