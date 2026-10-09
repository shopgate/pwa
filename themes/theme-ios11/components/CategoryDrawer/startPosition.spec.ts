import { bin2hex } from '@shopgate/engage/core/helpers';
import { getContextCategoryId, resolveStartPosition } from './startPosition';
import type { CategoryState, DrawerCategory } from './types';

jest.mock('@shopgate/engage/category/actions', () => ({
  fetchCategory: (categoryId: string) => ({
    type: 'FETCH_CATEGORY',
    categoryId,
  }),
}));

const categoryRoute = (id: string, routeId: string) => ({
  id: routeId,
  pattern: '/category/:categoryId',
  params: { categoryId: bin2hex(id) },
});

const routerState = (stack: { id: string; pattern: string; params?: object }[]) => ({
  router: {
    currentRoute: stack[stack.length - 1],
    stack,
  },
});

const createStore = (
  cached: Record<string, DrawerCategory>,
  remote: Record<string, DrawerCategory> = {}
) => {
  const state: CategoryState = {
    category: {
      rootCategories: {},
      categoriesById: { ...cached },
      childrenByCategoryId: {},
    },
  };
  const dispatch = jest.fn((action: unknown) => {
    const { categoryId } = action as { categoryId: string };

    if (!remote[categoryId]) {
      return Promise.reject(new Error('ENOTFOUND'));
    }

    state.category.categoriesById[categoryId] = remote[categoryId];
    return Promise.resolve();
  });

  return {
    dispatch,
    getState: () => state,
  };
};

describe('CategoryDrawer start position', () => {
  describe('getContextCategoryId()', () => {
    it('returns the category of a category page', () => {
      const state = routerState([
        {
          id: 'a',
          pattern: '/',
        },
        categoryRoute('jackets', 'b'),
      ]);

      expect(getContextCategoryId(state)).toBe('jackets');
    });

    it('returns the category a product page was opened from', () => {
      const state = routerState([
        categoryRoute('men', 'a'),
        categoryRoute('jackets', 'b'),
        {
          id: 'c',
          pattern: '/item/:productId',
        },
        {
          id: 'd',
          pattern: '/item/:productId',
        },
      ]);

      expect(getContextCategoryId(state)).toBe('jackets');
    });

    it('returns null for a product page that was not opened from a category', () => {
      const state = routerState([
        categoryRoute('men', 'a'),
        {
          id: 'b',
          pattern: '/search',
        },
        {
          id: 'c',
          pattern: '/item/:productId',
        },
      ]);

      expect(getContextCategoryId(state)).toBeNull();
    });

    it('returns null on other pages', () => {
      const state = routerState([
        categoryRoute('men', 'a'),
        {
          id: 'b',
          pattern: '/cart',
        },
      ]);

      expect(getContextCategoryId(state)).toBeNull();
    });
  });

  describe('resolveStartPosition()', () => {
    it('starts at the root level without a category', async () => {
      const { dispatch, getState } = createStore({});

      await expect(resolveStartPosition(null)(dispatch, getState)).resolves.toEqual({
        path: [],
        activeId: null,
      });
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('opens the level a category without children is listed in', async () => {
      const { dispatch, getState } = createStore({
        bomber: {
          id: 'bomber',
          name: 'Bomber jackets',
          childrenCount: 0,
          parentCategoriesInfo: [
            {
              code: 'men',
              name: 'Men',
            },
            {
              code: 'jackets',
              name: 'Jackets',
            },
          ],
        },
      });

      await expect(resolveStartPosition('bomber')(dispatch, getState)).resolves.toEqual({
        path: [
          {
            id: 'men',
            name: 'Men',
          },
          {
            id: 'jackets',
            name: 'Jackets',
          },
        ],
        activeId: 'bomber',
      });
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('opens the children of a category that has some', async () => {
      const { dispatch, getState } = createStore({
        men: {
          id: 'men',
          name: 'Men',
          childrenCount: 4,
          parentCategoriesInfo: [],
        },
      });

      await expect(resolveStartPosition('men')(dispatch, getState)).resolves.toEqual({
        path: [{
          id: 'men',
          name: 'Men',
        }],
        activeId: 'men',
      });
    });

    it('walks up the parents when the ancestors are not delivered', async () => {
      const { dispatch, getState } = createStore({
        bomber: {
          id: 'bomber',
          name: 'Bomber jackets',
          parent: {
            id: 'jackets',
            name: 'Jackets',
          },
        },
      }, {
        jackets: {
          id: 'jackets',
          name: 'Jackets',
          parent: {
            id: 'men',
            name: 'Men',
          },
        },
        men: {
          id: 'men',
          name: 'Men',
          parent: {
            id: null,
            name: null,
          },
        },
      });

      await expect(resolveStartPosition('bomber')(dispatch, getState)).resolves.toEqual({
        path: [
          {
            id: 'men',
            name: 'Men',
          },
          {
            id: 'jackets',
            name: 'Jackets',
          },
        ],
        activeId: 'bomber',
      });
      expect(dispatch).toHaveBeenCalledTimes(2);
    });

    it('loads an unknown category and falls back to the root level when that fails', async () => {
      const { dispatch, getState } = createStore({}, {
        sale: {
          id: 'sale',
          name: 'Sale',
          childrenCount: 2,
          parentCategoriesInfo: [],
        },
      });

      await expect(resolveStartPosition('sale')(dispatch, getState)).resolves.toEqual({
        path: [{
          id: 'sale',
          name: 'Sale',
        }],
        activeId: 'sale',
      });
      await expect(resolveStartPosition('gone')(dispatch, getState)).resolves.toEqual({
        path: [],
        activeId: null,
      });
    });
  });
});
