import { getCurrentRoute, getCurrentParams } from '@shopgate/pwa-common/selectors/router';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';

import {
  getCategoryId,
  getCategory,
  getRootCategories,
  getCategoryChildren,
  getCategoryChildCount,
  hasCategoryChildren,
  getCategoryProductCount,
  hasCategoryProducts,
  getCategoryName,
} from './index';

jest.mock('@shopgate/pwa-common/selectors/router', () => ({
  getCurrentRoute: jest.fn(),
  getCurrentParams: jest.fn(),
}));

const mockState = {
  category: {
    categoriesById: {
      r1: {
        id: 'r1',
        name: 'Root Category One',
        childrenCount: 10,
        productCount: 10,
        isFetching: false,
        expires: 123456,
      },
      r2: {
        id: 'r2',
        name: 'Root Category Two',
        childrenCount: 11,
        productCount: 11,
        isFetching: false,
        expires: 123456,
      },
      c1: {
        id: 'c1',
        name: 'Category One',
        childrenCount: 12,
        productCount: 12,
        isFetching: false,
        expires: 123456,
      },
      c2: {
        id: 'c2',
        name: 'Category Two',
        childrenCount: 13,
        productCount: 13,
        isFetching: false,
        expires: 123456,
      },
      c3: {
        id: 'c3',
        name: 'Category Three',
        childrenCount: 0,
        productCount: 0,
        isFetching: false,
        expires: 123456,
      },
    },
    childrenByCategoryId: {
      r1: {
        children: ['c1', 'c2'],
        isFetching: false,
        expires: 123456,
      },
      c1: {
        children: ['c3'],
        isFetching: false,
        expires: 123456,
      },
    },
    rootCategories: {
      categories: ['r1', 'r2'],
      expires: 123456,
      isFetching: false,
    },
  },
};

const { categoriesById, childrenByCategoryId } = mockState.category;
const propCategoryId = 'c2';
const propCategory = categoriesById[propCategoryId];
const propCategoryName = propCategory.name;
const routeCategoryId = 'c1';
const routeCategory = categoriesById[routeCategoryId];
const routeCategoryName = routeCategory.name;

describe('Category page selectors', () => {
  beforeAll(() => {
    getCurrentParams.mockReturnValue({
      categoryId: bin2hex(routeCategoryId),
    });

    getCurrentRoute.mockReturnValue({
      state: {
        title: routeCategoryName,
      },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategoryId()', () => {
    it('should return the categoryId from the props when present', () => {
      expect(getCategoryId({}, { categoryId: routeCategoryId })).toBe(routeCategoryId);
    });

    it('should return the categoryId from the current route params', () => {
      expect(getCategoryId({})).toBe(routeCategoryId);
    });

    it('should return NULL when no categoryId is present within the props or the current route', () => {
      getCurrentParams.mockReturnValueOnce(undefined);
      expect(getCategoryId({})).toBeNull();
      getCurrentParams.mockReturnValueOnce({});
      expect(getCategoryId({})).toBeNull();
    });
  });

  describe('getCategory()', () => {
    it('should return the category from the props', () => {
      expect(getCategory(mockState, { categoryId: propCategoryId })).toBe(propCategory);
    });

    it('should return the category from the route', () => {
      expect(getCategory(mockState)).toBe(routeCategory);
    });

    it('should return NULL when the category from the props does not exist', () => {
      expect(getCategory(mockState, { categoryId: 'invalid' })).toBeNull();
    });

    it('should return NULL when category data is not available yet', () => {
      expect(getCategory({})).toBeNull();
    });
  });

  describe('getRootCategories()', () => {
    it('should get the root categories', () => {
      expect(getRootCategories(mockState)).toEqual([categoriesById.r1, categoriesById.r2]);
    });

    it('should return NULL when the root categories state is empty', () => {
      expect(getRootCategories({
        category: {
          ...mockState.category,
          rootCategories: {},
        },
      })).toBeNull();
    });

    it('should return NULL when no root categories are available yet', () => {
      expect(getRootCategories({
        category: {
          ...mockState.category,
          rootCategories: {
            ...mockState.category.rootCategories,
            categories: undefined,
          },
        },
      })).toBeNull();
    });

    it('should return an empty array when no matching category data can be determined', () => {
      expect(getRootCategories({
        category: {
          ...mockState.category,
          categoriesById: {},
        },
      })).toEqual([]);
    });
  });

  describe('getCategoryChildCount()', () => {
    it('should return the correct count for a categoryId within the props', () => {
      expect(getCategoryChildCount(mockState, { categoryId: propCategoryId }))
        .toBe(propCategory.childrenCount);
    });

    it('should return the correct count for the categoryId within the route', () => {
      expect(getCategoryChildCount(mockState))
        .toBe(routeCategory.childrenCount);
    });

    it('should return NULL when no category can be determined', () => {
      expect(getCategoryChildCount(mockState, { categoryId: 'invalid' })).toBeNull();
    });
  });

  describe('hasCategoryChildren()', () => {
    it('should return TRUE for a category from the props with children', () => {
      expect(hasCategoryChildren(mockState, { categoryId: propCategoryId })).toBe(true);
    });

    it('should return TRUE for a category from the route with children', () => {
      expect(hasCategoryChildren(mockState)).toBe(true);
    });

    it('should return FALSE for a category without children', () => {
      expect(hasCategoryChildren(mockState, { categoryId: 'c4' })).toBe(false);
    });

    it('should return FALSE for an invalid category', () => {
      expect(hasCategoryChildren(mockState, { categoryId: 'invalid' })).toBe(false);
    });
  });

  describe('getCategoryChildren()', () => {
    it('should return child categories for a category from the props', () => {
      const categoryId = 'r1';
      const expected = childrenByCategoryId[categoryId].children
        .map(childId => categoriesById[childId]);

      expect(getCategoryChildren(mockState, { categoryId })).toEqual(expected);
    });

    it('should return child categories for a category from the route', () => {
      const categoryId = routeCategoryId;
      const expected = childrenByCategoryId[categoryId].children
        .map(childId => categoriesById[childId]);

      expect(getCategoryChildren(mockState)).toEqual(expected);
    });

    it('should return NULL when no child categories entry can be determined', () => {
      expect(getCategoryChildren(mockState, { categoryId: 'invalid' })).toBeNull();
    });

    it('should return NULL when no child categories entry can be determined', () => {
      expect(getCategoryChildren({
        category: {
          ...mockState.category,
          childrenByCategoryId: {
            ...mockState.category.childrenByCategoryId,
            [routeCategoryId]: {
              ...mockState.category.childrenByCategoryId[routeCategoryId],
              children: undefined,
            },
          },
        },
      }, { category: routeCategoryId })).toBeNull();
    });
  });

  describe('getCategoryProductCount()', () => {
    it('should return the correct count for a categoryId within the props', () => {
      expect(getCategoryProductCount(mockState, { categoryId: propCategoryId }))
        .toBe(propCategory.productCount);
    });

    it('should return the correct count for the categoryId within the route', () => {
      expect(getCategoryProductCount(mockState))
        .toBe(routeCategory.productCount);
    });

    it('should return NULL when no category can be determined', () => {
      expect(getCategoryProductCount(mockState, { categoryId: 'invalid' })).toBeNull();
    });

    it('should return 0 when the category has no products', () => {
      expect(getCategoryProductCount(mockState, { categoryId: 'c3' })).toBe(0);
    });
  });

  describe('hasCategoryProducts()', () => {
    it('should return TRUE for a category from the props with products', () => {
      expect(hasCategoryProducts(mockState, { categoryId: propCategoryId })).toBe(true);
    });

    it('should return TRUE for a category from the route with products', () => {
      expect(hasCategoryProducts(mockState)).toBe(true);
    });

    it('should return FALSE for a category without products', () => {
      expect(hasCategoryProducts(mockState, { categoryId: 'c4' })).toBe(false);
    });

    it('should return FALSE for an invalid category', () => {
      expect(hasCategoryProducts(mockState, { categoryId: 'invalid' })).toBe(false);
    });
  });

  describe('getCategoryName()', () => {
    it('should return the title from the route state when no categoryId is passed witin the props', () => {
      expect(getCategoryName(mockState)).toBe(routeCategoryName);
    });

    it('should return the name of a category from the props', () => {
      expect(getCategoryName(mockState, { categoryId: propCategoryId })).toBe(propCategoryName);
    });

    it('should return NULL when no category name can be determined', () => {
      getCurrentRoute.mockReturnValueOnce({ state: {} });
      expect(getCategoryName(mockState, { categoryId: 'invalid' })).toBeNull();
    });
  });
});
